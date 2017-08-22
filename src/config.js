const config =  {
   botframework: {
     appName:  'Rap Sage Bot',
     appId: process.env.MS_APP_ID,
     appSecret: process.env.MS_APP_SECRET,
   },
   luis: {
     appId: process.env.LUIS_APP_ID,
     subscriptionKey: process.env.LUIS_SUBSCRIPTION_KEY,
     appUrl: `https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/${LUIS_APP_ID}?subscription-key=${LUIS_SUBSCRIPTION_KEY}`
   }
   genius: {
     accessToken: process.env.GENIUS_ACCESS_TOKEN
   }
}

module.exports =  config
