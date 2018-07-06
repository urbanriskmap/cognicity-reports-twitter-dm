require('dotenv').config({silent: true});

export default {
    API_GW_WEBHOOK: process.env.API_GW_WEBHOOK,
    BLACKLIST: (process.env.BLACKLIST || '').split(','),
    CARDS_API: process.env.CARDS_API || 'https://data.riskmap.us/cards/',
    CARDS_API_KEY: process.env.CARDS_API_KEY,
    CARDS_URL: process.env.CARDS_URL || 'https://cards.riskmap.us/flood/',
    DEFAULT_INSTANCE_REGION_CODE: process.env.DEFAULT_INSTANCE_REGION_CODE ||
    'brw',
    DEFAULT_LANGUAGE: process.env.DEFAULT_LANGUAGE || 'en',
    MAP_URL: process.env.MAP_URL || 'https://riskmap.us/',
    TWITTER_CONSUMER_KEY: process.env.TWITTER_CONSUMER_KEY,
    TWITTER_CONSUMER_SECRET: process.env.TWITTER_CONSUMER_SECRET || 'secret',
    TWITTER_TOKEN: process.env.TWITTER_TOKEN,
    TWITTER_TOKEN_SECRET: process.env.TWITTER_TOKEN_SECRET,
    TWITTER_BOT_USER_ID: process.env.TWITTER_BOT_USER_ID,
    TWITTER_ENDPOINT: process.env.TWITTER_ENDPOINT || 'https://api.twitter.com/1.1/',
};
