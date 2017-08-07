# own-version

Retrieve main package's current version.

Usage
-------------------------------------------------------------------------------

Install via npm:

    $ npm install --save own-version

Include in the app:

    var ownVersion = require('own-version');

    ownVersion(function (err, version) {
      console.log('Current version is', version);
    });

Or synchronously:

    var version = ownVersion.sync();


License
-------------------------------------------------------------------------------

MIT

