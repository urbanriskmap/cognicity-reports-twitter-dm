import crypto from 'crypto';
import request from 'request';

// Locals
import Bot from '@urbanriskmap/cognicity-bot-core';
import messages from './messages.json';

/**
 * Class for sending CogniCity messages via Twitter DM
 * @class Twitter
 * @param {Object} config - Twitter parameters
 * @return {Object} Class methods
 */
export default class Twitter {
    /**
     * constructor for class Twitter
     * @param {Object} config - Twitter parameters
     */
    constructor(config) {
        this.config = config;
        this.config.MESSAGES = messages;
        this.bot = new Bot(this.config);
        this.request = request;
    }

    /**
     * Method to filter text by keyword
     * @method _classify
     * @private
     * @param {String} text - message from user
     * @return {String} - keyword or null
     */
    _classify(text) {
        // filter the message by keyword
        const re = new RegExp(/\/flood/gi);
        if (re.exec(text) !== null) {
          return 'flood';
        } else {
          return null;
        }
    }

   /**
    * Prepares Twitter CRC response
    * @function crcResponse
    * @param {Object} token - request token
    * @return {Object} - Twitter CRC response
    **/
    crcResponse(token) {
        return new Promise((resolve, reject) => {
            const hash = crypto.createHmac('sha256',
                this.config.TWITTER_CONSUMER_SECRET)
            .update(token)
            .digest('base64');
            const hashstring = 'sha256=' + hash;
            const response = JSON.parse('{"response_token": "'+hashstring+'"}');
            resolve(response);
        });
    }

    /**
    * Prepares Twitter message
    * @method _prepareResponse
    * @private
    * @param {String} userId - User or Telegram chat ID for reply
    * @param {Object} message - Bot message object
    * @return {Object} - Request object
  **/
    _prepareResponse(userId, message) {
        const body = {
            event: {
              type: 'message_create',
              message_create: {
                target: {
                  recipient_id: userId,
                },
                message_data: {
                  text: message.text + (message.link || ''),
                },
              },
            },
          };
        const endpoint = this.config.TWITTER_ENDPOINT +
            'direct_messages/events/new.json';

        const oauth = {
            consumer_key: this.config.TWITTER_CONSUMER_KEY,
            consumer_secret: this.config.TWITTER_CONSUMER_SECRET,
            token: this.config.TWITTER_TOKEN,
            token_secret: this.config.TWITTER_TOKEN_SECRET,
        };

        const request = {
            url: endpoint,
            oauth: oauth,
            json: true,
            headers: {
                'content-type': 'application/json',
            },
            body: body,
        };
        return (request);
    }

    /**
    * Prepares Twitter message
    * @method _prepareResponse
    * @private
    * @param {String} userId - User or Telegram chat ID for reply
    * @param {Object} message - Bot message object
    * @return {Object} - Request object
  **/
    _prepareCardResponse(userId, message) {
        const body = {
            event: {
            type: 'message_create',
            message_create: {
                target: {
                recipient_id: userId,
                },
                message_data: {
                text: message.text,
                ctas: [
                    {
                    'type': 'web_url',
                    'label': 'Add your report',
                    'url': 'https://dev.riskmap.us',
                    },
                ],
                },
            },
            },
        };
        const endpoint = this.config.TWITTER_ENDPOINT +
            'direct_messages/events/new.json';

        const oauth = {
            consumer_key: this.config.TWITTER_CONSUMER_KEY,
            consumer_secret: this.config.TWITTER_CONSUMER_SECRET,
            token: this.config.TWITTER_TOKEN,
            token_secret: this.config.TWITTER_TOKEN_SECRET,
        };

        const request = {
            url: endpoint,
            oauth: oauth,
            json: true,
            headers: {
                'content-type': 'application/json',
            },
            body: body,
        };
        return (request);
    }

  /**
    * Send Facebook message
    * @method _sendMessage
    * @private
    * @param {Object} properties - Properties of request
    * @param {String} request - Request string
    * @param {Object} body - Request body
    * @return {Promise} - Result of request
  **/
  _sendMessage(properties) {
    return new Promise((resolve, reject) => {
        console.log('Sending request to Twitter.');
        this.request.post(properties, function(err, response, body) {
            // error handling.
            console.log(err);
            resolve(null);
        });
    });
  }

    /**
    * Prepare and send a thank you message to user with report ID
    * @method sendThanks
    * @param {Object} body - HTTP body request object
    * @return {Promise} - Result of request
    **/
    sendThanks(body) {
        return new Promise((resolve, reject) => {
        this.bot.thanks(body)
            .then((message) => {
            const response = this._prepareResponse(body.userId, message);
            resolve(this._sendMessage(response));
            }).catch((err) => reject(err));
        });
    }

    /**
    * Respond to user based on input
    * @method sendReply
    * @param {Object} dmEvent - Incoming Twitter DM
    * @return {Promise} - Result of request
    **/
    sendReply(dmEvent) {
        return new Promise(async (resolve, reject) => {
            const properties = {
                userId: dmEvent.message_create.sender_id,
                language: this.config.DEFAULT_LANGUAGE, // TODO - use lang
                network: 'twitter',
            };
            try {
                let message = await this.bot.default(properties);
                if (this._classify(
                    dmEvent.message_create.message_data.text) === 'flood') {
                    message = await this.bot.card(properties);
                }
                const response = this._prepareCardResponse(
                        properties.userId, message);
                    resolve(this._sendMessage(response));
            } catch (err) {
                reject(err);
            }
        });
    }
}
