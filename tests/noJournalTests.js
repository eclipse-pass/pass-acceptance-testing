import { fixture, test } from 'testcafe';
import { login } from './commonTest';
import submissionsPage from './page_model/Submissions';
import submissionBasic from './page_model/SubmissionBasic';
import submissionGrantsPage from './page_model/SubmissionGrants';
import submissionPoliciesPage from './page_model/SubmissionPolicies';
import submissionRepositoriesPage from './page_model/SubmissionRepositories';
import submissionMetadataPage from './page_model/SubmissionMetadata.js';
import submissionFilesPage from './page_model/SubmissionFiles.js';
import submissionReviewPage from './page_model/SubmissionReview.js';
import submissionSubmitDialogPage from './page_model/SubmissionSubmitDialog.js';
import submissionThankYouPage from './page_model/SubmissionThankYou.js';
import submissionDetailsPage from './page_model/SubmissionDetails.js';

fixture`Acceptance Testing: No Journal`;

test('can walk through an nih submission workflow and make a submission - without selecting a journal', async () => {
  // Log in
  login('nih-user');

  await submissionsPage.startSubmission();

  await submissionBasic.inputTitle('My article title');
  await submissionBasic.validateJournalIsEmpty();
  await submissionBasic.clickNextToGrants();

  await submissionGrantsPage.selectGrant('Z0650001');
  await submissionGrantsPage.clickNextToPolicies();

  await submissionPoliciesPage.verifyJhuPolicy();
  await submissionPoliciesPage.clickNextToRepositories();

  await submissionRepositoriesPage.verifyRequiredRepository(
    'JScholarship - SCANDINAVIAN BIOPHARMA'
  );
  await submissionRepositoriesPage.clickNextToMetadata();

  await submissionMetadataPage.verifyArticleTitle('My article title');
  await submissionMetadataPage.verifyJournalTitle('');
  await submissionMetadataPage.inputAuthor('Moo author');
  await submissionMetadataPage.clickNextToFiles();

  await submissionFilesPage.uploadFile('my-submission.pdf');
  await submissionFilesPage.clickNextToReview();

  await submissionReviewPage.verifyTitle('My article title');
  await submissionReviewPage.verifyGrants('Z0650001');
  await submissionReviewPage.verifyUploadedFiles('my-submission.pdf');
  await submissionReviewPage.clickSubmit();

  await submissionSubmitDialogPage.acceptJScholarship();
  await submissionSubmitDialogPage.confirmDialog();

  await submissionThankYouPage.verify();
  await submissionThankYouPage.clickSubmissionLink();

  await submissionDetailsPage.verifyTitle('My article title');
  await submissionDetailsPage.verifySubmissionStatus(
    'The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available'
  );
  await submissionDetailsPage.verifyGrants('Z0650001');
  await submissionDetailsPage.verifyRepository('JScholarship');
}).disablePageCaching;
