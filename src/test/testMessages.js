import * as test from 'unit.js';

import messages from '../lib/twitter/messages';

let expectedMsg = {
  event: {
      type: 'message_create',
      message_create: {
        target: {
          recipient_id: '123',
        },
        message_data: {
          text: `RiskMap bot helps you report flooding in realtime. `
          + `Send /flood to report. In life-threatening situations `
          + `always call 911.`,
        },
      },
    },
  };

/**
 * Twitter library function testing harness
 * @param {Object} config - configuration object
 **/
export default function(config) {
  describe('lib/twitter Message testing', function() {
    it('Get the default response', function(done) {
      let msg = messages(config).default('in', '123');
      test.value(msg).is(expectedMsg);
      done();
    });
    it('Get the default response if unknown language supplied', function(done) {
      let msg = messages(config).default('zz', '123');
      test.value(msg).is(expectedMsg);
      done();
    });
    it('Get the confirmation response with report id', function(done) {
      let msg = messages(config).card('en', '123', '1');
      test.value(msg.event.message_create.message_data.text)
        .is(`Please report using this one-time link `
          + `https://cards.riskmap.us/flood/1`);
      test.value(msg.event.message_create.target.recipient_id).is(`123`);
      done();
    });
    it('Get the thanks message with report id', function(done) {
      let msg = messages(config).thanks('en', '123', '1');
      test.value(msg.event.message_create.message_data.text)
        .is(`Thank you for your report. You can access it using this link `
          + `https://riskmap.us/map/broward/1`);
      test.value(msg.event.message_create.target.recipient_id).is(`123`);
      done();
    });
  });
}
