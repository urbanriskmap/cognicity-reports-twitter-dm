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
        return new Promise((resolve, reject) => {
          resolve({link: 'thanks link', text: 'thanks text'});
        });
      };

      // Mock bot card
      twitter.bot.card = function(body) {
        return new Promise((resolve, reject) => {
          resolve({cardId: 'abc'});
        });
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

    it('Can fallback on default instance region', function(done) {
      const body = {
        language: 'en',
        instanceRegionCode: 'null',
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

    it('Can get reply messsage', function(done) {
      postRequestError = false;

      const body = {
          type: 'message_create',
          id: '1014920438277984260',
          created_timestamp: '1530810863452',
          initiated_via: {
              welcome_message_id: '999004270392434693',
          },
          message_create: {
              target: {
                 recipient_id: '905602080252977152',
              },
              sender_id: '334660979',
              message_data: {
                  text: '&gt; Get Started',
                  entities: {
                      hashtags: [],
                      symbols: [],
                      user_mentions: [],
                      urls: [],
                  },
                  quick_reply_response: {
                      type: 'options',
                      metadata: 'start',
                  },
              },
          },
      };
      twitter.sendReply(body)
        .then((res) => {
          test.value(res).is(null);
          done();
        });
    });

    it('Can handle error in reply messsage', function(done) {
      postRequestError = true;

      const body = {
          type: 'message_create',
          id: '1014920438277984260',
          created_timestamp: '1530810863452',
          initiated_via: {
              welcome_message_id: '999004270392434693',
          },
          message_create: {
              target: {
                 recipient_id: '905602080252977152',
              },
              sender_id: '334660979',
              message_data: {
                  text: '&gt; Get Started',
                  entities: {
                      hashtags: [],
                      symbols: [],
                      user_mentions: [],
                      urls: [],
                  },
                  quick_reply_response: {
                      type: 'options',
                      metadata: 'start',
                  },
              },
          },
      };
      twitter.sendReply(body)
        .catch((err) => {
          test.value(err.message).is('1');
          done();
        });
    });

    it('Can create crc response', function(done) {
      twitter.crcResponse('token')
        .then((res) => {
          test.value(res.response_token)
            .is('sha256=6UERDj0r/oJiHw4+FDRzDXMF0QbF9oyHFl0LJ6RhGko=');
          done();
        });
    });

    it('Can validate signature', function() {
      const value = twitter
        .signatureValidation(
          'sha256=6UERDj0r/oJiHw4+FDRzDXMF0QbF9oyHFl0LJ6RhGko=',
          'token');
      test.value(value).is(true);
    });

    after(function() {

    });
  });
}
