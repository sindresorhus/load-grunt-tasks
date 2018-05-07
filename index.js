'use strict';
const path = require('path');
const pkgUp = require('pkg-up');
const multimatch = require('multimatch');
const arrify = require('arrify');
const resolvePkg = require('resolve-pkg');

module.exports = (grunt, options = {}) => {
	const pattern = arrify(options.pattern || ['grunt-*', '@*/grunt-*']);
	const scope = arrify(options.scope || ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']);

	let cwd = process.cwd();
	let config = options.config || pkgUp.sync();
	if (typeof config === 'string') {
		const configPath = path.resolve(config);
		cwd = path.dirname(configPath);
		config = require(configPath);
	}

	pattern.push('!grunt', '!grunt-cli');

	const names = scope.reduce((result, prop) => {
		const deps = config[prop] || [];
		return result.concat(Array.isArray(deps) ? deps : Object.keys(deps));
	}, []);

	for (const packageName of multimatch(names, pattern)) {
		if (options.requireResolution === true) {
			try {
				grunt.loadTasks(resolvePkg(path.join(packageName, 'tasks'), {cwd}));
			} catch (err) {
				grunt.log.error(`npm package \`${packageName}\` not found. Is it installed?`);
			}
		} else {
			grunt.loadNpmTasks(packageName);
		}
	}
};
