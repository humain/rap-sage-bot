# express-package-version

A middleware for surfacing the package.json version of [express][express]
applications.

Usage
-------------------------------------------------------------------------------

Install via npm:

    $ npm install --save express-package-version

Include in the app:

    app.use(require('express-package-version')({
      url    : '/package-version',
      format : 'serving @ %s'
    }));

#### Options:

  * `url` (optional) - the url to serve the version from (default: `/version`)

  * `format` (optional) - a format string for wrapping the version in text /
    HTML responses

License
-------------------------------------------------------------------------------

MIT

[express]: https://github.com/expressjs/express

