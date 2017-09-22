const config =  {
   botframework: {
     appName:  'Rap Sage Bot',
     appId: process.env.MS_APP_ID,
     appSecret: process.env.MS_APP_SECRET,
   },
   luis: {
     appUrl: `https://westcentralus.api.cognitive.microsoft.com/luis/v2.0/apps/e9319e6b-352e-4611-a3b8-112aaaf8582d?subscription-key=${process.env.LUIS_SUBSCRIPTION_KEY}&timezoneOffset=-480&verbose=true&q=`
   },
   genius: {
     accessToken: process.env.GENIUS_ACCESS_TOKEN
   }
}

module.exports =  config
