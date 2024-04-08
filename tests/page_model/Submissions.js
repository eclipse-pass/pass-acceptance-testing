import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class Submissions {
  constructor() {
    this.submissionsLink = Selector('.nav-link.ember-view').withText(
      'Submissions'
    );
    this.startNewSubmissionButton = Selector(
      '.ember-view.btn.btn-primary'
    ).withAttribute('href', '/app/submissions/new');
  }

  async startSubmission() {
    await t.expect(this.submissionsLink.exists).ok();
    await t.click(this.submissionsLink);
    await t.expect(currLocation()).eql(`${PASS_BASE_URL}/app/submissions`);

    await t.expect(this.startNewSubmissionButton.exists).ok();
    await t.click(this.startNewSubmissionButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/basics`);
  }
}

export default new Submissions();
