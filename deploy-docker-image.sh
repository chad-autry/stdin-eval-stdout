#!/bin/bash
set -ev;
mkdir -p target/docker-image;
cp ./package.json ./target/docker-image/package.json;
cp ./Dockerfile ./target/docker-image/Dockerfile;
cp ./README.md ./target/docker-image/README.md;
cp ./src ./target/docker-image/src;
cp ./node_modules /target/docker-image/node_modules;
cd target/docker-image
git init
git config user.name ${GH_NAME}
git config user.email ${GH_EMAIL}
git add .
git commit -m "Deployed to docker-image branch"
git push --force "https://${GH_TOKEN}@${GH_REF}" master:docker-image > /dev/null 2>&1