require('dotenv').config();

// Function for sending twitter DMs
import twitter from '../../lib/twitter/';
import cards from '../../lib/cards/';

const twitterUserId = '905602080252977152'; // @riskmapus bot

// GRASP operating regions
// const instanceRegions = {
//  brw: 'broward',
// };

// Replies to user
// const replies = {
//  'en': 'Hi! Report using this link, thanks.',
// };

/*
 * Construct the initial message to be sent to the user
 */
// function getInitialMessageText(language, cardId, disasterType) {
//  return replies[language] + '\n' + process.env.FRONTEND_CARD_PATH + '/'
//    + disasterType + '/' + cardId;
// }

/*
 * Construct the confirmation message to be sent to the user
 */
// function getConfirmationMessageText(language, implementationArea, reportId) {
//  return confirmations[language] + '\n' + process.env.FRONTEND_MAP_PATH + '/'
//  + instanceRegions[implementationArea] + '/' + reportId;
// }

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
      /* let hash = crypto.createHmac('sha256',
      process.env.TWITTER_APP_CONSUMER_SECRET)
        .update(crcToken)
        .digest('base64');

      let hashstring = 'sha256=' + hash;

      let response = JSON.parse('{"response_token": "'+hashstring+'"}'); */
      twitter().crcResponse(crcToken)
        .then((response) => callback(null, response));
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
  }
  // POST is incoming event
  if (event.method === 'POST') {
    // Check for messages
    if (event.body.direct_message_events) {
      console.log('Number of messages in this event:'
        + event.body.direct_message_events.length);
      event.body.direct_message_events.forEach(function(messageEvent) {
        if (messageEvent.type == 'message_create' &&
            messageEvent.message_create.sender_id !== twitterUserId) {
          // Get user id for reply
          let userId = messageEvent.message_create.sender_id;

          // Prepare message
          let msg = {};
          msg.event = {
                type: 'message_create',
                message_create: {
                  target: {
                    recipient_id: undefined,
                  },
                  message_data: {
                    text: `RiskMap bot helps you report flooding in realtime. `
                    + `Send /flood to report. In life-threatening situations `
                    + `always call 911.`,
                  },
                },
              };
          // Set recipient
          msg.event.message_create.target.recipient_id = userId;

          console.log('message text: '
            + messageEvent.message_create.message_data.text);
          // check for #flood
          let re = new RegExp(/\/flood/gi);
          if (re.exec(messageEvent.message_create.message_data.text) !== null) {
            // Call get card link function
            cards().getCardLink(userId.toString(), 'twitter',
            process.env.DEFAULT_LANG)
              .then((cardId) => {
                msg.event.message_create.message_data.text = `Please report `
                + `using this one-time link https://cards.riskmap.us/flood/`
                + cardId;
                console.log('Prepared message: ' + JSON.stringify(msg));
                // Send message to user
                twitter().sendMessage(msg)
                  .then((response) => console.log('Message sent.'))
                  .catch((err) => console.log(`Error sending message, ` +
                    `response from Twitter was: ` + JSON.stringify(err)));
              })
              .catch((err) => {
                msg.event.message_create.message_data.text = `Sorry there was `
                + `an error, please try again later...`;
                // Send message to user
                twitter().sendMessage(msg)
                  .then((response) => console.log('Message sent.'))
                  .catch((err) => console.log(`Error sending message, response `
                    + `from Twitter was: ` + JSON.stringify(err)));
                console.log('Error getting card link: ' + JSON.stringify(err));
              });
          } else {
            // Send default message
            twitter().sendMessage(msg)
              .then((response) => console.info('Message sent.'))
              .catch((err) => console.error(`Error sending message, response `
              + `from Twitter was: ` + JSON.stringify(err)));
            }
          }
        });
      }
    callback();
    }
  };
