require('dotenv').config();

// Function for sending twitter DMs
import twitter from '../../lib/twitter/';
import messages from '../../lib/twitter/messages';
import cards from '../../lib/cards/';

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
        .then((response) => callback(response));
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
    // Check for messages
    if (event.body.direct_message_events) {
      event.body.direct_message_events.forEach(function(messageEvent) {
        if (messageEvent.type == 'message_create' &&
        messageEvent.message_create.sender_id !== config.app.twitter_user_id) {
          // Get user id for reply
          let userId = messageEvent.message_create.sender_id;

          // check for /flood
          let re = new RegExp(/\/flood/gi);
          if (re.exec(messageEvent.message_create.message_data.text) !== null) {
            // Call get card link function
            cards(config).getCardLink(userId.toString(), 'twitter',
            process.env.DEFAULT_LANG)
              .then((cardId) => {
                let msg = messages.confirm('en', userId, cardId);
                // Send message to user
                twitter(config).sendMessage(msg)
                  .then((response) => console.log('Message sent.'))
                  .catch((err) => console.log(`Error sending message, ` +
                    `response from Twitter was: ` + JSON.stringify(err)));
              })
              .catch((err) => {
                console.log('Error sending message to twitter: ' + err);
                // TODO - msg.error
              // msg.event.message_create.message_data.text = `Sorry there was `
                // + `an error, please try again later...`;
              });
          } else {
            // Send default message
            let msg = messages.default('en', userId);
            twitter(config).sendMessage(msg)
              .catch((err) => console.error(`Error sending message, response `
              + `from Twitter was: ` + JSON.stringify(err)));
            }
          }
        });
      }
    callback();
    }
  };
