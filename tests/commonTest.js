import { Selector, Role, ClientFunction } from 'testcafe';

const userNih = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'nih-user')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

const userIncompleteNih = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'incomplete-nih-user')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

const userStaff1 = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'staff1')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

const userAdminSubmitter = Role('https://pass.local', async t =>{
    await t
        .click('#login-button')
        .typeText(Selector('#username'), 'admin-submitter')
        .typeText(Selector('#password'), 'moo')
        .click(Selector(".form-element.form-button"));
});

const currLocation = ClientFunction((() => window.location.href));

module.exports = {
    userNih,
    userIncompleteNih,
    userStaff1,
    userAdminSubmitter,
    currLocation,
};
