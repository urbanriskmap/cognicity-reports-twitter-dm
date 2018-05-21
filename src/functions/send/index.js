import Joi from 'joi';

// Local objects
import config from '../../config';
import {handleResponse} from '../../lib/util';
import Twitter from '../../lib/twitter';

const _bodySchema = Joi.object().keys({
  userId: Joi.string(),
  instanceRegionCode: Joi.string(),
  language: Joi.string(),
  network: Joi.string(),
  reportId: Joi.number(),
});

/**
 * Endpoint to send twitter dm messages
 * @function send
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default async (event, context, callback) => {
  try {
    // Log statements
    console.log('\n\nLoading Notify handler\n\n');
    console.log('Incoming body: ' + event.body);

    // Validate body
    const body = await Joi.validate(event.body, _bodySchema);

    // Class
    const twitter = new Twitter(config);

    // Send message
    const result = await twitter.sendThanks(body);
    handleResponse(callback, 200, result);
    console.log('Message sent');
  } catch (err) {
      if (err.isJoi) {
        handleResponse(callback, 400, err.details[0].message);
        console.log('Validation error: ' + err.details[0].message);
      } else {
        handleResponse(callback, 500, err.message);
      }
  }
};
