const { Prompts } = require('botbuilder')

const {RAP_SAGE_INTRO} = require('../constants')


const dialog = [
    (session) => {
      session.send(RAP_SAGE_INTRO)
      session.endDialog()
    }
]
module.exports =  dialog
