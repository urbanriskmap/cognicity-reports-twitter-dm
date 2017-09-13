import * as test from 'unit.js';

const config = {
  oauth: {
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    token: process.env.TWITTER_ACCESS_TOKEN_KEY,
    token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
  app: {
    consumer_secret: 'abc',
  },
};

const event = {
  query: {
    crc_token: '1',
  },
};

import get from '../functions/receive/get';
/**
 * Twitter library function testing harness
 **/
export default function() {
  describe('receive/get Testing', function() {
    it('Process a succesful card response', function(done) {
      get(config, event)
      .then((response) => {
        test.value(response)
          .is({'response_token':
           'sha256=gpHnS6og+oGBB9agylSs5UOjYhAPjm/XLzWLdKp3YTU='});
        done();
      });
    });
  });
}
