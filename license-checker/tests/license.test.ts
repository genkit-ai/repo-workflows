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

import { hasValidLicenseHeader, COPYRIGHT_REGEX } from '../src/license';

const FULL_LICENSE_TEXT = `
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
`;


describe('License Header Checks', () => {
  test('should validate correct Apache 2.0 header with Google LLC copyright', () => {
    const content = `
/*
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

import { foo } from 'bar';
`;
    expect(hasValidLicenseHeader(content)).toBe(true);
  });

  test('should validate correct header with multiple copyright lines', () => {
    const content = `
/*
 * Copyright 2020 Some Other Company
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
`;
    expect(hasValidLicenseHeader(content)).toBe(true);
  });

  test('should validate Python/Shell style comments (#)', () => {
    const content = `
# Copyright 2024 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
`;
    expect(hasValidLicenseHeader(content)).toBe(true);
  });

  test('should validate Dart style comments (//)', () => {
    const content = `// Copyright 2024 Google LLC\n// ` + FULL_LICENSE_TEXT.split('\n').join('\n// ');
    expect(hasValidLicenseHeader(content)).toBe(true);
  });

  test('should validate correct header with different year', () => {
    const content = `// Copyright 2025 Google LLC\n// ` + FULL_LICENSE_TEXT.split('\n').join('\n// ');
    expect(hasValidLicenseHeader(content)).toBe(true);
  });

  test('should fail if Apache 2.0 license is missing', () => {
    const content = `
/*
 * Copyright 2024 Google LLC
 * All rights reserved.
 */
`;
    expect(hasValidLicenseHeader(content)).toBe(false);
  });

  test('should fail if Google LLC copyright is missing', () => {
    const content = `
/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
`;
    expect(hasValidLicenseHeader(content)).toBe(false);
  });

  test('should fail if copyright year is invalid format', () => {
    // Regex expects 20\d\d
    const content = `// Copyright 1999 Google LLC\n// Licensed under the Apache License, Version 2.0 (the "License");`;
    expect(hasValidLicenseHeader(content)).toBe(false);
  });

  test('should fail if header is too far down', () => {
    const lines = Array(100).fill('// some code').join('\n');
    const content = lines + `
/*
 * Copyright 2024 Google LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
`;
    expect(hasValidLicenseHeader(content)).toBe(false);
  });
  test('should fail if license text is incomplete (partial match)', () => {
    const content = `
/*
 * Copyright 2024 Google LLC
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 */
`;
    expect(hasValidLicenseHeader(content)).toBe(false);
  });
});
