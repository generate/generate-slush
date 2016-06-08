/*!
 * generate-slush (https://github.com/generate/generate-slush)
 *
 * Copyright (c) 2016, Brian Woodward.
 * Licensed under the MIT License.
 */

'use strict';

var debug = require('debug')('generate-slush');

module.exports = function(config) {
  return function(app) {
    if (this.isRegistered('generate-slush')) return;

    this.define('slush', function() {
      debug('running slush');
      
    });
  };
};
