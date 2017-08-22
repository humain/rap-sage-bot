const _ = require('lodash');
const config = require('../config');
const Genius = require('node-genius');
const Lyricist =require('lyricist');
const debug = require('debug')('rap-sage-bot:default-dialog');

const genius = new Genius(config.genius.accessToken);
const defaultDialog = [
  (session) => {
    session.beginDialog('/introduction')
  },
  (session) => {
    debug(`User Name: ${session.userData.name}\n`)
    debug(`Artist to Search: ${session.conversationData.artist}\n`)
    debug(`User Name: ${session.conversationData.subject}\n`)
    debug('Access token', genius)
    const searchTerm = `${session.conversationData.artist}`
    genius.search(searchTerm, (error, results) => {
      const songHits = JSON.parse(results)
      const hits = _.get(songHits, 'response.hits')
      debug('Song Hits:', JSON.stringify(songHits, null, 2))

      if(_.isEmpty(hits)) {
        return session.send('Sorry, I have nothing to give you right now. Lets try with another search.')
      } else {
        const songInfo = _.first(hits)
        const songId = _.get(songInfo, 'result.id')
        lyricist.song(songId, { fetchLyrics: true }).then((song)=> {
          debug("Song", JSON.stringify(song, null, 2))
        })
      }
    })
  },
]

module.exports = defaultDialog
