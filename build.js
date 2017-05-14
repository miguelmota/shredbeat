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
  out: './build/',
  ignore: [
    /designAssets/,
    /build.js/,
    /LICENSE.md/,
    /README.md/,
    /screenshot.png/
  ]
};

packager(opts, function done(err, appPath) {
  if (err) {
    console.error(err);
  }

  console.log(appPath);
});

const optsLinux = {
  dir: './',
  name: 'Shredbeat',
  platform: 'linux',
  arch: 'x64',
  electronVersion: '1.6.6',
  icon: './designAssets/shredbeat.icns',
  overwrite: true,
  out: './build/',
  ignore: [
    /designAssets/,
    /build.js/,
    /LICENSE.md/,
    /README.md/,
    /screenshot.png/
  ]
};

packager(optsLinux, function done(err, appPath) {
  if (err) {
    console.error(err);
  }

  console.log(appPath);
});
