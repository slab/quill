#!/bin/bash

if [ "$TRAVIS_BRANCH" != "master" ] || [ "$TRAVIS_PULL_REQUEST" != "false" ]
then
  export SAUCE_USERNAME=quill
  export SAUCE_ACCESS_KEY=adc0c0cf-221b-46f1-81b9-a4429b722c2e
fi
