# Deployment
1. turned into a service with PM2 (https://pm2.keymetrics.io/docs/usage/application-declaration/)
2. internal port on the webserver is 4242
3. apache2 redirects requests to pixels.rpghelpers.com to local port 4242 via proxy