#!/usr/bin/env node
const fs = require('fs')
if(fs.existsSync('.env')) {
  console.log('Loading env file')
  require('dotenv').config()
}
var Command = require('./src/command')
var command = new Command({ argv: process.argv })
command.run()
