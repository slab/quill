#!/bin/bash

npm start &

webdriver-manager start 2> /dev/null &

sleep 20s
wdio _develop/wdio.config.js
EXIT_CODE=$?

FOREMAN_PID=$(pgrep foreman)
SELENIUM_PID=$(pgrep -f selenium-server-standalone)

kill -s SIGINT $FOREMAN_PID
kill -s SIGINT $SELENIUM_PID

echo "\n"

exit $EXIT_CODE
