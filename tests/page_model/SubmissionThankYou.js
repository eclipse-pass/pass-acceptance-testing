import { t, Selector } from 'testcafe';
import { TIMEOUT_LENGTH } from '../commonTest';
class SubmissionThankYou {
  constructor() {}

  async verify() {
    const thankYouHeading = Selector('h1').withText('Thank you!');
    await t.expect(thankYouHeading.exists).ok();
  }

  async clickSubmissionLink() {
    const linkToSubmission = Selector('a').withText('here');
    await t.expect(linkToSubmission.exists).ok();
    await t.click(linkToSubmission);
    const submissionDetailsBody = Selector('h2', {
      timeout: TIMEOUT_LENGTH,
    }).withText('Submission Detail');
    await t.expect(submissionDetailsBody.exists).ok();
  }
}

export default new SubmissionThankYou();
