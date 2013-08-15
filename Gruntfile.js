'use strict';
module.exports = function (grunt) {
	require('./load-grunt-tasks')(grunt, ['grunt-*'], require('./package'));

	grunt.initConfig({
		svgmin: {
			noop: {}
		}
	});

	grunt.registerTask('default', ['svgmin']);
};
