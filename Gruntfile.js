/*
 * grunt-sauce-connect-launcher
 * https://github.com/seckardt/grunt-sauce-connect-launcher
 *
 * Copyright (c) 2014 Steffen Eckardt
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function (grunt) {
	var _ = require('lodash');

	grunt.loadTasks('tasks');
	grunt.loadNpmTasks('grunt-contrib-jshint');

	var options = {};
	if (grunt.file.exists('user.json')) {
		_.extend(options, grunt.file.readJSON('user.json'));
	}

	// Project configuration.
	grunt.initConfig({
		jshint: {
			options: {
				jshintrc: '.jshintrc'
			},
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			]
		},

		sauce_connect: {
			options: _.defaults(options, {
				username:  process.env.SAUCE_USERNAME,
				accessKey: process.env.SAUCE_ACCESS_KEY
			}),

			e2e: {}
		}
	});


	grunt.registerTask('test', [
		'default',
		'sauce_connect:e2e',
		'sauce-connect-close'
	]);

	grunt.registerTask('default', ['jshint']);
};