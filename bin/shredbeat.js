#!/usr/bin/env node

const path = require('path')
const cp = require('child_process')

cp.execSync(`npm run start --prefix ${path.join(__dirname, `../`)}`)
