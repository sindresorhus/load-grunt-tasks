'use strict';
var path = require('path');
var pkgUp = require('pkg-up');
var multimatch = require('multimatch');
var arrify = require('arrify');
var resolveCwd = require('resolve-cwd');

module.exports = function (grunt, opts) {
	opts = opts || {};

	var pattern = arrify(opts.pattern || ['grunt-*', '@*/grunt-*']);
	var config = opts.config || pkgUp.sync();
	var scope = arrify(opts.scope || ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']);

	if (typeof config === 'string') {
		config = require(path.resolve(config));
	}

	pattern.push('!grunt', '!grunt-cli');

	var names = scope.reduce(function (result, prop) {
		var deps = config[prop] || [];
		return result.concat(Array.isArray(deps) ? deps : Object.keys(deps));
	}, []);

	multimatch(names, pattern).forEach(function (pkgName) {
		if (opts.requireResolution === true) {
			// This resolution is complicated because most grunt plugins are written
			// in violation of package.json conventions. And example is not having a
			// `main` field defined, which will cause `require` or `resolve`
			// to fail. So better to lookup a guaranteed file, such as package.json.
			var pkg = resolveCwd(path.join(pkgName, 'package.json'));
			var root = path.dirname(pkg);
			pkgName = path.join(root, 'tasks');
		}

		grunt.loadTasks(pkgName);
	});
};
