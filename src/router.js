import {ChatConnector, UniversalBot} from 'botbuilder'

import config from './config'
import HelloDialog from './dialogs/hello'
import ProfileDialog from './dialogs/profile'

class Router {
  constructor({ appId, appSecret}) {
    this.appId = appId;
    this.appSecret = appSecret;
    this.route = this.route.bind(this);
  }

  route(app) {
    const connector = new ChatConnector({
      appId: this.appId,
      appPassword: this.appSecret
    })

    const bot = new UniversalBot(connector)

    
    app.post('/api/messages', connector.listen())

    bot.dialog('/', [
      (session, args, next) => {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
      },
      (session, next) => {
        session.beginDialog('/hello')
      }
    ])

    bot.dialog('/hello', HelloDialog(bot))
    bot.dialog('/profile', ProfileDialog(bot))
  }
}
export default Router
