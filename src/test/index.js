/* eslint-disable no-console */
/**
 * Unit tests for CogniCity Twitter DM Lambda
 * @file Runs unit tests for CogniCity Twitter DM Lambda
 *
 * Tomas Holderness June 2017
 */

// Unit tests
import testCards from './testLibCards';
import testTwitter from './testLibTwitter';
import testMessages from './testMessages';
import testReceive from './testReceive';

const config = {
  oauth: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
  app: {
    consumer_secret: 'abc',
    twitter_user_id: '905602080252977152', // @riskmapus bot,
    default_lang: 'en',
    twitter_endpoint: `http://127.0.0.1/`,
  },
  server: {
    card_endpoint: `https://cards.riskmap.us/flood/`,
    card_api:
      `http://127.0.0.1/`,
    api_key: process.env.SERVER_API_KEY,
  },
};

testCards(config);
testTwitter(config);
testMessages(config);
testReceive(config);
