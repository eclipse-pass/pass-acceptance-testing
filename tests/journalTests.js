import { fixture, test } from 'testcafe';
import { login } from './commonTest';
import dashboardPage from './page_model/Dashboard.js';
import submissionsPage from './page_model/Submissions';
import submissionBasicPage from './page_model/SubmissionBasic';
import submissionGrantsPage from './page_model/SubmissionGrants';
import submissionPoliciesPage from './page_model/SubmissionPolicies';
import submissionRepositoriesPage from './page_model/SubmissionRepositories';
import submissionMetadataPage from './page_model/SubmissionMetadata';
import submissionFilesPage from './page_model/SubmissionFiles';
import submissionReviewPage from './page_model/SubmissionReview';
import submissionSubmitDialogPage from './page_model/SubmissionSubmitDialog';
import submissionThankYouPage from './page_model/SubmissionThankYou';
import submissionDetailsPage from './page_model/SubmissionDetails';

fixture`Acceptance Testing: Submission With Journal`.meta({
  deploymentTest: 'true',
});

test('can walk through an submission workflow and make a submission with journal', async () => {
  await login('nih-user');

  await dashboardPage.verify();
  await dashboardPage.clickSubmissions();
  await submissionsPage.startSubmission();

  await submissionBasicPage.inputTitle('PASS_E2E_TEST_SUBMISSION_JOURNAL');
  await submissionBasicPage.selectJournal('PASS_E2E_TEST_JOURNAL');
  await submissionBasicPage.clickNextToGrants();

  await submissionGrantsPage.selectGrant('TEST_E2E_AWD_NUM');
  await submissionGrantsPage.clickNextToPolicies();

  await submissionPoliciesPage.verifyPolicyExists(
    'Johns Hopkins University (JHU) Open Access Policy'
  );
  await submissionPoliciesPage.verifyPolicyNotExists(
    'National Institutes of Health Public Access Policy'
  );
  await submissionPoliciesPage.clickNextToRepositories();

  await submissionRepositoriesPage.verifyRequiredRepository('JScholarship');
  await submissionRepositoriesPage.verifyRequiredRepositoryNotExist(
    'PubMed Central - NATIONAL INSTITUTE OF HEALTH'
  );

  await submissionRepositoriesPage.clickNextToMetadata();

  await submissionMetadataPage.verifyArticleTitle(
    'PASS_E2E_TEST_SUBMISSION_JOURNAL'
  );
  await submissionMetadataPage.verifyJournalTitle('PASS_E2E_TEST_JOURNAL');
  await submissionMetadataPage.inputAuthor('PASS_E2E_TEST_AUTHOR');

  await submissionMetadataPage.clickNextToFiles();

  await submissionFilesPage.uploadFile('my-submission.pdf');
  await submissionFilesPage.clickNextToReview();

  await submissionReviewPage.verifyTitle('PASS_E2E_TEST_SUBMISSION_JOURNAL');
  await submissionReviewPage.verifyJournal('PASS_E2E_TEST_JOURNAL');
  await submissionReviewPage.verifyGrants('TEST_E2E_AWD_NUM');
  await submissionReviewPage.verifyUploadedFiles('my-submission.pdf');
  await submissionReviewPage.clickSubmit();

  await submissionSubmitDialogPage.acceptJScholarship();
  await submissionSubmitDialogPage.confirmDialog();

  await submissionThankYouPage.verify();
  await submissionThankYouPage.clickSubmissionLink();

  await submissionDetailsPage.verifyTitle('PASS_E2E_TEST_SUBMISSION_JOURNAL');
  await submissionDetailsPage.verifySubmissionStatus(
    'The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available'
  );
  await submissionDetailsPage.verifyGrants('TEST_E2E_AWD_NUM');
  await submissionDetailsPage.verifyRepository('JScholarship');
  await submissionDetailsPage.verifyRepositoryNotExist('PubMed Central');

  // TODO if deployment tests, wait for deposit status to flip on jscholarship
}).disablePageCaching;
