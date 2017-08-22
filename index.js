#!/usr/bin/env node
var Command = require('./src/command')
var command = new Command({ argv: process.argv })
command.run()
