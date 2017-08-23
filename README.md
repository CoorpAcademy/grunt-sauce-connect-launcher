
Grunt plug-in to download and launch an instance of Sauce Labs [Sauce Connect](https://saucelabs.com/docs/sauce-connect).

# Forked from https://github.com/seckardt/grunt-sauce-connect-launcher" no more maintened

[![Greenkeeper badge](https://badges.greenkeeper.io/CoorpAcademy/grunt-sauce-connect-launcher.svg)](https://greenkeeper.io/)

## Getting Started

This plugin requires Grunt `~1.0.0`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

	npm install grunt-sauce-connect-launcher --save-dev

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

	grunt.loadNpmTasks('grunt-sauce-connect-launcher');

## The "sauce_connect" multi-task

### Overview

In your project's Gruntfile, add a section named `sauce_connect` to the data object passed into `grunt.initConfig()`.

	grunt.initConfig({
	  sauce_connect: {
	    options: {
	      // Task-specific options go here.
	    },
	    your_target: {
	      // Target-specific file lists and/or options go here.
	    },
	  },
	});

### Options

#### options.username

Type: `String`
Default value: ``

#### options.accessKey

Type: `String`
Default value: ``

#### options.port

Type: `String` | `Number`
Default value: ``

#### options.proxy

Type: `String`
Default value: ``

#### options.directDomains

Type: `String` | `Array<String>`
Default value: ``

#### options.fastFailRegexps

Type: `String` | `Array<String>`
Default value: ``

#### options.logfile

Type: `String`
Default value: ``

#### options.tunnelIdentifier

Type: `String`
Default value: ``

#### options.verbose

Type: `Boolean`
Default value: `false`

#### options.logger

Type: `Function`
Default value: `grunt.verbose.writeln`

### Usage Examples

	grunt.initConfig({
	  sauce_connect: {
	    your_target: {
	      options: {
	        username: 'demo',
	        accessKey: '12345678-1234-1234-1234-1234567890ab',
	      },
	    },
	  },
	});

## The "sauce-connect-close" task

### Overview

This task can be used to ensure that the currently opened Sauce Connect tunnel gets closed and that the related Sauce Connect machine is shut down.

### Usage Examples

	grunt.registerTask('test', [
        'default',
        'sauce_connect:your_target',
        'sauce-connect-close'
    ]);

## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

* v1.0.0 - Update all packages and add bluebird. Support only node 6, 7, 8. Add travis testing
* v0.3.1 - Update to `sauce-connect-launcher^0.13.0`.
* v0.3.0 - Update to `sauce-connect-launcher~0.4.0`. Fixes issue #1. More details [here](https://github.com/bermi/sauce-connect-launcher/issues/22).
* v0.2.1 - Simplified the way to obtain running Sauce Connect machines via `?full=1` parameter when requesting the tunnel list.
* v0.2.0 - Ensure closing existing Sauce Connect tunnel (and related machine) before opening a new tunnel.
* v0.1.1 - No code changes. Unpublished v0.1.0 as `npm publish` leaked a local `user.json` with credentials.
* v0.1.0 - Initial commit.

## License

Copyright (c) 2014 Steffen Eckardt. Licensed under the MIT license.