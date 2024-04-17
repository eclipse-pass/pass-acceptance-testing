## Description

Acceptance / smoke tests for the [PASS application](https://github.com/eclipse-pass). This repository will use [TestCafe](https://testcafe.io/) to define smoke tests that can run against an instance of PASS.

## Running Tests

`yarn run test` - runs the acceptance tests against a locally running pass-docker

`yarn run testDeployment` - runs the acceptance tests against a deployed PASS system such as stage or prod.  Please see the `rundeploymenttest.sh` file for required environment variables.

## Prerequisites

* [NodeJS](https://nodejs.org/en/) version 14+
* [Yarn](https://yarnpkg.com/) v1.x - package manager, similar to NPM
