import request from 'request';

// Define global
let DEFAULT_LANGUAGE = 'en';

/**
 * Class for getting Twitter user's locale
 * @class Locale
 * @param {Object} config - module configuration (config.js)
 */
export default class Locale {
    /**
     * constructor for class Locale
     * @param {Object} config - module configuration (config.js)
     */
    constructor(config) {
        this.config = config;
        this.request = request;

        // Update the global with the config
        DEFAULT_LANGUAGE = this.config.DEFAULT_LANGUAGE;
    }

    /**
     * Get a user's locale by user ID
     * @method get
     * @param {String} userId - Twitter user ID
     * @return {Promise} - response
     */
    get(userId) {
        return new Promise((resolve, reject) => {
            const oauth = {
                consumer_key: this.config.TWITTER_CONSUMER_KEY,
                consumer_secret: this.config.TWITTER_CONSUMER_SECRET,
                token: this.config.TWITTER_TOKEN,
                token_secret: this.config.TWITTER_TOKEN_SECRET,
            };
            const opts = {
                url: this.config.TWITTER_ENDPOINT +
                    'users/show.json?include_entities=false&user_id=' +
                    String(userId),
                oauth: oauth,
                json: true,
                headers: {
                    'content-type': 'application/json',
                },
            };

            request.get(opts, function(err, response, body) {
                if (err) {
                    console.log('Error getting user locale. ' +
                    err.message);
                    resolve(DEFAULT_LANGUAGE); // Acess the global default
                } else {
                    resolve(body.lang);
                }
            });
        });
    }
}
