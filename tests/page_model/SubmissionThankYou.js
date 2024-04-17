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
