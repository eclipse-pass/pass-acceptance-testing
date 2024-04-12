import { Selector, ClientFunction, t } from 'testcafe';
import minimist from 'minimist';

export const PASS_BASE_URL = minimist(process.argv.slice(2))['base-url'];
const FILTER_METADATA = minimist(process.argv.slice(2))['fixture-meta'];
const IS_DEPLOYMENT_TEST =
  FILTER_METADATA && FILTER_METADATA.toLowerCase().includes('deploymenttest');

const LOGIN_URL = `${PASS_BASE_URL}/app/`;

export const USER = {
  NIH_USER: 'nih-user',
  ADMIN_SUBMITTER: 'admin-submitter',
};

export async function login(usr) {
  return IS_DEPLOYMENT_TEST ? loginSsoMs() : loginLocal(usr);
}

async function loginLocal(usr) {
  return t
    .navigateTo(LOGIN_URL)
    .typeText('#username', usr)
    .typeText('#password', 'moo')
    .click('.form-element.form-button');
}

async function loginSsoMs() {
  const user = process.env.DEPLOYMENT_TEST_USER;
  const password = process.env.DEPLOYMENT_TEST_PASSWORD;
  return t
    .navigateTo(LOGIN_URL)
    .typeText('input[type="email"]', user)
    .click('input[type="submit"]')
    .typeText('input[type="password"]', password)
    .click('input[type="submit"]');
}

export async function logout() {
  return await t
    .click('#user-menu-name') // Open the app menu to make logout btn visible
    .click(Selector('#user-menu a').withText('Logout'));
}

export const currLocation = ClientFunction(() => window.location.href);

// set in milliseconds
export const TIMEOUT_LENGTH = parseInt(process.env.TIMEOUT_LENGTH) || 60000;
