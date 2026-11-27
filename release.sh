#!/bin/bash

set -eo pipefail

PACKAGE=$(node -p "require('./packages/quill/package.json').name")
VERSION=$(node -p "require('./packages/quill/package.json').version")

if [ -n "$(npm view "$PACKAGE@$VERSION" version 2> /dev/null)" ]
then
  echo "Version $VERSION already published."
  exit 0
fi

npm run build:quill

if [ -n "$(npm view "$PACKAGE@>$VERSION" version 2> /dev/null)" ]
then
  COMMIT=$(git rev-parse HEAD)
  BRANCH_TIP=$(git ls-remote --exit-code origin "${GITHUB_REF:?}" | cut -f1)

  if [ "$COMMIT" != "$BRANCH_TIP" ]
  then
    echo "Version $VERSION superseded by a newer published version."
    exit 0
  fi
fi

echo "Publishing version $VERSION"
npm publish packages/quill/dist --tag latest

if ! git tag "$VERSION" || ! git push origin "refs/tags/$VERSION"
then
  echo "Published $VERSION but could not tag it." >&2
fi
