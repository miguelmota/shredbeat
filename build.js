'use strict';

const packager = require('electron-packager');

function buildMac() {
  return new Promise(function (resolve, reject) {
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
    }

    packager(opts, function done(err, appPath) {
      if (err) {
        console.error(err)
        reject(err)
        return false;
      }

      console.log(appPath)
      resolve(appPath)
    })
  })
}

function buildLinux() {
  return new Promise(function (resolve, reject) {
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
    }

    packager(optsLinux, function done(err, appPath) {
      if (err) {
        console.error(err)
        reject(err)
        return false
      }

      console.log(appPath)
      resolve(appPath)
    })
  })
}

buildMac()
.then(function() {
  return buildLinux()
})
.catch(function(error) {
  console.log(error)
})
