import Joi from 'joi';

// Local objects
import config from '../../config';
import {handleResponse, crcResponse} from '../../lib/util';
import Twitter from '../../lib/twitter';

// Validation schema
const _crcTokenSchema = Joi.object().keys({
    crc_token: Joi.string().required(),
    nonce: Joi.string(),
});

const _dmBodySchema = Joi.object().required();

const _dmHeaderSchema = Joi.object().keys({
  'X-Twitter-Webhooks-Signature': Joi.string().required(),
});

/**
 * Endpoint for receiving twitter DM events (webhook)
 * @function receive
 * @param {Object} event - AWS Lambda event object
 * @param {Object} context - AWS Lambda context object
 * @param {Object} callback - Callback (HTTP response)
 */
export default async (event, context, callback) => {
  try {
    console.log('Handler running');

    // Require bot user id to be defined
    if (config.TWITTER_BOT_USER_ID.length < 1) {
      throw new Error('Twitter bot user ID is empty. Will now exit.');
    }

    // Twitter object
    const twitter = new Twitter(config);
    // Twitter Auth check
    if (event.httpMethod === 'GET') {
      const params = await Joi.validate(
        event.queryStringParameters, _crcTokenSchema);
      const response = await twitter.crcResponse(params.crc_token);
      console.log('Respond to Twitter CRC request.', response);
      console.log('Incoming parameters, ', event.queryStringParameters);
      crcResponse(callback, 200, response);

    // Reply to DM
    } else if (event.httpMethod === 'POST') {
      // Check request is authentic
      const headers = await Joi.validate(event.headers, _dmHeaderSchema,
        {stripUnknown: true});
      const payload = await Joi.validate(event.body, _dmBodySchema);
      const signed = twitter.signatureValidation(
        headers['X-Twitter-Webhooks-Signature'], event.body);
      // Async loop through incoming DMs
      if (signed === true) {
        if (payload.direct_message_events) {
          // Loop messages (synchronous)
          for (const item of payload.direct_message_events) {
            if (item.type === 'message_create' &&
            item.message_create.sender_id !== config.TWITTER_BOT_USER_ID) {
              try {
                // Check user not in blacklist
                config.BLACKLIST.find(function(element) {
                  if (element === item.message_create.sender_id) {
                    throw new Error('User in blacklist');
                  }
                });
                await twitter.sendReply(item);
                console.log('Sent twitter reply');
              } catch (err) {
                console.log('Error sending reply. ' + err.message);
              }
            }
          }
          handleResponse(callback, 200, {});
        }
      } else {
        console.log('Request signature did not match');
        handleResponse(callback, 403, {});
      }
    }
  // Handle errors
  } catch (err) {
    if (err.isJoi) {
      handleResponse(callback, 400, err.details[0].message);
      console.log('Validation error: ' + err.details[0].message);
    } else {
      console.log('err', err);
      handleResponse(callback, 500, err.message);
      console.log('Error: ' + err.message);
    }
  }
};
