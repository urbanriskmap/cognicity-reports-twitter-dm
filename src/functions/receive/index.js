require('dotenv').config();

// Function for sending twitter DMs
import twitter from '../../lib/twitter/';
import receive from './receive';

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

/**
 * Webhook handler for incoming Twitter DMs
 * @function twitterDMWebhook
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Function} callback - Callback
 */
module.exports.twitterDMWebhook = (event, context, callback) => {
  if (event.method === 'GET') {
    let crcToken = event.query['crc_token'];
    if (crcToken) {
      twitter(config).crcResponse(crcToken)
        .then((response) => callback(response))
        .catch((err) => console.log(err));
    } else {
      const response = {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*', // Required for CORS
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({'message':
          `Error: crc_token missing from request.`}),
      };
      callback(null, response);
    }
  } else if (event.method === 'POST') {
      receive(config).process(event)
        .then(callback(null))
        .catch((err) => {
          console.log(err);
          callback(null);
        });
    }
  };
