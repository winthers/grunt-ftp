var FtpDeploy = require('ftp-deploy');
var FileMemory = require("./checksum.js");

function msToTime(s) {
    var ms = s % 1000;
    s = (s - ms) / 1000;
    var secs = s % 60;
    s = (s - secs) / 60;
    var mins = s % 60;
    var hrs = (s - mins) / 60;

    return hrs + ':' + mins + ':' + secs + '.' + ms;
}

function upload(options, done) {

    let src = options.src.substr(-1) == "/" ? options.src : (options.src + "/");
        src = src.substr(0,2) == "./"  ? src : ("./" + src)

    var config = {
        user: options.user,                   // NOTE that this was username in 1.x 
        password: options.password,           // optional, prompted if none given
        host: options.host,
        port: options.host.port,
        src: `${src}`,
        dest: options.dest,
        // include: ['*', '**/*'],      // this would upload everything except dot files
        include: [''],
        exclude: [''],     // e.g. exclude sourcemaps - ** exclude: [] if nothing to exclude **
        deleteRemote: false,              // delete ALL existing files at destination before uploading, if true
        forcePasv: true                 // Passive mode is forced (EPSV command is not sent)
    }

    config.localRoot = config.src;
    config.remoteRoot = config.dest;




    var ftpDeploy = new FtpDeploy();

    var filesSuccessfullyUploaded = [];
    var changedFileChecksums; 


    FileMemory.getChangedFiles(config.src).then(({files, checkSums}) => {

        
        changedFileChecksums = checkSums;

        if (!files.length) {
            console.log("FTP - Skip | No changed files detected!")
            done();
            return;
        }

        // -------------------------------------------------------


        console.log(`FTP - Uploading files (${files.length}) `);
        if (files.length) {
            config.include = files.map(path => path.replace(config.src, ""));
            console.log(`- only uploading changed files (${files.length}) | ${config.include}`)
        }



        var start = new Date().getTime();
        ftpDeploy.deploy(config)
            .then(res => {
                var timeElapsed = msToTime(new Date().getTime() - start)
                console.log(`FTP - Finished: Files deployed to: http://${config.host}/${config.dest} | time : ${timeElapsed} `)
                
                // write uploaded file to cache.
                const result = {};
                filesSuccessfullyUploaded.forEach(path => {
                    const key = (config.src + path.replace(/^\//, ""));
                    result[key] = changedFileChecksums[ key ];
                })
                FileMemory.saveChangedFiles(result);


                if (errors.length) {
                    console.log("Upload Errors:")
                    console.log(errors.join("\n"));
                }
                done();
            })
            .catch(err => {
                console.log(err);
                console.log(errors.join("\n"));
                done();
            })
    })

    ftpDeploy.on('uploading', function (data) {
        filesSuccessfullyUploaded.push(data.filename);
        var p = Math.floor(data.transferredFileCount / data.totalFilesCount * 100);
        console.log(` ${p}% - ${data.transferredFileCount}/${data.totalFilesCount} - ${data.filename}`)
    });

    let errors = [];
    ftpDeploy.on('upload-error', function (data) {
        errors.push(data.err);
        console.log("UPLOAD ERROR - ", data.err); // data will also include filename, relativePath, and other goodies
    });
}
function purgeCache () {
    FileMemory.purge();
}


module.exports =  {
    upload,
    purgeCache
}
