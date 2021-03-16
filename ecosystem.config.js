// FOR USE WITH PM2 TO RUN THIS APP AS A SERVICE
// https://pm2.keymetrics.io/docs/usage/application-declaration/

module.exports = {
  apps : [{
    script: 'index.js',
    watch: '.',
    ignore_watch: ["pixels.json", "color-images/"]
  }],
};
