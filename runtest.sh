#! /bin/sh

# Note: chromium flag "--auto-open-devtools-for-tabs" breaks Testcafe :(
testcafe \
  'chrome --ignore-certificate-errors --allow-insecure-localhost' \
  --hostname localhost \
  tests/*.js
