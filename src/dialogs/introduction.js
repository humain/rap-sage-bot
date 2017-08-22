const { Prompts } = require('botbuilder')

const RAP_SAGE_INTRO = `Hi I'm the Rap Sage Bot and I dispense lyrical wisdom
 from your favorite artists. Just give me a list of your favorite artists and I
  will give you a quote.\n
`

const dialog = [
    (session) => {
      session.send(RAP_SAGE_INTRO)
      Prompts.text(session, "What is your name?")
    },
    (session, results) => {
      session.userData.name = results.response
      session.send(`Ok, I will call you ${session.userData.name}`)
    },
    (session) => {
      Prompts.text(session, "What are some of your favorite artists?")
    },
    (session, results) => {
      session.conversationData.artist = results.response
      session.endDialog()
    }
]
module.exports =  dialog
