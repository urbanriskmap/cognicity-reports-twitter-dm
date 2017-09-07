const request = require('request')

let twitter = {}

twitter.oauth = {
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  token: process.env.TWITTER_ACCESS_TOKEN_KEY,
  token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
}


let sendMessage = function(message, callback){
  // request options
  var request_options = {
    url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
    oauth: twitter.oauth,
    json: true,
    headers: {
      'content-type': 'application/json'
    },
    body: message
  }

  console.log('replies currently disabled, message is: ' + JSON.stringify(message))
  callback(null, null)

  // POST request to send Direct Message
  request.post(request_options, function (error, response, body) {
    console.log('Post DM function fired');
    console.log('Post DM function response from twitter server:' + JSON.stringify(response));

    //console.log('errors', error)
    //console.log('response', response)
    //console.log('body', body)
    callback(error, response)
  });
}

module.exports = {sendMessage};
