#!/bin/bash


set -e
cd "$(dirname "${0}")/.."

git reset --hard
git clean -f -x -d
git pull

ln -f -s ../../config.json config/production.json

npm install
npm run distribute

sudo service codex restart