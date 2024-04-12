#! /bin/sh

# The following environment variable are required:
# DEPLOYMENT_BASE_URL: The base url of the PROD PASS env to test
# DEPLOYMENT_TEST_USER: The test user for deployment tests
# DEPLOYMENT_TEST_PASSWORD: The test user password for deployment tests
echo "PROD PASS Base URL: $DEPLOYMENT_BASE_URL"

# Note: chromium flag "--auto-open-devtools-for-tabs" breaks Testcafe :(
testcafe \
  'chrome --ignore-certificate-errors --allow-insecure-localhost' \
  --hostname localhost \
  --base-url "$DEPLOYMENT_BASE_URL" \
  --fixture-meta prodDeploymentTest=true \
  tests/*.js
