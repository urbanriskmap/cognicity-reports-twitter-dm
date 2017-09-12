import * as test from 'unit.js';

import cards from '../lib/cards/'


//cards().getCardLink();
cards()._processResponse();

describe('Twitter Lambda testing harness', function(){
  it('Process a succesful card response', function(done){
    cards()._processResponse(null, {statusCode: 200}, {cardId:3142})
      .then(cardId => {
        test.value(cardId).is(3142);
        done()
      }).catch(err => {
        done(new Error(err))
      })
  }),
  it('Catches error from server', function(done){
    cards()._processResponse('error from server', {statusCode: 200}, {cardId:3142})
      .catch(err => {
        test.value(err.message).is('error from server')
        done()
      })
  }),
  it('Catches null response object', function(done){
    cards()._processResponse(null, null, {cardId:3142})
      .catch(err => {
        test.value(err.message).is('No response or incorrect body object received from server')
        done()
      })
  }),
  it('Catches null body object', function(done){
    cards()._processResponse(null, {statusCode: 200}, null)
      .catch(err => {
        test.value(err.message).is('No response or incorrect body object received from server')
        done()
      })
  }),
  it('Catches non-200 response', function(done){
    cards()._processResponse(null, {statusCode: 404}, {cardId:3142})
      .catch(err => {
        test.value(err.message).is('No response or incorrect body object received from server')
        done()
      })
  })
})
