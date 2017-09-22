const {ChatConnector, UniversalBot, LuisRecognizer} = require('botbuilder');
const _                                             = require('lodash');
const debug = require('debug')('rap-sage-bot:router')

const config             =require('./config');
const {RAP_SAGE_INTRO, HELP_TEXT}   = require('./constants');
const quoteArtistDialog       =require( './dialogs/quote-artists');

class Router {
  constructor({ appId, appSecret, geniusAccessToken }) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.geniusAccessToken = geniusAccessToken;
    this.route = this.route.bind(this);
  }

  route(app) {
    const connector = new ChatConnector({
      appId: this.appId,
      appPassword: this.appSecret
    })

    const bot = new UniversalBot(connector, [
      (session, args, next) =>{
        session.send(HELP_TEXT)
        session.endDialog()
      }
    ])
    const luisRecognizer = new LuisRecognizer(config.luis.appUrl)
    debug('App Url is ', config.luis.appUrl)
    bot.recognizer(luisRecognizer)
    bot.dialog('QuoteArtists', quoteArtistDialog).triggerAction({
      matches: 'quote.artists'
    })
    app.post('/api/messages', connector.listen())


  }
}
module.exports = Router
