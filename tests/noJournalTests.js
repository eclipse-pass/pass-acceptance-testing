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
import { fixture, test } from 'testcafe';
import { login, verifyDepositStatusIfNeeded } from './commonTest';
import submissionsPage from './page_model/Submissions';
import submissionBasicPage from './page_model/SubmissionBasic';
import submissionGrantsPage from './page_model/SubmissionGrants';
import submissionPoliciesPage from './page_model/SubmissionPolicies';
import submissionRepositoriesPage from './page_model/SubmissionRepositories';
import submissionMetadataPage from './page_model/SubmissionMetadata.js';
import submissionFilesPage from './page_model/SubmissionFiles.js';
import submissionReviewPage from './page_model/SubmissionReview.js';
import submissionSubmitDialogPage from './page_model/SubmissionSubmitDialog.js';
import submissionThankYouPage from './page_model/SubmissionThankYou.js';
import submissionDetailsPage from './page_model/SubmissionDetails.js';
import dashboardPage from './page_model/Dashboard.js';

fixture`Acceptance Testing: Submission No Journal`.meta({
  deploymentTest: 'true',
});

test('can walk through a submission workflow and make a submission - without selecting a journal', async () => {
  // Log in
  await login('nih-user');

  await dashboardPage.verify();
  await dashboardPage.clickSubmissions();
  await submissionsPage.startSubmission();

  const submissionTitle = `PASS_E2E_TEST_NO_JOURNAL:${new Date().toString()}`;
  await submissionBasicPage.inputTitle(submissionTitle);
  await submissionBasicPage.validateJournalIsEmpty();
  await submissionBasicPage.clickNextToGrants();

  await submissionGrantsPage.selectGrant('TEST_E2E_AWD_NUM');
  await submissionGrantsPage.clickNextToPolicies();

  await submissionPoliciesPage.verifyPolicyExists(
    'Johns Hopkins University (JHU) Open Access Policy'
  );
  await submissionPoliciesPage.clickNextToRepositories();

  await submissionRepositoriesPage.verifyRequiredRepository(
    'JScholarship - PASS_E2E_TEST_FUNDER'
  );
  await submissionRepositoriesPage.clickNextToMetadata();

  await submissionMetadataPage.verifyArticleTitle(submissionTitle);
  await submissionMetadataPage.verifyJournalTitle('');
  await submissionMetadataPage.inputAuthor('PASS_E2E_TEST_AUTHOR');
  await submissionMetadataPage.clickNextToFiles();

  await submissionFilesPage.uploadFile('my-submission.pdf');
  await submissionFilesPage.clickNextToReview();

  await submissionReviewPage.verifyTitle(submissionTitle);
  await submissionReviewPage.verifyGrants('TEST_E2E_AWD_NUM');
  await submissionReviewPage.verifyUploadedFiles('my-submission.pdf');
  await submissionReviewPage.clickSubmit();

  await submissionSubmitDialogPage.acceptJScholarship();
  await submissionSubmitDialogPage.confirmDialog();

  await submissionThankYouPage.verify();
  await submissionThankYouPage.clickSubmissionLink();

  await submissionDetailsPage.verifyTitle(submissionTitle);
  await submissionDetailsPage.verifySubmissionStatus(
    'The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available'
  );
  await submissionDetailsPage.verifyGrants('TEST_E2E_AWD_NUM');
  await submissionDetailsPage.verifyRepository('JScholarship');

  await verifyDepositStatusIfNeeded(
    submissionTitle,
    'JScholarship',
    'completed'
  );
}).disablePageCaching;
