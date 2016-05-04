#!/bin/bash

rm -r .release
rm -r dist
mkdir .release
mkdir .release/quill
npm run build
cp dist/quill.css dist/quill.bubble.css dist/quill.snow.css dist/quill.js .release/quill/
printf "cdn: .\nversion: ." > .release/jekyll.yml
jekyll build -s node_modules/quill-docs -d .release/_site --config node_modules/quill-docs/_config.yml,.release/jekyll.yml
mkdir .release/quill/examples
mv .release/_site/standalone/bubble/index.html .release/quill/examples/bubble.html
mv .release/_site/standalone/snow/index.html .release/quill/examples/snow.html
mv .release/_site/standalone/full/index.html .release/quill/examples/full.html
find .release/quill/examples -type f -exec sed -i "" 's/\<link rel\="icon".*\>/ /g' {} \;
find .release/quill/examples -type f -exec sed -i "" 's/href="\/\//href="https:\/\//g' {} \;
find .release/quill/examples -type f -exec sed -i "" 's/src="\/\//src="https:\/\//g' {} \;
uglifyjs .release/quill/quill.js > .release/quill/quill.min.js
tar -czf .release/quill.tar.gz .release/quill
