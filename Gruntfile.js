'use strict';
module.exports = function (grunt) {
	require('./')(grunt, {
		pattern: ['grunt*'],
		config: require('./package'),
		scope: 'devDependencies'
	});

	grunt.initConfig({
		svgmin: {
			noop: {}
		}
	});

	grunt.registerTask('default', ['svgmin']);
};
