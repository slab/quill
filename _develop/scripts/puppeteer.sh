#!/bin/bash

npm start &
sleep 20s
./node_modules/.bin/jasmine test/functional/epic.js
EXIT_CODE=$?

FOREMAN_PID=$(pgrep foreman)
kill -s SIGINT $FOREMAN_PID

exit $EXIT_CODE
