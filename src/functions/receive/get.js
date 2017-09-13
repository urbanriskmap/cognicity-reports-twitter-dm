import twitter from '../../lib/twitter/';
/**
 * Function to handle get requests to webhook
 * @function get
 * @param {Object} config - AWS Lambda event object
 * @param {Object} event - Twitter lambda config object
 * @return {Object} response - Response to send
 **/
export default(config, event) => new Promise((resolve, reject) => {
  let crcToken = event.query['crc_token'];
  if (crcToken) {
    twitter(config).crcResponse(crcToken)
      .then((response) => resolve(response));
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
    resolve(response);
  }
});
