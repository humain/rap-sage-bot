import {ChatConnector, UniversalBot} from 'botbuilder'
import Genius from 'node-genius'
import Lyricist from 'lyricist'
import _ from 'lodash'

import config from './config'
import introductionDialog from './dialogs/introduction'
import artistDialog from './dialogs/artist-and-topic'

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
    const bot = new UniversalBot(connector, [
      (session) => {
        session.beginDialog('/introduction')
      },
      (session) => {
        session.beginDialog('/artist')
      },
      (session) => {
        console.log(`User Name: ${session.userData.name}\n`)
        console.log(`Artist to Search: ${session.conversationData.artist}\n`)
        console.log(`User Name: ${session.conversationData.subject}\n`)
        console.log('Access token', genius)
        const searchTerm = `${session.conversationData.artist}`
        genius.search(searchTerm, (error, results) => {
          const songHits = JSON.parse(results)
          const hits = _.get(songHits, 'response.hits')
          console.log('Song Hits:', JSON.stringify(songHits, null, 2))

          if(_.isEmpty(hits)) {
            return session.send('Sorry, I have nothing to give you right now. Lets try with another search.')
          } else {
            const songInfo = _.first(hits)
            const songId = _.get(songInfo, 'result.id')
            lyricist.song(songId, { fetchLyrics: true }).then((song)=>{
              console.log("Song", JSON.stringify(song, null, 2))
            })
          }



        })
      },
    ])
    bot.dialog('/introduction', introductionDialog)
    bot.dialog('/artist', artistDialog)

    app.post('/api/messages', connector.listen())

  }
}
export default Router
