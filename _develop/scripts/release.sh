#!/bin/bash

rm -r .release
rm -r dist
mkdir .release
mkdir .release/quill

npm run build
webpack --minimize --config _develop/webpack.config.js
cp dist/quill.core.css dist/quill.bubble.css dist/quill.snow.css dist/quill.js dist/quill.core.js dist/quill.min.js dist/quill.min.js.map .release/quill/

cd .release

printf "cdn: .\nversion: ." > jekyll.yml
jekyll build -s ../docs -d _site --config ../docs/_config.yml,jekyll.yml

mkdir quill/examples
mv _site/standalone/bubble/index.html quill/examples/bubble.html
mv _site/standalone/snow/index.html quill/examples/snow.html
mv _site/standalone/full/index.html quill/examples/full.html
find quill/examples -type f -exec sed -i "" 's/\<link rel\="icon".*\>/ /g' {} \;
find quill/examples -type f -exec sed -i "" 's/href="\/\//href="https:\/\//g' {} \;
find quill/examples -type f -exec sed -i "" 's/src="\/\//src="https:\/\//g' {} \;

tar -czf quill.tar.gz quill
