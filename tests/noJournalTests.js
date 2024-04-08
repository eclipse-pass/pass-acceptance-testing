import { fixture, Selector, test } from 'testcafe';
import {
  currLocation,
  TIMEOUT_LENGTH,
  login,
  PASS_BASE_URL,
} from './commonTest';
import submissionsPage from './page_model/Submissions';
import submissionBasic from './page_model/SubmissionBasic';
import submissionGrantsPage from './page_model/SubmissionGrants';
import submissionPoliciesPage from './page_model/SubmissionPolicies';
import submissionRepositoriesPage from './page_model/SubmissionRepositories';

fixture`Acceptance Testing: No Journal`;

test('can walk through an nih submission workflow and make a submission - without selecting a journal', async (t) => {
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

  // Check Article Title
  const articleTitle = Selector('textarea').withAttribute('name', 'title');
  await t.expect(articleTitle.value).eql('My article title');

  // Check Journal Title
  const journalTitle = Selector('input').withAttribute('name', 'journal-title');
  await t.expect(journalTitle.value).eql('');

  // Fill in an author
  const authorInput = Selector('input').withAttribute(
    'name',
    'authors_0_author'
  );
  await t
    .expect(authorInput.exists)
    .ok()
    .typeText(authorInput, 'Moo author', { paste: true, speed: 0.75 });

  // Go to Files
  const goToFilesButton = Selector('.alpaca-form-button-Next');
  await t.expect(goToFilesButton.exists).ok();
  await t.click(goToFilesButton);

  await t
    .expect(currLocation())
    .eql(`${PASS_BASE_URL}/app/submissions/new/files`);

  // Get Browse Files button
  const browseFilesButton = Selector('#file-multiple-input');
  await t.expect(browseFilesButton.exists).ok();

  // Upload File
  // TODO: Skipping JS errors while file handling is broken
  await t
    .skipJsErrors(true)
    .setFilesToUpload(browseFilesButton, './uploads/my-submission.pdf')
    .expect(Selector('tr[data-test-added-manuscript-row] td').innerText)
    .eql('my-submission.pdf');

  // Go to Review
  const goToReviewButton = Selector('button').withAttribute(
    'data-test-workflow-files-next'
  );
  await t
    .expect(goToReviewButton.exists)
    .ok()
    .click(goToReviewButton)
    .skipJsErrors(false); // Re-enable JS Error checking

  await t
    .expect(currLocation())
    .eql(`${PASS_BASE_URL}/app/submissions/new/review`);

  // Review Title
  const reviewTitle = Selector('.mb-1').withAttribute(
    'data-test-workflow-review-title'
  );
  await t.expect(reviewTitle.innerText).eql('My article title');

  // Review Grant List
  const reviewGrants = Selector('ul')
    .withAttribute('data-test-workflow-review-grant-list')
    .child('li')
    .withText('Z0650001');
  await t.expect(reviewGrants.innerText).contains('Z0650001');

  // Review Uploaded File
  const reviewFile = Selector('td')
    .withAttribute('data-test-workflow-review-file-name')
    .withText('my-submission.pdf');
  await t.expect(reviewFile.exists).ok();

  // Submit
  const reviewSubmitButton = Selector('button').withAttribute(
    'data-test-workflow-review-submit'
  );
  await t.expect(reviewSubmitButton.exists).ok();
  await t.click(reviewSubmitButton);

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

  // Next Button
  const nextButton = Selector('.swal2-confirm.swal2-styled').withText('Next');
  await t.expect(nextButton.exists).ok();
  await t.click(nextButton);

  // Confirm Button
  const confirmButton = Selector('.swal2-confirm.swal2-styled').withText(
    'Confirm'
  );
  await t.expect(confirmButton.exists).ok();
  await t.click(confirmButton);

  // Thank You Page
  const thankYouHeading = Selector('h1').withText('Thank you!');
  await t.expect(thankYouHeading.exists).ok();

  // Click to submittion detail for validation
  const linkToSubmission = Selector('a').withText('here');
  await t.expect(linkToSubmission.exists).ok();
  await t.click(linkToSubmission);

  const submissionDetailsBody = Selector('h2', {
    timeout: TIMEOUT_LENGTH,
  }).withText('Submission Detail');
  await t.expect(submissionDetailsBody.exists).ok();

  // Submission heading
  const submittedHeading = Selector('h5').withText('My article title');
  await t.expect(submittedHeading.exists).ok();

  // Submission Status
  const submissionStatus = Selector('span').withAttribute(
    'tooltip',
    'The submission was successfully created. PASS will deposit this work into the target repositories and provide a link and feedback where available'
  );
  await t.expect(submissionStatus.exists).ok();

  // Grant status
  const submissionGrants = Selector('li').withText('Z0650001');
  await t.expect(submissionGrants.exists).ok();

  // Repository statuses
  const submissionRepositoryJScholarship =
    Selector('a').withText('JScholarship');
  await t.expect(submissionRepositoryJScholarship.exists).ok();
}).disablePageCaching;
