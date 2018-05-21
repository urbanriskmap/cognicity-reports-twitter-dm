require('dotenv').config({silent: true});

export default {
    API_KEY: process.env.API_KEY,
    CARDS_API: process.env.CARDS_API || 'https://data-dev.riskmap.us/cards/',
    CARDS_URL: process.env.CARDS_URL || 'https://cards-dev.riskmap.us/flood/',
    DEFAULT_LANGUAGE: 'en',
    MAP_URL: 'https://riskmap-dev.us/',
    TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET,
    TWITTER_TOKEN: process.env.TWITTER_TOKEN,
    TWITTER_TOKEN_SECRET: process.env.TWITTER_TOKEN_SECRET,
    TWITTER_BOT_USER_ID: process.env.TWITTER_BOT_USER_ID,
    TWITTER_ENDPOINT: process.env.TWITTER_ENDPOINT || 'https://api.twitter.com/1.1/',
};
