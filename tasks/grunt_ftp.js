/*
 * grunt_ftp
 * https://github.com/marti/New folder
 *
 * Copyright (c) 2020 martin winther
 * Licensed under the MIT license.
 */

'use strict';
const ftp = require("../src/ftp.js");

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerTask('grunt_ftp', 'uploads stuff to ftp', function(arg1) {

    console.log(arg1)
    // Merge task-specific and/or target-specific options with these defaults.
    var done = this.async();
    const complete = () => {
      grunt.log.writeln('All done!');
      done();
    }


    if(arg1 === "purge") {
      ftp.purgeCache();
      complete();
    }

    var options = this.options({
      "host": "",
      "port": 21,
      "src": "",
      "dest": "",
      "credentials": "",
      "purgeCache": false
    });


    if(Object.keys(options).some(k => options[k] === "")) {
      grunt.log.error("incorrect configuration:");
      Object.keys(options).filter(k => options[k] === "").forEach(k => {
        grunt.log.error(`\t- "${k}" must be defined.`);
      })
      return;
    }



    let credentials = JSON.parse(grunt.file.read(options.credentials));


    var config = { 
      ... options,
      ... credentials
    }

    ftp.upload(config, complete)


  });

};
