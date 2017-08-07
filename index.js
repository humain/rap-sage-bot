#!/usr/bin/env node
require('babel-core/register')

var Command = require('./src/command')
var command = new Command({ argv: process.argv })
command.run()
