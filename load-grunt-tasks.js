'use strict';
var path = require('path');
var minimatch = require('minimatch');

module.exports = function (grunt, patterns, pkg, depTypes) {
	var _ = grunt.util._;

	if (patterns === undefined) {
		patterns = 'grunt-*';
	}

	if (typeof patterns === 'string') {
		patterns = [patterns];
	}

	if (typeof pkg !== 'object') {
		pkg = require(path.resolve(process.cwd(), 'package.json'));
	}

	if (typeof depTypes === undefined) {
		depTypes = 'devDependencies';
	}

	if (typeof depTypes === 'string') {
		depTypes = [depTypes];
	}

	var deps = [];

	_.each(depTypes, function(value) {
		if (pkg[value]) {
			deps = deps.concat(Object.keys(pkg[value]));
        }
	});

	var tasks = patterns.map(function (pattern) {
		return minimatch.match(deps, pattern, {});
	});

	_.unique(_.flatten(tasks)).forEach(grunt.loadNpmTasks);
};
