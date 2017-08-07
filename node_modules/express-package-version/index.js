var fs = require('fs'),
    path = require('path'),
    util = require('util');

var ownVersion = require('own-version');

'use strict';

module.exports = function (opts) {

  var formatString, version, versionString, versionUrl;

  opts || (opts = {});

  try {
    version = ownVersion.sync();
  } catch (e) {
    console.error(e);
    process.stderr.write('Error reading package.json\n');
  }

  if (version) {
    formatString = opts.formatString || 'version: %s';
    versionString = util.format(formatString, version);
  }

  versionUrl = opts.url || '/version';

  return function packageVersion (req, res, next) {
    if (version && req.method === 'GET' && req.url === versionUrl) {
      res.format({
        json: function () {
          res.json({ version: version });
        },
        html: function () {
          res.set('Content-type', 'text/plain').send(versionString);
        }
      });
    }
    else {
      next();
    }
  }
};

