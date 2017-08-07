# node-sigterm-handler

Gracefuly exit on SIGTERM

[![Build Status](https://travis-ci.org/octoblu/node-sigterm-handler.svg?branch=master)](https://travis-ci.org/octoblu/node-sigterm-handler)
[![Test Coverage](https://codecov.io/gh/octoblu/node-sigterm-handler/branch/master/graph/badge.svg)](https://codecov.io/gh/octoblu/node-sigterm-handler)
[![npm version](https://badge.fury.io/js/sigterm-handler.svg)](http://badge.fury.io/js/sigterm-handler)
[![Slack Status](http://community-slack.octoblu.com/badge.svg)](http://community-slack.octoblu.com)

## Installation

```bash
npm install --save sigterm-handler
```

## Usage

Handle SIGTERM

```coffee
SigtermHandler = require 'sigterm-handler'

sigtermHandler = new SigtermHandler()

# a registered handler will be called when a SIGTERM is triggered
# multiple handlers can be registered
# will process.exit 1 if callback is called with an error
# will process.exit 0 if callback is called with no error
# will timeout after 20 seconds, timeouts are exited with 0
sigtermHandler.register (callback) =>
  return callback error if # some error case
  callback null
```

Handle SIGTERM and SIGINT

```coffee
SigtermHandler = require 'sigterm-handler'

sigtermHandler = new SigtermHandler({ events: ['SIGTERM', 'SIGINT'] })

# a registered handler will be called when a SIGTERM, or SIGINT is triggered
# multiple handlers can be registered
# will process.exit 1 if callback is called with an error
# will process.exit 0 if callback is called with no error
# will timeout after 20 seconds, timeouts are exited with 0
sigtermHandler.register (callback) =>
  return callback error if # some error case
  callback null
```
