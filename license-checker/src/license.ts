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

const REQUIRED_LICENSE_TEXT_NORMALIZED = `
Licensed under the Apache License Version 2 0 the License
you may not use this file except in compliance with the License
You may obtain a copy of the License at
http www apache org licenses LICENSE 2 0
Unless required by applicable law or agreed to in writing software
distributed under the License is distributed on an AS IS BASIS
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND either express or implied
See the License for the specific language governing permissions and
limitations under the License
`.replace(/\s+/g, ' ').trim().toLowerCase();

export const COPYRIGHT_REGEX = /Copyright 20\d\d Google LLC/i;

function normalize(text: string): string {
  // Replace all non-alphanumeric characters with spaces, then collapse whitespace
  return text.replace(/[^a-zA-Z0-9]/g, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
}

export function hasValidLicenseHeader(content: string): boolean {
  // We check for both the full Apache 2.0 text and the Google LLC copyright.
  // The header usually resides at the top of the file, but we'll search the first 50 lines to be safe and efficient.
  const headerPreview = content.split('\n').slice(0, 50).join('\n');

  const normalizedPreview = normalize(headerPreview);

  const hasCopyright = COPYRIGHT_REGEX.test(headerPreview);
  const hasFullLicense = normalizedPreview.includes(REQUIRED_LICENSE_TEXT_NORMALIZED);

  return hasCopyright && hasFullLicense;
}
