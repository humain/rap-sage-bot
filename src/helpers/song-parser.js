const readline = require('readline')
const isEmpty = require('lodash/isEmpty')
const keys = require('lodash/keys')
const filter = require('lodash/filter')
const compact = require('lodash/compact')
const random = require('lodash/fp/random')

const startsWith = require('lodash/startsWith')
const endsWith = require('lodash/endsWith')
const { PassThrough } = require('stream')
const debug = require('debug')('rap-sage-bot:helpers:song-parser')


const getRandomVerseKey = ({ song }) => {
  if(isEmpty(song)) return undefined
  debug('Song is ', song)
  const verseFilter = (key) => {if(startsWith(key, 'verse')) return key}
  const verseKeys = compact(filter(keys(song), verseFilter))
  debug('Song Keys are:', verseKeys)
  debug('Verse Keys after parse', verseKeys)
  if(isEmpty(verseKeys)) return undefined

  const randomVerseIndex = random(0, verseKeys.length - 1)
  debug('Random Verse Index', randomVerseIndex)
  debug('Random Verse Key', verseKeys[randomVerseIndex])
  return verseKeys[randomVerseIndex]
}

const getVerseQuoteFromSong = ({song, verseKey}) => {
  const songLines = song[verseKey]
  debug('Song Lines are', songLines)
  const quoteStart = random(0, songLines.length - 5)
  const quoteEnd = quoteStart + 4
  debug('Quote Start', quoteStart)
  debug('Quote End', quoteEnd)
  const songSlice = songLines.slice(quoteStart, quoteEnd)
  return songSlice.join('\n')
}

const parseSongLyrics = ({ songLyrics }, callback) => {
  if(isEmpty(songLyrics)) {
    return callback(new Error('Missing SongLyrics'))
  }

  const songBuffer = Buffer.from(songLyrics, 'utf8')
  const songStream = new PassThrough()
  songStream.end(songBuffer)
  const rl = readline.createInterface({
    input: songStream
  })
  const parsedSong = {}
  let key = ''
  let lines = []
  rl.on('line', function(line){
    const inputLine = line.trim()
    if(isEmpty(inputLine)) return
    if(startsWith(inputLine, "[") && endsWith(line, "]")) {
      key = inputLine.replace("[", "").replace("]", "").replace(" ", "-").toLowerCase()
      lines = []
      parsedSong[key] = lines

    } else {
      lines.push(inputLine)
      parsedSong[key] = lines
    }
  })
  rl.on('close', function(){
    return callback(null, parsedSong)
  })
}



exports.parseSongLyrics = parseSongLyrics
exports.getRandomVerseKey  = getRandomVerseKey
exports.getVerseQuoteFromSong  = getVerseQuoteFromSong
