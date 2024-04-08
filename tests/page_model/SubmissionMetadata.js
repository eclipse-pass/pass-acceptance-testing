import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL } from '../commonTest.js';

class SubmissionMetadata {
  constructor() {}

  async verifyArticleTitle(expectedArticleTitle) {
    const articleTitle = Selector('textarea').withAttribute('name', 'title');
    await t.expect(articleTitle.value).eql(expectedArticleTitle);
  }

  async verifyJournalTitle(expectedJournalTitle) {
    const journalTitle = Selector('input').withAttribute(
      'name',
      'journal-title'
    );
    await t.expect(journalTitle.value).eql(expectedJournalTitle);
  }

  async clickNextToFiles() {
    const goToFilesButton = Selector('.alpaca-form-button-Next');
    await t.expect(goToFilesButton.exists).ok();
    await t.click(goToFilesButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/files`);
  }
}

export default new SubmissionMetadata();
