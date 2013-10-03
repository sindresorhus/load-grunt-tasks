'use strict';
var path = require('path');
var minimatch = require('minimatch');

module.exports = function (grunt, pattern, pkg, ignore) {
	var _ = grunt.util._;

	if (pattern === undefined) {
		pattern = 'grunt-*';
	}

	if (ignore === undefined) {
		ignore = [];
	}

	// always ignore these modules
	ignore.push('grunt', 'grunt-cli');

	if (typeof pkg !== 'object') {
		pkg = require(path.resolve(process.cwd(), 'package.json'));
	}

	var deps = _.extend({}, pkg.dependencies, pkg.devDependencies);
	var depNames = Object.keys(deps);

	if (!depNames.length) {
		return;
	}

	var tasks = minimatch.match(depNames, pattern, {});

	_.unique(tasks).filter(function (task) {
		return ignore.indexOf(task) === -1;
	}).forEach(grunt.loadNpmTasks);
};
