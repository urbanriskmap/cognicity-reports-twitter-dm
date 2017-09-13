import * as test from 'unit.js';

import twitter from '../lib/twitter/';
/**
 * Twitter library function testing harness
 **/
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
 /**
  * lib/twitter testing function
 **/
export default function() {
  /**
   * lib/twitter testing harness
  **/
  describe('lib/twitter Testing', function() {
    it('Process a proper Twitter request object', function(done) {
      const msg = {
        event: {
          type: 'message_create',
          message_create: {
            target: {
              recipient_id: undefined,
            },
            message_data: {
              text: `RiskMap bot helps you report flooding in realtime. `
              + `Send /flood to report. In life-threatening situations always `
              + `call 911.`,
            },
          },
        },
      };

      let requestOptions = twitter(config)._prepareRequest(msg);
      // console.log(twitter(config).config);
      test.value(requestOptions.body).is(msg);
      test.value(requestOptions.json).is(true);
      test.value(requestOptions.headers)
        .is({'content-type': 'application/json'});
      done();
    });

   it('Respond with proper crc token', function(done) {
   twitter(config).crcResponse('1')
   .then((response) => {
     test.value(response).is({'response_token':
      'sha256=gpHnS6og+oGBB9agylSs5UOjYhAPjm/XLzWLdKp3YTU='});
     done();
   });
 });
 });
}
