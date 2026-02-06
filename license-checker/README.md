# Genkit License Checker

A GitHub Action to enforce Apache 2.0 license headers in Pull Requests for Genkit repositories.

## Overview

This action verifies that all modified files in a PR (with extensions `.dart`, `.js`, `.ts`, `.go`, `.java`) contain:
1.  **Full Apache 2.0 License Text**: The standard boilerplate text must be present.
2.  **Google Copyright**: Matches `Copyright 20\d\d Google LLC`.

It supports various comment styles (`//`, `#`, `/* */`) and handles multiple copyright lines correctly.

## Usage

Add this action to your workflow (e.g., `.github/workflows/license-check.yml`):

```yaml
name: License Check

on:
  pull_request:

jobs:
  check-license:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Check License Headers
        uses: genkit-ai/repo-workflows/license-checker@main
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

## Inputs

| Input | Description | Required | Default |
| :--- | :--- | :--- | :--- |
| `github-token` | GitHub Token to fetch PR details. | No | `${{ github.token }}` |
| `exclude` | Glob patterns to exclude files (comma separated). | No | *(empty)* |

## Development

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run tests**:
    ```bash
    npm test
    ```

3.  **Build**:
    ```bash
    npm run build
    ```
    This compiles the TypeScript code into `dist/index.js` which is used by the action.
