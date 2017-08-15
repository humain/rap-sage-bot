import { Prompts } from 'botbuilder'

const dialog = [
  (session) => {
    Prompts.text(session, "What artist should I quote?")
  },
  (session, results) => {
    session.conversationData.artist = results.response
    Prompts.text(session, "What subject matter are you interested in?")
  },
  (session, results) => {
    session.conversationData.subject = results.response
    session.endDialog()
  }
]

export default dialog
