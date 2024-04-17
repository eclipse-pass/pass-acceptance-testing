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
