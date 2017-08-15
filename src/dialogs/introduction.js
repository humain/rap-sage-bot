import { Prompts } from 'botbuilder'

const RAP_SAGE_INTRO = `Hi I'm the Rap Sage Bot and I dispense lyrical wisdom
 from your favorite artist. I ask you a few questions and then I'll give you
 a quote.\n
`

const dialog = [
    (session) => {
      session.send(RAP_SAGE_INTRO)
      Prompts.text(session, "What is your name?")
    },
    (session, results) => {
      session.userData.name = results.response
      session.send(`Ok, I will call you ${session.userData.name}`)
      session.endDialog()
    },
]
export default dialog
