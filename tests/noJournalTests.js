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

  await submissionBasicPage.inputTitle('PASS_E2E_TEST_NO_JOURNAL');
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

  await submissionMetadataPage.verifyArticleTitle('PASS_E2E_TEST_NO_JOURNAL');
  await submissionMetadataPage.verifyJournalTitle('');
  await submissionMetadataPage.inputAuthor('PASS_E2E_TEST_AUTHOR');
  await submissionMetadataPage.clickNextToFiles();

  await submissionFilesPage.uploadFile('my-submission.pdf');
  await submissionFilesPage.clickNextToReview();

  await submissionReviewPage.verifyTitle('PASS_E2E_TEST_NO_JOURNAL');
  await submissionReviewPage.verifyGrants('TEST_E2E_AWD_NUM');
  await submissionReviewPage.verifyUploadedFiles('my-submission.pdf');
  await submissionReviewPage.clickSubmit();

  await submissionSubmitDialogPage.acceptJScholarship();
  await submissionSubmitDialogPage.confirmDialog();

  await submissionThankYouPage.verify();
  await submissionThankYouPage.clickSubmissionLink();

  await submissionDetailsPage.verifyTitle('PASS_E2E_TEST_NO_JOURNAL');
  await submissionDetailsPage.verifySubmissionStatus(
    'The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available'
  );
  await submissionDetailsPage.verifyGrants('TEST_E2E_AWD_NUM');
  await submissionDetailsPage.verifyRepository('JScholarship');

  await verifyDepositStatusIfNeeded(
    'PASS_E2E_TEST_NO_JOURNAL',
    'JScholarship',
    'completed'
  );
}).disablePageCaching;
