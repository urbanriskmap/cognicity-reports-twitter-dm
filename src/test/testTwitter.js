import * as test from 'unit.js';

import Twitter from '../lib/twitter';
import config from '../config';

/**
 * Twitter library function testing harness
 */
export default function() {
  describe('Twitter bot testing', function() {
    const twitter = new Twitter(config);
    let postRequestError = false;

    before(function() {
      // Mock bot thanks
      twitter.bot.thanks = function(body) {
        return ({link: 'thanks link', text: 'thanks text'});
      };

      // Mock bot card
      twitter.bot.card = function(body) {
        return ({cardId: 'abc'});
      };

      // Mock request lib
      twitter.request.post = function(properties, callback) {
        if (postRequestError === false) {
          callback(null);
        } else {
          callback(new Error('1'));
        }
      };
    });

    it('Creates class', function(done) {
      test.value(twitter instanceof Twitter).is(true);
      done();
    });

    it('Can get thanks messsage', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'jbd',
        reportId: '1',
        userId: '1',
      };
      postRequestError = false;

      twitter.sendThanks(body)
        .then((res) => {
          test.value(res).is(null);
          done();
        });
    });

    it('Can handle error in thanks messsage', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'jbd',
        reportId: '1',
        userId: '1',
      };
      postRequestError = true;

      twitter.sendThanks(body)
        .catch((err) => {
          test.value(err.message).is('1');
          done();
        });
    });


    after(function() {

    });
  });
}
