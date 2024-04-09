#! /bin/sh

# The following environment variable are required:
# DEPLOYMENT_BASE_URL: The base url of the PASS env to test
echo "PASS Base URL: $DEPLOYMENT_BASE_URL"

# Note: chromium flag "--auto-open-devtools-for-tabs" breaks Testcafe :(
testcafe \
  'chrome --ignore-certificate-errors --allow-insecure-localhost' \
  --hostname localhost \
  --base-url "$DEPLOYMENT_BASE_URL" \
  --fixture-meta deploymentTest=true \
  tests/*.js
