const { expect } = require('chai')
const {parseSongLyrics, getRandomVerseKey} = require('../../src/helpers/song-parser')
const fs = require('fs')
const path = require('path')
const sinon = require('sinon')

describe('getRandomVerseKey', function(){
  describe('when given an empty song',function(){
    it('should return undefined', () =>{
      const song = {}
      expect(getRandomVerseKey({song})).to.be.undefined
    })
  })
  describe('when given no verse keys', function(){
    it('should return undefined', ()=>{
      const song = {
        'intro': [],
        'chorus': []
      }
      expect(getRandomVerseKey({song})).to.be.undefined
    })
  })
  describe('when given at least one verse key', function(){
    it('should return the verse key', () => {
      const song = {
        'verse-1':[]
      }
      expect(getRandomVerseKey({song})).to.deep.equal('verse-1')
    })
  })
  describe('when given multiple verse keys', function(){
    it('should return a random verse key', () => {
      const song = {
        'verse-7':[],
        'verse-8':[],
        'verse-9':[],
        'verse-10':[],
        'verse-11':[]
      }
      const result = parseInt(getRandomVerseKey({song}).split('-')[1])
      const isInRange = result >= 7 || result <= 11
      expect(isInRange).to.be.true
    })
  })

})

describe('parseSongLyrics', function(){

  describe('when there are no song lyrics', ()=>{
    const callback = sinon.spy()

    it('should return an error', (done) =>{
       parseSongLyrics({songLyrics: ''}, callback)
       const argument = callback.firstCall.args[0]
       expect(argument instanceof Error).to.be.true
       expect(argument.message).to.deep.equal('Missing SongLyrics')
       done()
    })
  })
  describe('When there are headings with brackets like [Video-Intro]', function(){
    it('should convert the headings to keys', (done)=>{
      const songLyrics = `[Verse 1]\nHere is the first line`
      parseSongLyrics({songLyrics}, (error, result) => {
        expect(result).to.deep.equal({
          'verse-1': ['Here is the first line']
        })
        done()
      })

    })
  })
  describe('when there are multiple headings and lines', function(){
    const songLyrics =`[Chorus]\nHere is the Chorus\n[Verse 1]\nHere is the first Verse
    `
    it('should turn each heading into a key and add the lines as arrays', (done)=>{
      parseSongLyrics({songLyrics}, (error, result) => {
        expect(result).to.deep.equal({
          'chorus': ['Here is the Chorus'],
          'verse-1':['Here is the first Verse']
        })
        done()
      })
    })
  })
})
