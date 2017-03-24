'use strict';
var path = require('path');
var findup = require('findup-sync');
var multimatch = require('multimatch');

function arrayify(el) {
  return Array.isArray(el) ? el : [el];
}

module.exports = function (grunt, options) {
  options = options || {};

  var pattern = arrayify(options.pattern || ['grunt-*']);
  var config = options.config || findup('package.json');
  var scope = arrayify(options.scope || ['dependencies', 'devDependencies', 'peerDependencies']);
  var modules = options.modules || 'node_modules'

  if (typeof config === 'string') {
    config = require(path.resolve(config));
  }

  console.log(path.resolve(options.modules))

  pattern.push('!grunt', '!grunt-cli');

  var names = scope.reduce(function (result, prop) {
    return result.concat(Object.keys(config[prop] || {}));
  }, []);

  if(options.modules){
    multimatch(names, pattern).forEach(function(task){
      grunt.loadTasks(path.resolve(modules)+'/'+task+'/tasks')
    });

  } else {
    multimatch(names, pattern).forEach(grunt.loadNpmTasks);
  }
};
