const request = require('request');
const crypto = require('crypto');
require('dotenv').config();

// Twitter Client to send reply tweets
//var Twitter = require('twitter');
//var twitterClient = new Twitter({
//  consumer_key: process.env.TWITTER_CONSUMER_KEY,
//  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
//  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
//  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
//});

let twitter = {}
twitter.user_id =
twitter.oauth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}

// GRASP card
const options = {
  host: process.env.SERVER_PATH,
  path: '/cards',
  method: 'POST',
  port: process.env.SERVER_PORT,
  headers: {
    'x-api-key': process.env.SERVER_API_KEY,
    'Content-Type': 'application/json'
  }
};

// GRASP operating regions
const instance_regions = {
  bwd: 'broward',
};

// Replies to user
const replies = {
  'en': 'Hi! Report using this link, thanks.',
};

/*
 * Construct the initial message to be sent to the user
 */
function getInitialMessageText(language, cardId, disasterType) {
  return replies[language] + "\n" + process.env.FRONTEND_CARD_PATH + "/" + disasterType + "/" + cardId;
}

/*
 * Construct the confirmation message to be sent to the user
 */
function getConfirmationMessageText(language, implementationArea, reportId) {
  return confirmations[language] + "\n" + process.env.FRONTEND_MAP_PATH + "/" + instance_regions[implementationArea] + '/' + reportId;
}

/*
 * Get one time card link from the server
 */
function getCardLink(username, network, language, callback) {
  var card_request = {
    "username": username,
    "network": network,
    "language": language
  };

  console.log(options);
  console.log(card_request);
  // Get a card from Cognicity server
  request({
    url: options.host + options.path,
    method: options.method,
    headers: options.headers,
    port: options.port,
    json: true,
    body: card_request
  }, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(null, body.cardId); //Return cardId on success
    } else {
      var err = 'Error getting card: ' + JSON.stringify(error) + JSON.stringify(response);
      callback(err, null); // Return error
    }
  });
}

// Webhook handler - This is the method called by Facebook when you verify webhooks for the app
module.exports.twitterDMWebhook = (event, context, callback) => {
  if (event.method === 'GET') {

    var crc_token = event.query['crc_token']

    if (crc_token) {
      var hash = crypto.createHmac('sha256', process.env.TWITTER_APP_CONSUMER_SECRET).update(crc_token).digest('base64');

      var hashstring = 'sha256=' + hash;

      var response = JSON.parse('{"response_token": "'+hashstring+'"}');

      callback(null, response);
    } else {
      const response = {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({ "message": 'Error: crc_token missing from request.' })
      };
      callback(null, response);
    }
  }

  if (event.method === 'POST') {


    if (event.body.direct_message_events){


      event.body.direct_message_events.forEach(function(message_event){
        if (message_event.type == 'message_create' && message_event.message_create.sender_id !== twitter.user_id){
          let userId = message_event.message_create.sender_id

          //console.log(event);

          let card_body = {
            "username": "test",
            "network": "twitter DM",
            "language": "en"
          }

          var card_request_options = {
            url: 'https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards',
            headers: {
              'content-type': 'application/json',
              'x-api-key': process.env.SERVER_API_KEY
            },
            body: card_body
          }

          request.post(JSON.stringify(card_request_options), function(error, response, body){
            if (!error) {
              console.log('card:', body)
              console.log('card id:', body.cardId)

              let msg = {};
              msg.event = {
                    "type": "message_create",
                    "message_create": {
                      "target": {
                        "recipient_id": undefined
                      },
                      "message_data": {
                        "text": "Please report using this link https://cards.riskmap.us/flood/test123"
                      }
                    }
                  }
              msg.event.message_create.target.recipient_id = userId;

              // request options
              var request_options = {
                url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
                oauth: twitter.oauth,
                json: true,
                headers: {
                  'content-type': 'application/json'
                },
                body: msg
              }

              // POST request to send Direct Message
              request.post(request_options, function (error, response, body) {
                console.log('errors', error)
                console.log('response', response)
                console.log('body', body)
              });
            }
          })
        }
      })
      callback();
      }
    }
};

module.exports.twitterReply = (event, context, callback) => {
  //This module listens in to SNS Twitter topic and reads the message published
  var message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + message);

  //Construct the confirmation message to be sent to the user
  var messageText = getConfirmationMessageText(message.language, message.implementation_area, message.report_id);
  var messageText = '@' + message.username + ' ' + messageText;

  //Make a POST call to send a tweet to the user
  sendTweet(messageText, message.username);
};
