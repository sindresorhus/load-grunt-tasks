'use strict';
var path = require('path');
var minimatch = require('minimatch');
var _ = require('lodash');

module.exports = function (grunt, patterns, pkg) {
	if (patterns === undefined) {
		patterns = 'grunt-*';
	}

	if (typeof patterns === 'string') {
		patterns = [patterns];
	}

	if (typeof pkg !== 'object') {
		pkg = require(path.resolve(process.cwd(), 'package.json'));
	}

	if (!pkg.devDependencies) {
		return;
	}

	var devDeps = Object.keys(pkg.devDependencies);

  var excludes = _(patterns)
    .remove(function (p) { return !p.indexOf('!'); })
    .map(function (p) { return p.slice(1); });

  var match = function(patterns) {
    return _(patterns).map(function (pattern) {
      return minimatch.match(devDeps, pattern, {});
    }).flatten().uniq().value();
  }

  var tasks = _.difference(match(patterns), match(excludes)).pull('grunt', 'grunt-cli');

  _(tasks).forEach(grunt.loadNpmTasks);
};
