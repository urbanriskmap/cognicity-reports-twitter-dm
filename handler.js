const request = require('request');
const crypto = require('crypto');
require('dotenv').config();

// Function for sending twitter DMs
const twitter = require('./twitter');
const cards = require('./cards');

//twitterUserId = 905237435394560000 // @riskmapus
twitterUserId = '905602080252977152' //@riskmapbot

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
  brw: 'broward',
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
  // POST is incoming event
  if (event.method === 'POST') {
    // Check for messages
    if (event.body.direct_message_events){
      console.log('Number of messages in this event:' + event.body.direct_message_events.length)
      event.body.direct_message_events.forEach(function(message_event){
        console.log(message_event.message_create.sender_id);
        console.log(twitterUserId);
        if (message_event.type == 'message_create' && message_event.message_create.sender_id !== twitterUserId){

          // Get user id for reply
          let userId = message_event.message_create.sender_id

          // Prepare message
          let msg = {};
          msg.event = {
                "type": "message_create",
                "message_create": {
                  "target": {
                    "recipient_id": undefined
                  },
                  "message_data": {
                    "text": "RiskMap bot helps you report flooding in realtime. Send #flood to report. In life-threatening situations always call 911."
                  }
                }
              }
          // Set recipient
          msg.event.message_create.target.recipient_id = userId;

          console.log(message_event.message_create.message_data.text)
          // check for #flood
          var re = /#flood/ig

          if (re.exec(message_event.message_create.message_data.text) !== null){
            // Call get card link function
            cards.getCardLink(userId.toString(), "twitter", process.env.DEFAULT_LANG, function(err, cardId){
              console.log(cardId)
              if (err === null){

                msg.event.message_create.message_data.text = "Please report using this one-time link https://cards.riskmap.us/flood/" + cardId
                console.log('Prepared message: ' + JSON.stringify(msg))
                twitter.sendMessage(msg, function(err, response){
                  if (err !== null){
                    console.log('Error sending message: ' + JSON.stringify(err));
                    console.log('Response from Twitter: ' + JSON.stringify((response)));
                  }
                })
              }
              else {
                msg.event.message_create.message_data.text = "Sorry there was an error, please try again later."
                twitter.sendMessage(msg, function(err, response){
                  if (err !== null){
                    console.log('Error sending message: ' + JSON.stringify(err));
                    console.log('Response from Twitter: ' + JSON.stringify((response)));
                  }
                })
                console.log("Error getting card link")
              }
            })
          } else {
            // Send default message
            twitter.sendMessage(msg, function(err, response){
              if (err !== null){
                console.log('Error sending message: ' + JSON.stringify(err));
                console.log('Response from Twitter: ' + JSON.stringify((response)));
              }
            })
          }
        }
      })
    callback();
    }
  }
}

module.exports.twitterReply = (event, context, callback) => {
  //This module listens in to SNS Twitter topic and reads the message published
  var message = JSON.parse(event.Records[0].Sns.Message);
  console.log('Message received from SNS topic: ' + message);
  // Prepare message
  let msg = {};
  msg.event = {
        "type": "message_create",
        "message_create": {
          "target": {
            "recipient_id": message.username
          },
          "message_data": {
            "text": "Thank you for your report. You can access it using this link https://riskmap.us/map/broward/" + message.report_id
          }
        }
      }

  //Construct the confirmation message to be sent to the user
  //var messageText = getConfirmationMessageText(message.language, message.implementation_area, message.report_id);
  //var messageText = '@' + message.username + ' ' + messageText;

  //Make a POST call to send a tweet to the user
  //sendTweet(messageText, message.username);
  twitter.sendMessage(msg, function(err, response){

  })
};
