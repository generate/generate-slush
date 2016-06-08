'use strict';

var utils = require('./utils');

module.exports = function(app) {
  var tasks = app.option('tasks');
  var task = tasks[0];
  var args = tasks.length > 1 ? tasks.slice(1) : [];

  if (/^slush/.test(task)) {
    var segs = task.split(':');
    var generator = segs[0].split('.')[1];
    var task = segs.length > 1 ? segs[1] : 'default';

    if (!generator) {
      throw new Error('Expected a slush generator to be specified.');
    }

    app.register(generator, function(sub) {
      var moduleName = `slush-${generator}`;
      var gulp = require(utils.gulpPath(moduleName));
      utils.tryRequire(moduleName, 'slushfile.js');

      var keys = Object.keys(gulp.tasks || gulp._registry.tasks() || {});
      keys.forEach(function(key) {
        sub.task(key, utils.task(gulp, key, args));
      });

      // slush generators are expected to handle additional
      // arguments so this will prevent errors from being
      // thrown when an argument is used.
      sub.on('finished', function() {
        process.exit();
      });
    });
  }
};
