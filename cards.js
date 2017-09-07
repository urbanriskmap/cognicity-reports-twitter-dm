// Get Flood Card from CogniCity server

const request = require('request');

/*
 * Get one time card link from the server
 */
let getCardLink = function(username, network, language, callback) {
  var card_request = {
    "username": username,
    "network": network,
    "language": language
  };

  // Get a card from Cognicity server
  request({
    url: 'https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards',
    method: 'post',
    headers: {
      'content-type': 'application/json',
      'x-api-key': process.env.SERVER_API_KEY
    },
    port: 443,
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

module.exports = {getCardLink};
