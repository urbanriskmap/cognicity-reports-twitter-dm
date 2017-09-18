import twitter from '../../lib/twitter/';
import messages from '../../lib/twitter/messages';

const config = {
  oauth: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
  app: {
    consumer_secret: process.env.TWITTER_APP_CONSUMER_SECRET,
    twitter_user_id: '905602080252977152', // @riskmapus bot,
    default_lang: process.env.DEFAULT_LANG,
    twitter_endpoint: `https://api.twitter.com/1.1/direct_messages/events/new.json`,
  },
  server: {
    card_endpoint: `https://cards.riskmap.us/flood/`,
    card_api: `https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards`,
    api_key: process.env.SERVER_API_KEY,
  },
};

module.exports.twitterReply = (event, context, callback) => {
  // This module listens in to SNS Twitter topic and reads the message published
  let message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + message);
  // Prepare message
  let msg = messages(config).thanks('en', message.username, message.report_id);
  // Send message to user
  twitter(config).sendMessage(msg)
    .then((response) => console.log('Message sent.'))
    .catch((err) => console.log(`Error sending message, response from Twitter `
    + `was: ` + JSON.stringify(err)));
};
