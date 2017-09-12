import request from 'request';

/*
 * Cards object for external functions
 */
 /**
  * Process response from card server made using request library
  * @function _processResponse
  * @param {Object} error - Request error object or null
  * @param {Object} response - Request response object or null
  * @param {Object} body - Request body object or null
  * @return {String} cardId - Card identifier
  **/
 const _processResponse = (error, response, body) =>
  new Promise((resolve, reject) => {
   if (!error && response && response.statusCode === 200
        && body && body.cardId) {
     resolve(body.cardId);
   } else if (error) {
     reject(new Error(error));
   } else {
     reject(new Error(`No response or incorrect body received from server`));
   }
 });

 /**
 * Request a card link from server using request library
 * @function getCardLink
 * @param {String} username - User's social media handle or unique identifier
 * @param {String} network - User's social media network (e.g. 'twitter')
 * @param {String} language - User's language as two letter code (e.g. 'en')
 * @return {String} cardId - Card identifier
 **/
 const getCardLink = (username, network, language) =>
  new Promise((resolve, reject) => {
   let cardRequest = {
     'username': username,
     'network': network,
     'language': language,
   };
   // Get a card from Cognicity server
   request({
     url: 'https://3m3l15fwsf.execute-api.us-west-2.amazonaws.com/prod/cards',
     method: 'post',
     headers: {
       'content-type': 'application/json',
       'x-api-key': process.env.SERVER_API_KEY,
     },
     port: 443,
     json: true,
     body: cardRequest,
   }, function(error, response, body) {
     // Process response
     _processResponse(error, response, body)
       .then((cardId) => resolve(cardId))
       .catch((err) => reject(err));
   });
 });

export default () => ({_processResponse, getCardLink});
