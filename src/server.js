const enableDestroy = require('server-destroy');
const Router = require('./router');
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const expressVersion = require('express-package-version');

class Server {
constructor({ port, appId, appSecret, geniusAccessToken }){
    this.address = this.address.bind(this)
    this.run = this.run.bind(this)
    this.stop = this.stop.bind(this)
    this.destroy = this.destroy.bind(this)
    this.port = port
    this.appId = appId
    this.appSecret = appSecret
    this.geniusAccessToken = geniusAccessToken
  }

  address() {
    return this.server.address()
  }

  run(callback) {
    let app = express()
    app.use(expressVersion({format: '{"version": "%s"}'}))
    app.use(morgan('dev'))
    app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));
    app.use(bodyParser.json({ limit: '1mb' }));
    app.options('*', cors())

    let router = new Router({
      appId: this.appId,
      appSecret: this.appSecret,
      geniusAccessToken: this.geniusAccessToken
    })

    router.route(app)

    this.server = app.listen(this.port, callback)
    return enableDestroy(this.server)
  }

  stop(callback) {
    return this.server.close(callback)
  }

  destroy(callback) {
    return this.server.destroy(callback)
  }
}

module.exports =  Server
