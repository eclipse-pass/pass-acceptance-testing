import { t, Selector } from 'testcafe';

class SubmissionSubmitDialog {
  constructor() {}

  async acceptJScholarship() {
    // Agree to terms
    const agreeTermsRadio = Selector('.swal2-radio input').withAttribute(
      'type',
      'radio',
      'value',
      'agree'
    );
    await t
      .expect(agreeTermsRadio.checked)
      .eql(false)
      .click(agreeTermsRadio)
      .expect(agreeTermsRadio.checked)
      .eql(true);

    const nextButton = Selector('.swal2-confirm.swal2-styled').withText('Next');
    await t.expect(nextButton.exists).ok();
    await t.click(nextButton);
  }

  async confirmDialog() {
    const confirmButton = Selector('.swal2-confirm.swal2-styled').withText(
      'Confirm'
    );
    await t.expect(confirmButton.exists).ok();
    await t.click(confirmButton);
  }
}

export default new SubmissionSubmitDialog();
