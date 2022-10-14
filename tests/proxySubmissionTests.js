import { Selector } from 'testcafe';
const commonTest = require("./commonTest");

fixture `Acceptance Testing`
    .page`https://pass.local`;

test( 'can walk through a proxy submission workflow and make a submission - with pass account', async t => {

    // use role
    await t.useRole(commonTest.userNih);

    // Go to Submissions
    const submissionsButton = Selector('.nav-link.ember-view').withExactText('Submissions');
    await t.expect(submissionsButton.exists).ok();
    await t.click(submissionsButton);

    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions');

    // Start new Submission
    const startNewSubmissionButton = Selector('.ember-view.btn.btn-primary.btn-small.pull-right').withAttribute('href', '/app/submissions/new');
    await t.expect(startNewSubmissionButton.exists).ok();
    await t.click(startNewSubmissionButton);

    // Select Proxy Submission button
    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions/new/basics');
    const proxyRadioButton = Selector('input').withAttribute('data-test-proxy-radio-button');
    await t.expect(proxyRadioButton.exists).ok();
    await t.click(proxyRadioButton);

    const proxyInputBlock = Selector('#proxy-input-block');
    await t.expect(proxyInputBlock.exists).ok();

    // Input search term
    const proxySearchInput = Selector('input').withAttribute('data-test-proxy-search-input');
    await t.expect(proxySearchInput.exists).ok();
    await t.typeText(proxySearchInput(), 'Staff');
    await t.expect(proxySearchInput.value).eql('Staff');
    const searchForUsers = Selector('#search-for-users');
    await t.expect(searchForUsers.exists).ok();
    await t.click(searchForUsers);

    // Check search results
    const searchResultsModal = Selector('.ember-modal-dialog');
    await t.expect(searchResultsModal.exists).ok();
    const userHasGrantsLink = Selector('a').withAttribute('data-test-found-proxy-user').withText('staffWithGrants@jhu.edu');
    await t.expect(userHasGrantsLink.exists).ok();
    // Select Submitter
    await t.click(userHasGrantsLink);
    await t.expect(searchResultsModal.exists).notOk();

    const selectedUser = Selector('p').withText('Currently selected submitter:');
    await t.expect(selectedUser.innerText).contains("Staff Hasgrants");
    
    await walkThroughSubmissionFlow(t, true);

}).timeouts({
    pageLoadTimeout:    60000,
    pageRequestTimeout: 60000,
    ajaxRequestTimeout: 60000,
}).disablePageCaching;

test('can walk through a proxy submission workflow and make a submission - without pass account', async t => {

    // use role
    await t.useRole(commonTest.userNih);

    // Go to Submissions
    const submissionsButton = Selector('.nav-link.ember-view', {timeout: 15000}).withExactText('Submissions');
    await t.expect(submissionsButton.exists).ok();
    await t.click(submissionsButton);

    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions');

    // Start new Submission
    const startNewSubmissionButton = Selector('.ember-view.btn.btn-primary.btn-small.pull-right').withAttribute('href', '/app/submissions/new');
    await t.expect(startNewSubmissionButton.exists).ok();
    await t.click(startNewSubmissionButton);

    // Select Proxy Submission button
    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions/new/basics');
    const proxyRadioButton = Selector('input').withAttribute('data-test-proxy-radio-button');
    await t.expect(proxyRadioButton.exists).ok();
    await t.click(proxyRadioButton);

    const proxyInputBlock = Selector('#proxy-input-block');
    await t.expect(proxyInputBlock.exists).ok();

    // Input name and email of submitter
    const submitterEmailInput = Selector('input').withAttribute('data-test-proxy-submitter-email-input');
    await t.expect(submitterEmailInput.exists).ok();
    await t.typeText(submitterEmailInput, 'nopass@account.com');
    await t.expect(submitterEmailInput.value).eql('nopass@account.com');

    const submitterNameInput = Selector('input').withAttribute('data-test-proxy-submitter-name-input');
    await t.expect(submitterNameInput.exists).ok();
    await t.typeText(submitterNameInput, 'John Moo');
    await t.expect(submitterNameInput.value).eql('John Moo');

    await walkThroughSubmissionFlow(t, false);

}).timeouts({
    pageLoadTimeout:    60000,
    pageRequestTimeout: 60000,
    ajaxRequestTimeout: 60000,
}).disablePageCaching;

// t should be the test's promise, hasAccount should be a Bool
async function walkThroughSubmissionFlow(t, hasAccount){

    // DOI
    const doiInput = Selector('#doi');
    await t.expect(doiInput().exists).ok();
    await t.typeText(doiInput, '10.1039/c7an01256j', { paste: true });
    const toastMessage = Selector('.toast-message', {timeout: 60000}).withText("We've pre-populated information from the DOI provided!");
    await t.expect(toastMessage.exists).ok();

    // Check that the title and journal values have been filled in
    const titleName = Selector('#title');
    await t.expect(titleName.value)
        .eql('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');
    
    const journalName = Selector('.form-control').withAttribute('data-test-journal-name-input');
    await t.expect(journalName.value).eql('The Analyst');
    
    // Check that the title and journal values cannot be edited
    await t.typeText(titleName, 'moo');
    await t.expect(titleName.value)
        .eql('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');
    
    await t.typeText(journalName, 'moo');
    await t.expect(journalName.value).eql('The Analyst');
    
    // Go to Grants
    const goToGrantsButton = Selector('.btn.btn-primary.pull-right.next');
    await t.expect(goToGrantsButton.exists).ok();
    await t.click(goToGrantsButton);
    
    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions/new/grants');

    if (hasAccount){
        // Select a Grant
        const hasGrantsGrant = Selector('#grants-selection-table a').withText('R124');
        await t.expect(hasGrantsGrant.exists).ok();

        await t.click(hasGrantsGrant().parent(0));
        const submittedGrant = Selector('table').withAttribute('data-test-submission-funding-table')
            .child('tbody').child('tr').child('td').child('a').withText('R124');
        await t.expect(submittedGrant.exists).ok();
    }
    else{
        // Check that the No Account message is appearing
        const hasNoGrantsMessage = Selector('p').withAttribute('data-test-workflow-grants-no-account-message');
        await t.expect(hasNoGrantsMessage.innerText).eql("Because the person you are submitting on behalf of is not yet in our system, PASS does not have information about his/her grant(s) and cannot associate this submission with a grant. Please click Next to continue.");
    }

    // Go to Policies
    const goToPoliciesButton = Selector('button').withAttribute('data-test-workflow-grants-next');
    await t.expect(goToPoliciesButton.exists).ok();
    await t.click(goToPoliciesButton);

    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions/new/policies');
    
    // Nothing to select here, move to Repositories page
    const goToRepositoriesButton = Selector('button').withAttribute('data-test-workflow-policies-next');
    await t.expect(goToRepositoriesButton.exists).ok();
    await t.click(goToRepositoriesButton);
    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions/new/repositories');

    // Check Required Repositories
    const requiredRepositories = Selector('ul')
        .withAttribute('data-test-workflow-repositories-required-list').child('li').withExactText('JScholarship');
    await t.expect(requiredRepositories.exists).ok();

    // Go to Metadata
    const goToMetadataButton = Selector('button').withAttribute('data-test-workflow-repositories-next');
    await t.expect(goToMetadataButton.exists).ok();
    await t.click(goToMetadataButton);

    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions/new/metadata');

    // Check Article Title
    const articleTitle = Selector('textarea').withAttribute('name', 'title');
    await t.expect(articleTitle.value)
        .eql('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');

    // Check Journal Title
    const journalTitle = Selector('input').withAttribute('name', 'journal-title');
    await t.expect(journalTitle.value)
        .eql('The Analyst');
    
    // Go to Files
    const goToFilesButton = Selector('.alpaca-form-button-Next');
    await t.expect(goToFilesButton.exists).ok();
    await t.click(goToFilesButton);

    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions/new/files');

    // Upload no file here
    const goToReviewButton = Selector('button').withAttribute('data-test-workflow-files-next');
    await t.expect(goToReviewButton.exists).ok();
    await t.click(goToReviewButton);

    const noManuscriptAlert = Selector('#swal2-title').withExactText('No manuscript present');
    await t.expect(noManuscriptAlert.exists).ok();

    const nextPageButton = Selector('.swal2-confirm').withExactText('OK');
    await t.expect(nextPageButton.exists).ok();
    await t.click(nextPageButton);

    await t.expect(commonTest.currLocation()).eql('https://pass.local/app/submissions/new/review');

    // Go to Review
    // Review Title
    const reviewTitle = Selector('.mb-1').withAttribute('data-test-workflow-review-title');
    await t.expect(reviewTitle.innerText)
        .eql('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');
    
    // Review DOI
    const reviewDoi = Selector('.mb-1').withAttribute('data-test-workflow-review-doi');
    await t.expect(reviewDoi.innerText).eql('10.1039/c7an01256j');

    // Rf grants are present, review here
    if (hasAccount){
        const reviewGrants = Selector('ul').withAttribute('data-test-workflow-review-grant-list').child('li').withText('R124');
        await t.expect(reviewGrants.innerText).contains('R124');
    }

    // Review that this is a proxy submission
    const submitterComment = Selector('p').withAttribute('data-test-workflow-review-submitter').withText('This submission is prepared on behalf of');
    await t.expect(submitterComment.exists).ok();
    if (hasAccount){
        await t.expect(submitterComment.innerText).contains('Staff Hasgrants');
    }
    else{
        await t.expect(submitterComment.innerText).contains('John Moo');
    }

    // Submit
    const reviewSubmitButton = Selector('button').withAttribute('data-test-workflow-review-submit');
    await t.expect(reviewSubmitButton.innerText).eql('Request approval');
    await t.click(reviewSubmitButton);

    // Thank You Page
    const thankYouHeading = Selector('h1').withExactText('Thank you!');
    await t.expect(thankYouHeading.exists).ok();

    // Click to submittion detail for validation
    const linkToSubmission = Selector('a').withExactText('here');
    await t.expect(linkToSubmission.exists).ok();
    await t.click(linkToSubmission);

    // Submission heading
    const submittedHeading = Selector('h5')
        .withExactText('Quantitative profiling of carbonyl metabolites directly in crude biological extracts using chemoselective tagging and nanoESI-FTMS');
    await t.expect(submittedHeading.exists).ok();

    // Submission DOI
    const submittedDoi = Selector('p').withExactText('DOI: 10.1039/c7an01256j');
    await t.expect(submittedDoi.exists).ok();

    // Submission Status
    const submissionStatus = Selector('span').withAttribute('tooltip', 'This submission has been prepared on behalf of the designated submitter and is awaiting approval before being submitted.');
    await t.expect(submissionStatus.exists).ok();

    // Grant status
    if (hasAccount){
        const submissionGrants = Selector('li').withText('R124');
        await t.expect(submissionGrants.exists).ok();
    }
}
