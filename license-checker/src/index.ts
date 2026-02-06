/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as core from '@actions/core';
import * as github from '@actions/github';
import * as fs from 'fs';
import { hasValidLicenseHeader } from './license';

// test

async function run(): Promise<void> {
  try {
    const token = core.getInput('github-token') || process.env.GITHUB_TOKEN;
    if (!token) {
      // If no token is provided, we can't fetch PR files reliably if we need the API.
      // However, if we are just checking local files checked out by actions/checkout, we might not need the API
      // IF we utilize 'git diff' manually. But using the API is often robust for 'pull_request' events to get the exact list of changed files.
      // Let's assume we need it for 'pull_request'.
      core.setFailed('GitHub Token is required to fetch changed files.');
      return;
    }

    const octokit = github.getOctokit(token);
    const context = github.context;

    if (context.eventName !== 'pull_request') {
      core.info('This action only runs on pull_request events.');
      return;
    }

    const pull_number = context.payload.pull_request?.number;
    if (!pull_number) {
      core.setFailed('No pull request number found in context.');
      return;
    }

    const owner = context.repo.owner;
    const repo = context.repo.repo;

    core.info(`Checking license headers for PR #${pull_number} in ${owner}/${repo}...`);

    // Fetch all changed files (handling pagination if necessary, though for simplicity we start with top 100 which is default max)
    // For a robust implementation, we should paginate.
    const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
      owner,
      repo,
      pull_number,
      per_page: 100,
    });

    const extensionsToCheck = ['.dart', '.js', '.ts', '.go', '.java'];
    let hasError = false;

    // We only check files that exist on disk (checked out). 
    // If the file was deleted, it won't exist.
    // If the file is renamed, it will exist at the new path.
    
    for (const file of files) {
      // file.status can be 'added', 'modified', 'removed', 'renamed', 'changed', 'copied', 'unchanged'
      if (file.status === 'removed') {
        continue;
      }

      const filename = file.filename;
      const validExtension = extensionsToCheck.some(ext => filename.endsWith(ext));
      
      if (!validExtension) {
        // Skip files that don't match our target extensions
        continue;
      }

      if (!fs.existsSync(filename)) {
        core.warning(`File ${filename} was listed as changed but does not exist on disk. Skipping.`);
        continue;
      }

      const content = fs.readFileSync(filename, 'utf-8');
      if (!hasValidLicenseHeader(content)) {
        core.error(`Missing or invalid license header in: ${filename}`);
        hasError = true;
      } else {
        // core.debug(`Valid license header: ${filename}`);
      }
    }

    if (hasError) {
      core.setFailed('Some files are missing valid license headers. Please check the logs.');
    } else {
      core.info('All checked files have valid license headers.');
    }

  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}

run();
