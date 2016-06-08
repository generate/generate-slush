'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('global-modules', 'gm');
require('resolve-file', 'resolve');
require = fn;

utils.resolveModule = function(name) {
  return utils.resolve(name) ||
    utils.resolve(name, {cwd: utils.gm});
};

utils.gulpPath = function(name) {
  return utils.resolveModule(path.join(name, 'node_modules', 'gulp')) ||
    utils.resolveModule('gulp');
};

utils.tryRequire = function(name, file) {
  try {
    return require(utils.resolveModule(name));
  } catch (err) {
    return require(utils.resolveModule(path.join(name, file)));
  }
};

utils.task = function(gulp, key, args) {
  return function(cb) {
    gulp.args = args;
    utils.run(gulp, key, cb);
  };
};

utils.run = function(gulp, key, cb) {
  if (typeof gulp.start === 'function') {
    gulp.start(key, cb);
    return;
  }
  gulp.series(key)(cb);
};

/**
 * Expose `utils` modules
 */

module.exports = utils;
