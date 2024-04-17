/*
 * Copyright 2024 Johns Hopkins University
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
import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class SubmissionPolicies {
  constructor() {}

  async verifySelectedPolicy() {
    const currPolicy = Selector('input').withAttribute(
      'data-test-workflow-policies-radio-no-direct-deposit'
    );
    await t.expect(currPolicy.checked).eql(true);
  }

  async verifyPolicyExists(policyTitle) {
    const jhuRepository = Selector('h3')
      .withAttribute('data-test-policy-title')
      .withText(policyTitle);
    await t.expect(jhuRepository.exists).ok();
  }

  async verifyPolicyNotExists(policyTitle) {
    const jhuRepository = Selector('h3')
      .withAttribute('data-test-policy-title')
      .withText(policyTitle);
    await t.expect(jhuRepository.exists).notOk();
  }

  async clickNextToRepositories() {
    const goToRepositoriesButton = Selector('button').withAttribute(
      'data-test-workflow-policies-next'
    );
    await t.expect(goToRepositoriesButton.exists).ok();
    await t.click(goToRepositoriesButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/repositories`);
  }
}

export default new SubmissionPolicies();
