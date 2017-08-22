const {ChatConnector, UniversalBot, LuisRecognizer} = require('botbuilder');
const Genius = require('node-genius');
const Lyricist =require('lyricist');
const _ = require('lodash');
const defaultDialog = require('./dialogs/default');

const config =require('./config');
const introductionDialog =require('./dialogs/introduction');
const artistDialog =require( './dialogs/artist-and-topic');
const config = require('./config');

class Router {
  constructor({ appId, appSecret, geniusAccessToken }) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.geniusAccessToken = geniusAccessToken;
    this.route = this.route.bind(this);
  }

  route(app) {
    console.log("this is", this)
        const connector = new ChatConnector({
          appId: this.appId,
          appPassword: this.appSecret
        })
        const genius = new Genius(this.geniusAccessToken)
        const lyricist = new Lyricist(this.geniusAccessToken)
        const bot = new UniversalBot(connector, defaultDialog);

        bot.recognizer(new LuisRecognizer(config.luis.appUrl))
        // const luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/<YOUR_APP_ID>?subscription-key=<YOUR_KEY>';
// bot.recognizer(new builder.LuisRecognizer(luisAppUrl));
        // const bot = new UniversalBot(connector, [
        //   (session) => {
        //     session.beginDialog('/introduction')
        //   },
        //   (session) => {
        //     session.beginDialog('/artist')
        //   },
        //   (session) => {
        //
        //     const searchTerm = `${session.conversationData.artist}`
        //     genius.search(searchTerm, (error, results) => {
        //       const songHits = JSON.parse(results)
        //       const hits = _.get(songHits, 'response.hits')
        //       console.log('Song Hits:', JSON.stringify(songHits, null, 2))
        //
        //       if(_.isEmpty(hits)) {
        //         return session.send('Sorry, I have nothing to give you right now. Lets try with another search.')
        //       } else {
        //         const songInfo = _.first(hits)
        //         const songId = _.get(songInfo, 'result.id')
        //
        //         lyricist.song(songId, { fetchLyrics: true }).then((song)=>{
        //           console.log("<---I'm so here--->")
        //           console.log("Song", JSON.stringify(song, null, 2))
        //         })
        //       }
        //
        //
        //
        //     })
        //   },
        // ])
        bot.dialog('/introduction', introductionDialog)
        bot.dialog('/artist', artistDialog)

        app.post('/api/messages', connector.listen())

      }
}
module.exports = Router
