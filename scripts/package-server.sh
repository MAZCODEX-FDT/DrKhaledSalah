#!/usr/bin/env bash
# Makes clinic-server.zip: the Laravel backend with the built website, ready to upload to Bluehost.
set -euo pipefail
cd "$(dirname "$0")/.."
npm run build:server
rm -rf .pkg && mkdir .pkg
mkdir .pkg/clinic
tar -C backend --exclude=./vendor --exclude=./.git --exclude=./.env --exclude='./database/*.sqlite' --exclude='./storage/logs/*.log' \
  --exclude='./storage/framework/sessions/*' --exclude='./storage/framework/views/*' --exclude='./storage/framework/cache/data/*' \
  --exclude=./public/uploads --exclude=./tests -cf - . | tar -C .pkg/clinic -xf -
(cd .pkg/clinic && composer install --no-dev --prefer-dist --optimize-autoloader --no-interaction -q)
find .pkg/clinic/vendor -name .git -type d -prune -exec rm -rf {} +
rm -f clinic-server.zip && (cd .pkg && zip -qr ../clinic-server.zip clinic)
rm -rf .pkg
echo "clinic-server.zip is ready (see backend/DEPLOY.md)"
