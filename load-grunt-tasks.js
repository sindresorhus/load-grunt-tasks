'use strict';
var matchdep = require('matchdep');

module.exports = function (grunt, options) {
	var fn = 'filterAll';
	var pattern = options.pattern;
	var config = options.config;
	var limit = options.limit;

	if (pattern === undefined) {
		pattern = 'grunt-*';
	}

	if (typeof pattern === 'string') {
		pattern = [pattern];
	}

	if (limit === 'dependencies') {
		fn = 'filter';
	}

	if (limit === 'devDependencies') {
		fn = 'filterDev';
	}

	if (limit === 'peerDependencies') {
		fn = 'filterPeer';
	}

	pattern.push('!grunt', '!grunt-cli');

	matchdep[fn](pattern, config).forEach(grunt.loadNpmTasks);
};
