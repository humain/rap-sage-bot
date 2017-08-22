const { Prompts } = require('botbuilder');

const dialog = [
  (session) => {
    Prompts.text(session, "What are some of your favorite artists?")
  },
  (session, results) => {
    session.conversationData.artist = results.response
    session.endDialog()
  }
]

module.exports =  dialog
