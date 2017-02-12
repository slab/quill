#!/bin/bash

VERSION="$1"

if [ -z "$VERSION" ]; then
  echo "Version required."
  exit
else
  echo "Releasing $VERSION"
fi

rm -r .release
rm -r dist
mkdir .release
mkdir .release/quill

npm run build
webpack --config _develop/webpack.config.js --env.minimize
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

aws s3 cp quill/quill.js s3://cdn.quilljs.com/$VERSION/ --cache-control max-age=604800 --content-type "application/javascript; charset=utf-8" --profile quill
aws s3 cp quill/quill.min.js s3://cdn.quilljs.com/$VERSION/ --cache-control max-age=604800 --content-type "application/javascript; charset=utf-8" --profile quill
aws s3 cp quill/quill.core.js s3://cdn.quilljs.com/$VERSION/ --cache-control max-age=604800 --content-type "application/javascript; charset=utf-8" --profile quill
aws s3 cp quill/quill.bubble.css s3://cdn.quilljs.com/$VERSION/ --cache-control max-age=604800 --content-type "text/css; charset=utf-8" --profile quill
aws s3 cp quill/quill.core.css s3://cdn.quilljs.com/$VERSION/ --cache-control max-age=604800 --content-type "text/css; charset=utf-8" --profile quill
aws s3 cp quill/quill.snow.css s3://cdn.quilljs.com/$VERSION/ --cache-control max-age=604800 --content-type "text/css; charset=utf-8" --profile quill
aws s3 cp quill/quill.min.js.map s3://cdn.quilljs.com/$VERSION/ --cache-control max-age=604800 --content-type "application/json; charset=utf-8" --profile quill
aws s3 sync s3://cdn.quilljs.com/$VERSION/ s3://cdn.quilljs.com/latest/ --profile quill

cd ..
git tag v$VERSION -m "Version $VERSION"
git push origin v$VERSION
git push origin master

npm publish
