'use strict';

const packager = require('electron-packager');

const opts = {
  dir: './',
  name: 'Shredbeat',
  platform: 'darwin',
  arch: 'x64',
  electronVersion: '1.6.6',
  icon: './designAssets/shredbeat.icns',
  overwrite: true,
  out: './build/'
};

packager(opts, function done(err, appPath) {
  if (err) {
    console.error(err);
  }

  console.log(appPath);
});
