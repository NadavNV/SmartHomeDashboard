#!/bin/sh

# If BACKEND_URL is provided, render nginx.conf from template
if [ -n "$BACKEND_URL" ]; then
  echo "Generating nginx.conf from template with BACKEND_URL=$BACKEND_URL"
  envsubst '${BACKEND_URL}' < /etc/nginx/nginx.conf.template > /etc/nginx/conf.d/default.conf
else
  echo "Using default nginx.conf"
fi

exec "$@"