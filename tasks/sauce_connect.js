/**
 * `grunt-sauce-connect-launcher`
 *
 * Grunt task utilizing [sauce-connect-launcher](https://github.com/bermi/sauce-connect-launcher) to download and launch Sauce Labs [Sauce Connect](https://saucelabs.com/docs/connect).
 *
 * Copyright (c) 2014-2015 Steffen Eckardt
 * Licensed under the MIT license.
 *
 * @see https://github.com/seckardt/grunt-sauce-connect-launcher
 * @see https://github.com/bermi/sauce-connect-launcher
 */
'use strict';

module.exports = function (grunt) {
	var launcher = require('sauce-connect-launcher'),
		tunnel = {};

	function close(callback) {
		var request = require('request').defaults({jar: false, json: true}),
			_ = require('lodash'),
			q = require('q');

		function obtainMachine() {
			var deferred = q.defer();
			request.get(tunnel.baseUrl + '/tunnels?full=1', function (err, resp, body) {
				if (err) {
					return deferred.reject(err);
				}

				_.every(body, function (tunnelData) {
					if (tunnelData && tunnelData.tunnel_identifier === tunnel.tid) {
						deferred.resolve(tunnelData);
						return false;
					}
					return true;
				});

				deferred.reject();
			});
			return deferred.promise;
		}

		function killMachine(tunnelData) {
			var deferred = q.defer(),
				tunnelId = tunnelData.id || tunnel.tid;

			grunt.log.writeln('Stop'.cyan + ' Sauce Connect machine: ' + tunnelId.cyan);

			request.del(tunnel.baseUrl + '/tunnels/' + tunnelId, function (err, resp, body) {
				if (err || !body || body.result !== true) {
					grunt.log.writeln('Failed'.red + ' to stop Sauce Connect machine: ' + tunnelId.cyan);
				} else {
					grunt.log.writeln('Stopped'.green + ' Sauce Connect machine: ' + tunnelId.cyan);
				}
				deferred.resolve();
			});

			return deferred.promise;
		}

		function closeTunnel() {
			var deferred = q.defer();
			launcher.kill(function() {
				grunt.log.writeln('Closed'.green + ' Sauce Connect tunnel: ' + tunnel.tid.cyan);
				deferred.resolve();
			});
			return deferred.promise;
		}

		if (tunnel.process) {
			// Prevent double closing of the current tunnel process
			delete tunnel.process;

			grunt.log.writeln('Close'.cyan + ' Sauce Connect tunnel: ' + tunnel.tid.cyan);

			obtainMachine()
				.then(killMachine)
				.then(closeTunnel)
				.fin(function () {
					callback();
				});
		} else {
			grunt.log.writeln('Close'.cyan + ' current Sauce Connect tunnel');
			launcher.kill(function () {
				grunt.log.writeln('Closed'.green + ' current Sauce Connect tunnel');
				callback();
			});
		}
	}

	grunt.registerMultiTask('sauce_connect', 'Grunt plug-in to download and launch Sauce Labs Sauce Connect', function () {
		var options = this.options({
				tunnelIdentifier: 'Tunnel' + new Date().getTime(),
				verbose: grunt.option('verbose') === true,
				logger: grunt.verbose.writeln
			}),
			done = this.async();

		function open() {
			var tunnelId = tunnel.tid = options.tunnelIdentifier,
				userName = options.username;
			grunt.log.writeln('Open'.cyan + ' Sauce Connect tunnel: ' + tunnelId.cyan);

			// Create base URL for Sauce Labs REST API calls
			tunnel.baseUrl = ['https://', userName, ':', options.accessKey, '@saucelabs.com', '/rest/v1/', userName].join('');

			launcher(options, function (err, process) {
				if (err) {
					launcher.kill(function () {
						err = err.error || (err.message || String(err));
						return grunt.warn('Failed to open Sauce Connect tunnel: ' + err);
					});
				}

				grunt.log.writeln('Opened'.green + ' Sauce Connect tunnel: ' + tunnelId.cyan);
				tunnel.process = process;
				done();
			});
		}

		if (tunnel.process) {
			grunt.log.writeln('Existing'.cyan + ' Sauce Connect tunnel: ' + tunnel.tid.cyan);
			close(open);
		} else {
			open();
		}
	});

	grunt.registerTask('sauce-connect-close', 'Closes the current Sauce Connect tunnel', function () {
		close(this.async());
	});
};