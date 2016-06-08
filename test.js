'use strict';

require('mocha');
var assert = require('assert');
var slush = require('./');

describe('generate-slush', function() {
  it('should export a function', function() {
    assert.equal(typeof slush, 'function');
  });

  it('should export an object', function() {
    assert(slush);
    assert.equal(typeof slush, 'object');
  });

  it('should throw an error when invalid args are passed', function(cb) {
    try {
      slush();
      cb(new Error('expected an error'));
    } catch (err) {
      assert(err);
      assert.equal(err.message, 'expected first argument to be a string');
      assert.equal(err.message, 'expected callback to be a function');
      cb();
    }
  });
});
