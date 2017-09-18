import * as test from 'unit.js';

import receive from '../functions/receive/receive';

let testMsg = {
    type: 'message_create',
    message_create: {
      target: {
        recipient_id: '123',
      },
      message_data: {
        text: `/flood`,
      },
      sender_id: '321',
    },
  };
// import twitterDM from '../functions/receive/';
/**
 * Twitter library function testing harness
 * @param {Object} config - configuration object
 */
export default function(config) {
  describe('receive/get Testing', function() {
    it('Correctly classifies a message with keyword /flood', function(done) {
      let output = receive(config)._classify(testMsg);
      test.value(output).is('flood');
      done();
    });
    it('Correctly classifies a message without keyword /flood', function(done) {
      testMsg.message_create.message_data.text = 'flood';
      let output = receive(config)._classify(testMsg);
      test.value(output).is(null);
      done();
    });
    it('Can execute send of default message, catches error', function(done) {
      receive(config)._sendDefault(1)
      .catch((err) => {
        console.log(err);
        test.value(err.message).is(`Error sending message, response from `
        + `Twitter was: Error: connect ECONNREFUSED 127.0.0.1:80`);
        done();
      });
    });
     it('Can execute send of card message', function(done) {
      receive(config)._sendCard(1)
      .catch((err) => {
        console.log(err.message);
         test.value(err.message.slice(0, 21)).is(`Error requesting card`);
        done();
      });
    });
    it('Catches errors in process loop', function(done) {
      testMsg.message_create.message_data.text = '/flood';
      receive(config).process({body: {direct_message_events: [testMsg]}})
      // .then(() => done())
      .catch((err) => {
        test.value(err.message).is(`Error requesting card Error: `
          + `connect ECONNREFUSED 127.0.0.1:80`);
        done();
      });
    });
    it('Process default message and catch error', function(done) {
      testMsg.message_create.message_data.text = 'flood';
      receive(config).process({body: {direct_message_events: [testMsg]}})
      // .then(() => done())
      .catch((err) => {
        test.value(err.message).is(`Error sending message, response from `
          + `Twitter was: Error: connect ECONNREFUSED 127.0.0.1:80`);
        done();
      });
    });
  });
}
