import { fixture, Selector, test } from 'testcafe';
import { currLocation, TIMEOUT_LENGTH, login } from './commonTest';

fixture`Acceptance Testing`.page`http://localhost:8080`;

test('can walk through an nih submission workflow and make a submission - without selecting a journal', async (t) => {
  // Log in
  login('nih-user');

  // Go to Submissions
  const submissionsButton = Selector('.nav-link.ember-view').withText(
    'Submissions'
  );
  await t.expect(submissionsButton.exists).ok();
  await t.click(submissionsButton);

  await t.expect(currLocation()).eql('http://localhost:8080/app/submissions');

  // Start new Submission
  const startNewSubmissionButton = Selector(
    '.ember-view.btn.btn-primary'
  ).withAttribute('href', '/app/submissions/new');
  await t.expect(startNewSubmissionButton.exists).ok();
  await t.click(startNewSubmissionButton);

  await t
    .expect(currLocation())
    .eql('http://localhost:8080/app/submissions/new/basics');

  // do not enter a DOI and enter a title manually
  const titleName = Selector('#title');
  await t.expect(titleName().exists).ok();
  await t.typeText(titleName, 'My article title', { paste: true });

  // Check that the title and journal values have been filled in
  await t.expect(titleName.value).eql('My article title');

  // Check that the journal has not been filled in
  const journalPlaceholder = Selector(
    '.ember-power-select-placeholder'
  ).withText('Journal');
  await t.expect(journalPlaceholder.exists).ok();

  // Go to Grants
  const goToGrantsButton = Selector('.btn.btn-primary.pull-right.next');
  await t.expect(goToGrantsButton.exists).ok();
  await t.click(goToGrantsButton);

  await t
    .expect(currLocation())
    .eql('http://localhost:8080/app/submissions/new/grants');

  // Select a Grant
  const nihGrant = Selector('#grants-selection-table a').withText('Z0650001');
  await t.expect(nihGrant.exists).ok().click(nihGrant.parent(0).nextSibling(0));

  const submittedGrant = Selector('table')
    .withAttribute('data-test-submission-funding-table')
    .child('tbody')
    .child('tr')
    .child('td')
    .child('a')
    .withText('Z0650001');
  await t.expect(submittedGrant.exists).ok();

  // Go to Policies
  const goToPoliciesButton = Selector('button').withAttribute(
    'data-test-workflow-grants-next'
  );
  await t.expect(goToPoliciesButton.exists).ok();
  await t.click(goToPoliciesButton);

  await t
    .expect(currLocation())
    .eql('http://localhost:8080/app/submissions/new/policies');

  // Check that JHU policy exists
  const jhuRepository = Selector('h3')
    .withAttribute('data-test-policy-title')
    .withText('Johns Hopkins University (JHU) Open Access Policy');
  await t.expect(jhuRepository.exists).ok();

  // Go to Repositories
  const goToRepositoriesButton = Selector('button').withAttribute(
    'data-test-workflow-policies-next'
  );
  await t.expect(goToRepositoriesButton.exists).ok();
  await t.click(goToRepositoriesButton);

  await t
    .expect(currLocation())
    .eql('http://localhost:8080/app/submissions/new/repositories');

  // Check Required Repositories
  const requiredRepositories = Selector('ul')
    .withAttribute('data-test-workflow-repositories-required-list')
    .child('li')
    .withText('JScholarship - SCANDINAVIAN BIOPHARMA');
  await t.expect(requiredRepositories.exists).ok();

  // Go to Metadata
  const goToMetadataButton = Selector('button').withAttribute(
    'data-test-workflow-repositories-next'
  );
  await t.expect(goToMetadataButton.exists).ok();
  await t.click(goToMetadataButton);

  await t
    .expect(currLocation())
    .eql('http://localhost:8080/app/submissions/new/metadata');

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
    .eql('http://localhost:8080/app/submissions/new/files');

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
    .eql('http://localhost:8080/app/submissions/new/review');

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
