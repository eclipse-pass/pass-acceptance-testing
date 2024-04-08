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
}

export default new SubmissionDetails();
