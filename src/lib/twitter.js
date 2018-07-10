import crypto from 'crypto';
import request from 'request';

// Locals
import Bot from '@urbanriskmap/cognicity-bot-core';
import buttons from './buttons.json';

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
        this.config.MESSAGES = require('./messages-' +
            this.config.DEFAULT_INSTANCE_COUNTRY_CODE +
            '.json');
        this.bot = new Bot(this.config);
        this.request = request;
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
    * Validates Twitter request signature
    * @function signatureValidation
    * @param {Object} signature - Request signature
    * @param {Object} body - Incoming body
    * @return {Bool} state - Result of validation
    **/
    signatureValidation(signature, body) {
        const hash = crypto.createHmac('sha256',
            this.config.TWITTER_CONSUMER_SECRET)
            .update(body)
            .digest('base64');
        const hashstring = 'sha256=' + hash;
        const state = crypto.timingSafeEqual(
            Buffer.from(hashstring), Buffer.from(signature));

        return (state);
    }

    /**
    * Prepares Twitter message
    * @method _prepareThanksResponse
    * @private
    * @param {Object} properties - Reply properties
    * @param {String} properties.userId - User or Telegram chat ID for reply
    * @param {Object} properties.card - Bot card message object
    * @param {String} properties.language - User locale (e.g. 'en')
    * @param {String} properties.thanks - Bot thanks message object
    * @return {Object} - Request object
    **/
 _prepareThanksResponse(properties) {
    const body = {
        event: {
            type: 'message_create',
            message_create: {
                target: {
                    recipient_id: properties.userId,
                },
                message_data: {
                    text: properties.thanks.text,
                    ctas: [
                        {
                        type: 'web_url',
                        label: buttons[properties.language].text.view,
                        url: properties.thanks.link,
                        },
                        {
                        type: 'web_url',
                        label: buttons[properties.language].text.add,
                        url: properties.card.link,
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
    * Prepares Twitter message
    * @method _prepareCardResponse
    * @private
    * @param {Object} properties - Reply properties
    * @param {String} properties.userId - User or Telegram chat ID for reply
    * @param {Object} properties.message - Bot message object
    * @param {String} properties.language - User locale (e.g. 'en')
    * @return {Object} - Request object
  **/
    _prepareCardResponse(properties) {
        const body = {
            event: {
            type: 'message_create',
            message_create: {
                target: {
                    recipient_id: properties.userId,
                },
                message_data: {
                text: properties.message.text,
                ctas: [
                    {
                    type: 'web_url',
                    label: buttons[properties.language].text.report,
                    url: properties.message.link,
                    },
                    {
                    type: 'web_url',
                    label: buttons[properties.language].text.map,
                    url: this.config.MAP_URL,
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
        console.log('Sending request to Twitter');
        this.request.post(properties, function(err, response, body) {
            if (err) {
                console.log('Error sending request to Twitter. ', err);
                reject(err);
            }
            resolve(null);
        });
    });
  }

    /**
    * Prepare and send a thank you message to user with report ID
    * @method sendThanks
    * @param {Object} body - HTTP body request object
    * @param {String} body.reportId - report identifier for uniquie link
    * @param {String} body.language - language of response
    * @param {String} body.instanceRegionCode - CogniCity region code
    * @return {Promise} - Result of request
    **/
    sendThanks(body) {
        return new Promise(async (resolve, reject) => {
            try {
                // Handle null instance region code
                if (body.instanceRegionCode === 'null') {
                    body.instanceRegionCode =
                        this.config.DEFAULT_INSTANCE_REGION_CODE;
                }
                const thanks = await this.bot.thanks(body);
                const card = await this.bot.card(body);
                const properties = {
                    thanks: thanks,
                    card: card,
                    userId: body.userId,
                    language: body.language,
                };
                const response = await this._prepareThanksResponse(properties);
                console.log('Sending thanks message');
                const send = await this._sendMessage(response);
                resolve(send);
            } catch (err) {
                console.log('Error sending thanks message.', err);
                reject(err);
            }
        });
    }

    /**
    * Respond to user based on input
    * @method sendReply
    * @param {Object} dmEvent - Incoming Twitter DM
    * @return {Promise} - Result of request
    **/
    sendReply(dmEvent) {
        console.log('send reply is fired');
        return new Promise(async (resolve, reject) => {
            const properties = {
                userId: dmEvent.message_create.sender_id,
                language: this.config.DEFAULT_LANGUAGE, // TODO - use msg lang
                network: 'twitter',
            };
            try {
                const message = await this.bot.card(properties);
                const response = this._prepareCardResponse({
                    userId: properties.userId,
                    message: message,
                    language: properties.language,
                });
                const send = await this._sendMessage(response);
                resolve(send);
            } catch (err) {
                console.log('Error responding to dmEvent.', err.message);
                reject(err);
            }
        });
    }
}
