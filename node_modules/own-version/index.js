var fs = require('fs'),
    path = require('path');

'use strict';

function wrappedExistsSync (path, cb) {
  cb(fs.existsSync(path));
}

function searchPaths () {
  return require.main.paths.map(function (dir) {
    return path.join(path.dirname(dir), 'package.json');
  });
}

function checkPaths (exists, paths, cb) {

  var err,
      packageFile = paths[0];

  exists(packageFile, function (packageExists) {
    if (packageExists) {
      return cb(null, require(packageFile).version);
    }
    else if (paths.length > 1) {
      return checkPaths(exists, paths.slice(1), cb);
    }
    else {
      err = new Error('No package.json found');
      err.code = 'ENOENT';
      return cb(err)
    }
  })
}

module.exports = function (cb) {

  // version is available in the environment for apps running under `npm start`
  if (process.env.hasOwnProperty('npm_package_version')) {
    return cb(null, process.env.npm_package_version);
  }

  checkPaths(fs.exists, searchPaths(), cb);
};

module.exports.sync = function () {

  var version;

  // version is available in the environment for apps running under `npm start`
  if (process.env.hasOwnProperty('npm_package_version')) {
    return process.env.npm_package_version;
  }

  checkPaths(wrappedExistsSync, searchPaths(), function (err, v) {
    if (err) throw err;
    version = v;
  });

  return version;
};

