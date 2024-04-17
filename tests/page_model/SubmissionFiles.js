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

class SubmissionFiles {
  constructor() {}

  async uploadFile(fileName) {
    const browseFilesButton = Selector('#file-multiple-input');
    await t.expect(browseFilesButton.exists).ok();

    // TODO: Skipping JS errors while file handling is broken
    await t
      .skipJsErrors(true)
      .setFilesToUpload(browseFilesButton, './uploads/' + fileName)
      .expect(Selector('tr[data-test-added-manuscript-row] td').innerText)
      .eql(fileName);
  }

  async clickNextButton() {
    const goToReviewButton = Selector('button').withAttribute(
      'data-test-workflow-files-next'
    );
    await t
      .expect(goToReviewButton.exists)
      .ok()
      .click(goToReviewButton)
      .skipJsErrors(false); // Re-enable JS Error checking
  }

  async clickNextToReview() {
    await this.clickNextButton();
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/review`);
  }

  async clickNextToReviewNoFiles() {
    await this.clickNextButton();

    const noManuscriptAlert = Selector('#swal2-title').withText(
      'No manuscript present'
    );
    await t.expect(noManuscriptAlert.exists).ok();

    const nextPageButton = Selector('.swal2-confirm').withText('OK');
    await t.expect(nextPageButton.exists).ok();
    await t.click(nextPageButton);

    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/review`);
  }
}

export default new SubmissionFiles();
