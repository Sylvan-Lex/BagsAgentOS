#!/usr/bin/env node
const { run } = require('@oclif/core');
const path = require('path');

process.env.NODE_ENV = 'production';

run(undefined, {
  root: path.join(__dirname, '..'),
}).catch(require('@oclif/core/handle').catch);