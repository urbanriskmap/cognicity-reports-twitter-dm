import * as test from 'unit.js';

import Locale from '../lib/locale';
import config from '../config';

/**
 * Twitter locale class testing harness
 */
export default function() {
  describe('Twitter locale class testing', function() {
    const locale = new Locale(config);
    const oldRequest = locale.request;
    let requestError = false;

    before(function() {
        const mockRequest = function(properties, callback) {
                if (requestError === false) {
                    callback(null, 200, {lang: 'id'});
                } else {
                    callback(new Error(`Request error`));
                }
        };

        locale.request.get = mockRequest;
    });

    it('Creates class', function(done) {
        test.value(locale instanceof Locale).is(true);
        done();
    });

    it('Gets mocked locale', function(done) {
        locale.get(1)
            .then((res) => {
                test.value(res).is('id');
                done();
            });
    });

    it('Gets default locale', function(done) {
        requestError = true;
        locale.get(1)
            .then((res) => {
                test.value(res).is(config.DEFAULT_LANGUAGE);
                done();
            });
    });


    after(function() {
      locale.request = oldRequest;
    });
  });
}
