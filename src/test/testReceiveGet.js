import * as test from 'unit.js';

const event = {
  query: {
    crc_token: '1',
  },
};

import get from '../functions/receive/get';
/**
 * Twitter library function testing harness
 * @param {Object} config - configuration object
 **/
export default function(config) {
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
