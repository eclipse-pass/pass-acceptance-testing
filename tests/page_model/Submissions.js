import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class Submissions {
  constructor() {
    this.submissionsHeader = Selector('h1').withText('Submissions');
    this.startNewSubmissionButton = Selector(
      '.ember-view.btn.btn-primary'
    ).withAttribute('href', '/app/submissions/new');
  }

  async verifySubmissionsHeader() {
    await t.expect(this.submissionsHeader.exists).ok();
  }

  async startSubmission() {
    await t.expect(this.startNewSubmissionButton.exists).ok();
    await t.click(this.startNewSubmissionButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/basics`);
  }

  async clickSubmission(submissionTitle) {
    const submissionLink =
      Selector('td.title-column a').withText(submissionTitle);
    await t.expect(submissionLink.exists).ok();
    await t.click(submissionLink);
    await t
      .expect(currLocation())
      .contains(`${PASS_BASE_URL}/app/submissions/`);
  }
}

export default new Submissions();
