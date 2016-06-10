'use strict';

var path = require('path');
var utils = require('lazy-cache')(require);
var fn = require;
require = utils;

/**
 * Lazily required module dependencies
 */

require('global-modules', 'gm');
require('is-valid-app', 'isValid');
require('log-utils', 'log');
require('resolve-file', 'resolve');
require = fn;

utils.parseTasks = function(app) {
  var res = {};
  res.tasks = app.option('tasks') || [];
  res.generators = [];

  res.tasks.forEach(function(task) {
    if (task.indexOf('slush') === -1) {
      return;
    }

    var segs = task.split(':')[0].split('.');
    var generator = segs[segs.length - 1];

    if (!generator) {
      return;
    }
    res.generators.push(generator);
  });

  return res;
};

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

utils.task = function(gulp, key) {
  return function(cb) {
    utils.run(gulp, key, cb);
  };
};

utils.run = function(gulp, key, cb) {
  try {
    if (typeof gulp.start === 'function') {
      gulp.start(key, function(err) {
        if (err) return handleError(err);
        cb();
      });
      return;
    }
    gulp.series(key)(function(err) {
      if (err) return handleError(err);
      cb();
    });
  } catch (err) {
    handleError(err);
  }
};

function handleError(err) {
  console.error();
  console.error('ERROR running slush generator:', err);
  console.error();
}

/**
 * Expose `utils` modules
 */

module.exports = utils;
