import request from 'request';
import crypto from 'crypto';

/**
 * Twitter object for direct message interactions
 * @param {Object} config - twitter parameters
 * @return {Object} Function methods
 **/
export default function(config) {
  let methods = {};
  /**
    * Prepares Twitter message request object
    * @function _prepareRequest
    * @param {Object} body - message body object
    * @return {Object} - Twitter message request object
  **/
  methods._prepareRequest = function(body) {
    let requestOptions = {
      url: config.app.twitter_endpoint,
      oauth: config.oauth,
      json: true,
      headers: {
        'content-type': 'application/json',
      },
      body: body,
    };
    // Log the message
    console.log('Outgoing DMessage object: ' + JSON.stringify(body));
    return requestOptions;
  };

  /**
    * Prepares Twitter CRC response
    * @function crcResponse
    * @param {Object} token - request token
    * @return {Object} - Twitter CRC response
  **/
  methods.crcResponse = (token) => new Promise((resolve, reject) => {
    let hash = crypto.createHmac('sha256', config.app.consumer_secret)
      .update(token)
      .digest('base64');
    let hashstring = 'sha256=' + hash;
    let response = JSON.parse('{"response_token": "'+hashstring+'"}');
    resolve(response);
  });

  /**
   * Send direct Twitter message
   * @function sendMessage
   * @param {Object} body - Twitter direct message body object
   * @return {Object} - Response object from Twitter
   **/
  methods.sendMessage = (body) => new Promise((resolve, reject) => {
    let opts = methods._prepareRequest(body);
    // Send the message
    request.post(opts, function(error, response, body) {
      if (!error) {
        resolve(response);
      } else {
        console.log(response);
        reject(error);
      }
    });
  });
return methods;
}
