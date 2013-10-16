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

	var tasks = patterns.map(function (pattern) {
		return minimatch.match(devDeps, pattern, {});
	});

	_(tasks).flatten().uniq().pull('grunt', 'grunt-cli').forEach(grunt.loadNpmTasks);
};
