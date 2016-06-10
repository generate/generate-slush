'use strict';

var utils = require('./utils');

module.exports = function(app) {
  if (!utils.isValid(app, 'generate-slush')) return;

  app.task('slush', { silent: true }, function(cb) {
    var msg = `
  Usage: ${utils.log.cyan('gen slush.<generator>')}

  generator: part of a slush generator name that comes after the ${utils.log.cyan('`slush-`')} part.

  Examples:

    ${utils.log.gray('# Run the `slush-angular` generator')}
    ${utils.log.bold('$ gen slush.angular')}

    ${utils.log.gray('# Run the `slush.express` generator')}
    ${utils.log.bold('$ gen slush.express')}

    `;

    console.log(`${msg}`);
    cb()
  });

  app.task('default', { silent: true }, ['slush']);

  // dynamically register sub generators and tasks
  // based on which slush generators are being run
  var res = utils.parseTasks(app);

  if (!res || !res.generators.length) {
    return;
  }

  var invoked = {};
  res.generators.forEach(function(generator) {

    app.register(generator, function(sub) {
      if (invoked[generator]) return;
      invoked[generator] = true;
      var moduleName = `slush-${generator}`;
      var modulePath = utils.resolveModule(moduleName);
      if (!modulePath) {
        console.log();
        console.log(utils.log.yellow(`  Unable to find "${moduleName}". Make sure it's been installed with npm.`));
        console.log();
        return;
      }

      var gulpPath = utils.gulpPath(moduleName);
      if (!gulpPath) {
        console.log();
        console.log(utils.log.yellow(`  Unable to find a local gulp module for "${moduleName}"`));
        console.log();
        return;
      }

      var gulp = require(gulpPath);
      utils.tryRequire(moduleName, 'slushfile.js');

      var keys = Object.keys(gulp.tasks || gulp._registry.tasks() || {});
      keys.forEach(function(key) {
        sub.task(key, function(cb) {
          // console.log(`${sub.name} => ${this.name}`);
          utils.task(gulp, key)(cb);
        });
      });
    });
  });
};
