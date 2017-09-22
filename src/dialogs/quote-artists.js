const { Prompts, EntityRecognizer, Message}                      = require('botbuilder');
const Genius                                                     = require('node-genius');
const Lyricist                                                   =require('lyricist');
const config                                                     = require('../config')
const isEmpty                                                    = require('lodash/isEmpty')
const first                                                      = require('lodash/first')
const get                                                        = require('lodash/get')
const {parseSongLyrics,getRandomVerseKey, getVerseQuoteFromSong} = require('../helpers/song-parser')
const {createArtistCard}                                         = require('../helpers/card-creator')
const debug                        = require('debug')('rap-sage-bot:dialog:quote-artists')

const dialog = [
  (session, args, next) => {
    session.sendTyping()
    const {intent} = args
    debug('Intent is', intent)
    const artist = EntityRecognizer.findEntity(intent.entities, 'Artist')
    debug('Entity is', artist)
    // if(isEmpty(artist)) {
    //
    // }
    session.conversationData.artist = artist.entity
    next()
  },
  (session, results, next) => {
    const {accessToken} = config.genius
    const genius = new Genius(accessToken)
    const lyricist = new Lyricist(accessToken)
    const artist = session.conversationData.artist

    if(isEmpty(artist)) {
      session.send('Sorry I could not understand what artist you want me to quote.')
      session.endDialog()
    }

    genius.search(artist, (error, results) => {
      const songHits = JSON.parse(results)
      const hits = get(songHits, 'response.hits')
      debug('Song Hits:', JSON.stringify(songHits, null, 2))

      if(isEmpty(hits)) {
        session.send('Sorry, I have nothing to give you right now. Lets try with another search.')
        return session.endDialog()
      } else {

        const songInfo = first(hits)
        const songId = get(songInfo, 'result.id')
        const primaryArtist = get(songInfo, 'result.primary_artist')


        lyricist.song(songId, { fetchLyrics: true }).then(function(song) {
          debug('songInfo', songInfo)
          parseSongLyrics({songLyrics: song.lyrics}, function(error, parsedSong){
            if(error){
              session.send('Sorry there was an error, let\'s start over')
              return session.endDialog()
            }
            if(isEmpty(parsedSong)){
              session.send('Sorry I couldn\'t find a song from your artist')
              return session.endDialog()
            }
            debug('The Parsed Song is', parsedSong)
            const randomVerseKey = getRandomVerseKey({song:parsedSong})
            debug('Random Verse Key', randomVerseKey)
            if(isEmpty(randomVerseKey)) {
              session.send('Sorry I could not find a verse to quote.')
              return session.endDialog()
            }
            debug('Primary Artist', primaryArtist)
            const songQuote = getVerseQuoteFromSong({song: parsedSong, verseKey: randomVerseKey})
            const adaptiveCard = createArtistCard({
              displayText: songQuote,
              name: primaryArtist.name,
              imageUrl: primaryArtist.image_url
            })
            debug('Adaptive Card', adaptiveCard)
            const message = new Message(session).addAttachment(adaptiveCard)
            session.send(message)
            session.endDialog()
          })
        })
      }
   })
  }
]

module.exports =  dialog
