const request = require('request');
const crypto = require('crypto');
require('dotenv').config();

// Twitter Client to send reply tweets
var Twitter = require('twitter');
var twitterClient = new Twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

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
  console.log(JSON.stringify(event));
  if (event.method === 'GET') {

    var crc_token = request.query['crc_token']

    if (crc_token) {
      var hash = crypto.createHmac('sha256', twitterClient.consumer_secret).update(crc_token).digest('base64')

      const response = {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin" : "*", // Required for CORS support to work
          "Access-Control-Allow-Credentials" : true // Required for cookies, authorization headers with HTTPS
        },
        body: JSON.stringify({ "response_token": 'sha256=' + hash })
      };
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

      // replace this with your own bot logic
      //var requestBody = JSON.parse(event.body);
      //message_processor.process(request.body)

      response.send('200 OK')
    })
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
