import request from 'request';

/*
 * Twitter object for direct message interactions
 */

// Global Twitter credentials object
const twitter = {
  oauth: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
  }
}

export default () => ({
  /**
    * Prepares Twitter message request object
    * @function _prepareRequest
    * @param {Object} body - message body object
    * @return {Object} Twitter message request object
    */
  _prepareRequest: (body) => {
    let requestOptions = {
      url: 'https://api.twitter.com/1.1/direct_messages/events/new.json',
      oauth: twitter.oauth,
      json: true,
      headers: {
        'content-type': 'application/json'
      },
      body: body
    }
    // Log the message
    console.log('Outgoing DMessage object: ' + JSON.stringify(body));

    return requestOptions;
  },

  /**
   * Send direct Twitter message
   * @function sendMessage
   * @param {Object} body - Twitter direct message body object
   **/
  sendMessage: (body) => new Promise ((resolve, reject) => {
    // Send the message
    request.post(_prepareRequest(body), function(error, response, body){
      if (!error){
        resolve(response)
      } else {
        reject(error)
      }
    })
  })
});
