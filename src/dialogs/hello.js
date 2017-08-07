import { Prompts } from 'botbuilder'


export default (bot) => [
  (session) => session.send(`Hello ${session.userData.name}`),
]
