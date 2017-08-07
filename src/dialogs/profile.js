import { Prompts } from 'botbuilder'


export default (bot) => [
  (session) => Prompts.text(session, 'Hi! What is your name?'),
  (session, results) => {
    session.userData.name = results.response;
    session.endDialog();
  }
]
