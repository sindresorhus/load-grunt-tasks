'use strict';
var path = require('path');
var pkgUp = require('pkg-up');
var multimatch = require('multimatch');
var arrify = require('arrify');
var resolveFrom = require('resolve-from');

module.exports = function (grunt, opts) {
	opts = opts || {};

	var pattern = arrify(opts.pattern || ['grunt-*', '@*/grunt-*']);
	var config = opts.config || pkgUp.sync();
	var scope = arrify(opts.scope || ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']);

	if (typeof config === 'string') {
		config = require(path.resolve(config));
	}

	if (config.nodeModulesResolution === undefined) {
		config.nodeModulesResolution = true;
	}

	pattern.push('!grunt', '!grunt-cli');

	var names = scope.reduce(function (result, prop) {
		var deps = config[prop] || [];
		return result.concat(Array.isArray(deps) ? deps : Object.keys(deps));
	}, []);

	var resolver = resolveFrom.bind(null, process.cwd());

	multimatch(names, pattern).forEach(function (pkgName) {
		if (config.nodeModulesResolution) {
			var resolved = resolver(path.join(pkgName, 'package.json'));
			var tasksDir = path.join(path.dirname(resolved), 'tasks');
			grunt.loadTasks(tasksDir);
		} else {
			grunt.loadTasks(pkgName);
		}
	});
};
