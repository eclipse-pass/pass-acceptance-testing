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

class SubmissionDetails {
  constructor() {}

  async verifyTitle(exptectedTitle) {
    const submittedHeading = Selector('h5').withText(exptectedTitle);
    await t.expect(submittedHeading.exists).ok();
  }

  async verifyDoi(expectedDoi) {
    const submittedDoi = Selector('p').withText(expectedDoi);
    await t.expect(submittedDoi.exists).ok();
  }

  async verifySubmissionStatus(expectedStatus) {
    const submissionStatus = Selector('span').withAttribute(
      'tooltip',
      expectedStatus
    );
    await t.expect(submissionStatus.exists).ok();
  }

  async verifyGrants(expectedGrant) {
    const submissionGrants = Selector('li').withText(expectedGrant);
    await t.expect(submissionGrants.exists).ok();
  }

  async verifyRepository(expectedRepo) {
    const submissionRepositoryJScholarship =
      Selector('a').withText(expectedRepo);
    await t.expect(submissionRepositoryJScholarship.exists).ok();
  }

  async verifyRepositoryNotExist(expectedRepo) {
    const submissionRepositoryJScholarship =
      Selector('a').withText(expectedRepo);
    await t.expect(submissionRepositoryJScholarship.exists).notOk();
  }

  async getDepositStatus(depositStatus, repositoryName) {
    const depositStatusDiv = Selector('div.card-body').withText(
      repositoryName + '\n\nDeposit status:\n ' + depositStatus
    );
    return await depositStatusDiv.exists;
  }
}

export default new SubmissionDetails();
