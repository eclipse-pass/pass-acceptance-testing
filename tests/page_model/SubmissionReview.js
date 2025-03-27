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

class SubmissionReview {
  constructor() {}

  async verifyTitle(expectedTitle) {
    const reviewTitle = Selector('.mb-1').withAttribute(
      'data-test-workflow-review-title'
    );
    await t.expect(reviewTitle.innerText).eql(expectedTitle);
  }

  async verifyJournal(expectedJournal) {
    const reviewJournal = Selector('ul.list-unstyled')
      .child('li')
      .withText('Journal Title : ' + expectedJournal);
    await t.expect(reviewJournal.exists).ok();
  }

  async verifyDoi(expectedDoi) {
    const reviewDoi = Selector('.mb-1').withAttribute(
      'data-test-workflow-review-doi'
    );
    await t.expect(reviewDoi.innerText).eql(expectedDoi);
  }

  async verifyGrants(expectedGrant) {
    const reviewGrants = Selector('ul')
      .withAttribute('data-test-workflow-review-grant-list')
      .child('li')
      .withText(expectedGrant);
    await t.expect(reviewGrants.innerText).contains(expectedGrant);
  }

  async verifyUploadedFiles(expectedFile) {
    const reviewFile = Selector('td')
      .withAttribute('data-test-workflow-review-file-name')
      .withText(expectedFile);
    await t.expect(reviewFile.exists).ok();
  }

  async clickSubmit() {
    const reviewSubmitButton = Selector('button').withAttribute(
      'data-test-workflow-review-submit'
    );
    await t.expect(reviewSubmitButton.exists).ok();
    await t.click(reviewSubmitButton);
  }
}

export default new SubmissionReview();
