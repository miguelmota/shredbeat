'use strict';

const packager = require('electron-packager');

const opts = {
  dir: './',
  name: 'shredbeat',
  platform: 'darwin',
  arch: 'x64',
  version: '0.36.1',
  icon: './designAssets/shredbeat.icns',
  overwrite: true
};

packager(opts, function done(err, appPath) {
  if (err) {
    console.error(err);
  }

  console.log(appPath);
});
