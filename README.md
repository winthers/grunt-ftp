# grunt_ftp

> upload stuff to ftp, maintains a checksum list of files uploaded to allow only changed files to be uploaded on recurring uploads. 

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt_ftp --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt_ftp');
```

## The "grunt_ftp" task

### Overview
In your project's Gruntfile, add a section named `grunt_ftp` to the data object passed into `grunt.initConfig()`.

```js
module.exports = function(grunt) {
grunt.initConfig({
  grunt_ftp: {
    options: {
      "host": "ftp.hostname",
      "port": 21,
      "src": "localRoot",
      "dest": "remoteRoot",
      "credentials": "ftp-credentials.json"
    }
  },
});
grunt.loadTasks('grunt-ftp');
};
```



# Options

## host
Type: `String`

Default value: `''`

the ftp host name.

## port
Type: `Number`

Default value: `21`


## src
Type: `String`
Default value: `''`

description

## dest
Type: `String`
Default value: `''`

description


## credentials

Type: `String`
Default value: `''`

path to a ftp credentials.json file

## credentials file

This file contains the ftp `user` and `password` it should be located as specified in `options.credentials`

**important** if this file is located in the project it should be added to your `.gitignore` 

**credentials example**

```json
{
    "user": "ftp-username",
    "password": "ftp-password"
}
```


### Usage Examples


## Clearing the file cache
The internal file cashed can be purged by calling the task with the purge argument like below.

> grunt grunt_ftp:purge 


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
