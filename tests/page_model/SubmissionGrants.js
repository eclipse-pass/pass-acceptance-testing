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

class SubmissionGrants {
  constructor() {
    this.goToPoliciesButton = Selector('button').withAttribute(
      'data-test-workflow-grants-next'
    );
  }

  async selectGrant(grant) {
    const nihGrant = Selector('#grants-selection-table a').withText(grant);
    await t
      .expect(nihGrant.exists)
      .ok()
      .click(nihGrant.parent(0).nextSibling(0));

    const submittedGrant = Selector('table')
      .withAttribute('data-test-submission-funding-table')
      .child('tbody')
      .child('tr')
      .child('td')
      .child('a')
      .withText(grant);
    await t.expect(submittedGrant.exists).ok();
  }

  async clickNextToPolicies() {
    await t.expect(this.goToPoliciesButton.exists).ok();
    await t.click(this.goToPoliciesButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/policies`);
  }
}

export default new SubmissionGrants();
