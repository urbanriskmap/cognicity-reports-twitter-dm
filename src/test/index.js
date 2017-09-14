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
import testReceiveGet from './testReceiveGet';
import testMessages from './testMessages';

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
  },
  server: {
    card_endpoint: `https://cards.riskmap.us/flood/`,
  },
};

testCards(config);
testTwitter(config);
testReceiveGet(config);
testMessages(config);
