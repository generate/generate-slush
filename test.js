'use strict';

require('mocha');
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var generate = require('generate');
var generator = require('./');
var app;

var cwd = path.resolve.bind(path, __dirname, 'actual');

describe('generate-slush', function() {
  beforeEach(function() {
    app = generate({silent: true});
    app.cwd = cwd();
    app.option('dest', cwd());
  });

  describe('plugin', function() {
    it('should only register the plugin once', function(cb) {
      var count = 0;
      app.on('plugin', function(name) {
        if (name === 'generate-slush') {
          count++;
        }
      });
      app.use(generator);
      app.use(generator);
      app.use(generator);
      assert.equal(count, 1);
      cb();
    });
  });

  describe('plugin', function() {
    it('should work as a plugin', function() {
      app.use(generator);
      assert(app.tasks.hasOwnProperty('default'));
      assert(app.tasks.hasOwnProperty('slush'));
    });

    it('should run the `slush` task', function(cb) {
      app.use(generator);
      app.generate('slush', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it('should run the `default` task', function(cb) {
      app.use(generator);
      app.generate('default', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it.skip('should run the `slush-foo` generator', function(cb) {
      app.use(generator);
      app.option('tasks', ['slush.foo']);
      app.generate('slush.foo', function(err) {
        if (err) return cb(err);
        cb();
      });
    });
  });

  describe('generator', function() {
    it('should work as a generator', function(cb) {
      app.register('slush', generator);
      app.generate('slush', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it('should run the `default` task', function(cb) {
      app.register('slush', generator);
      app.generate('slush:default', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it.skip('should run the `angular` slush generator', function(cb) {
      app.option('tasks', ['slush.angular']);
      app.register('slush', generator);
      app.generate('slush.angular', function(err) {
        if (err) return cb(err);
        cb();
      });
    });
  });

  describe('sub-generator', function() {
    it('should work as a sub-generator', function(cb) {
      app.register('foo', function(foo) {
        foo.register('slush', generator);
      });
      app.generate('foo.slush', function(err) {
        if (err) return cb(err);
        cb();
      });
    });

    it('should run the `default` task', function(cb) {
      app.register('foo', function(foo) {
        foo.register('slush', generator);
      });
      app.generate('foo.slush:default', function(err) {
        if (err) return cb(err);
        cb();
      });
    });
  });
});
