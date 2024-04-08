import { t, Selector } from 'testcafe';
import { currLocation, PASS_BASE_URL, TIMEOUT_LENGTH } from '../commonTest.js';

class SubmissionBasic {
  constructor() {
    this.doiInput = Selector('#doi');
    this.titleName = Selector('#title');
    this.journalName = Selector('.form-control').withAttribute(
      'data-test-journal-name-input'
    );
    this.goToGrantsButton = Selector('.btn.btn-primary.pull-right.next');
  }

  async inputDoi(doi) {
    await t.expect(this.doiInput.exists).ok();
    await t.typeText(this.doiInput, doi, { paste: true });
    const toastMessage = Selector('.flash-message', {
      timeout: TIMEOUT_LENGTH,
    }).withText("We've pre-populated information from the DOI provided!");
    await t.expect(toastMessage.exists).ok();
  }

  async inputTitle(title) {
    await t.expect(this.titleName.exists).ok();
    await t.typeText(this.titleName, title, { paste: true });
    await t.expect(this.titleName.value).eql(title);
  }

  async validateTitle(expectedTitle) {
    await t.expect(this.titleName.value).eql(expectedTitle);
  }

  async validateJournal(expectedJournal) {
    await t.expect(this.journalName.value).eql(expectedJournal);
  }

  async validateJournalIsEmpty() {
    const journalPlaceholder = Selector(
      '.ember-power-select-placeholder'
    ).withText('Journal');
    await t.expect(journalPlaceholder.exists).ok();
  }

  async validateTitleAndJournalReadOnly() {
    const expectedTitle = await this.titleName.value;
    await t.typeText(this.titleName, 'title-change');
    await this.validateTitle(expectedTitle);
    const expectedJournal = await this.journalName.value;
    await t.typeText(this.journalName, 'journal-change');
    await this.validateJournal(expectedJournal);
  }

  async clickNextToGrants() {
    await t.expect(this.goToGrantsButton.exists).ok();
    await t.click(this.goToGrantsButton);
    await t
      .expect(currLocation())
      .eql(`${PASS_BASE_URL}/app/submissions/new/grants`);
  }
}

export default new SubmissionBasic();
