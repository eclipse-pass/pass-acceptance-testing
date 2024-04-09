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
