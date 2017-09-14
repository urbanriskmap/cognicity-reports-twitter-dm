import * as test from 'unit.js';

import cards from '../lib/cards/';
/**
 * Twitter library function testing harness
 * @param {Object} config - configuration object
 **/
export default function(config) {
  describe('lib/cards Testing', function() {
    it('Process a succesful card response', function(done) {
      cards(config)._processResponse(null, {statusCode: 200}, {cardId: 3142})
        .then((cardId) => {
          test.value(cardId).is(3142);
          done();
        }).catch((err) => {
          done(new Error(err));
        });
    }),
    it('Catches error from server', function(done) {
      cards(config)._processResponse('error from server', {statusCode: 200},
      {cardId: 3142})
        .catch((err) => {
          test.value(err.message).is('error from server');
          done();
        });
    }),
    it('Catches null response object', function(done) {
      cards(config)._processResponse(null, null, {cardId: 3142})
        .catch((err) => {
          test.value(err.message)
            .is('No response or incorrect body received from server');
          done();
        });
    }),
    it('Catches null body object', function(done) {
      cards(config)._processResponse(null, {statusCode: 200}, null)
        .catch((err) => {
          test.value(err.message)
            .is('No response or incorrect body received from server');
          done();
        });
    }),
    it('Catches non-200 response', function(done) {
      cards(config)._processResponse(null, {statusCode: 404}, {cardId: 3142})
        .catch((err) => {
          test.value(err.message)
            .is('No response or incorrect body received from server');
          done();
        });
    });
    it('Request function fired, error caught', function(done) {
      cards(config).getCardLink('user', 'twitter', 'en')
        .catch((err) => {
          test.value(err.message)
            .is('Error: connect ECONNREFUSED 127.0.0.1:80');
          done();
        });
    });
  });
}
