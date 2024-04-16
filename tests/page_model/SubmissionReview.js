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
      .withText('Journal title : ' + expectedJournal);
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
