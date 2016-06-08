'use strict';

var utils = require('./utils');

module.exports = function(app) {
  if (!utils.isValid(app, 'generate-slush')) return;

  app.task('slush', function(cb) {
    console.log(`${app.name} => ${this.name}`);
    cb()
  });

  app.task('default', { silent: true }, ['slush']);

  // dynamically register sub generator and tasks
  // based on which slush generator is trying to be run

  var res = utils.parseTasks(app);
  if (res) {
    app.register(res.generator, function(sub) {
      var moduleName = `slush-${res.generator}`;
      var gulpPath = utils.gulpPath(moduleName);
      if (!gulpPath) {
        throw new Error('Unable to find a local gulp module');
      }
      var gulp = require(gulpPath);
      utils.tryRequire(moduleName, 'slushfile.js');

      var keys = Object.keys(gulp.tasks || gulp._registry.tasks() || {});
      keys.forEach(function(key) {
        sub.task(key, utils.task(gulp, key, res.args));
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
