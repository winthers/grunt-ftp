
const fs = require("fs");
const bulkGlob = require("./bulkglobber.js");
const md5File = require('md5-file');
const cachePath = require("./globals.js").cachePath;

async function checksum(path) {
    return new Promise((resolve, reject) => {
        md5File(path, (err, hash) => {
            if (err) return reject({ err, path });
            resolve({ path, hash });
        })
    })
}

async function createCheckSums(src) {

    return new Promise((resolve, reject) => {

        bulkGlob(`${src}/**/**.*`)
        .then(paths => {

            var files = paths.filter(p => {
                return !fs.lstatSync(p).isDirectory()
            })
            const checkSumPromises = files.map(p => checksum(p));
            Promise.all(checkSumPromises)
            .then(data => {
                var fileContent = {};
                data.forEach(o => {
                    fileContent[o.path] = o.hash;
                })
                resolve(fileContent);

            }).catch(err => {
                reject(err);
            })
        })
        .catch(err => {
            reject(err);
        })
    })
}

function fileExists(path) {

    try {
        if (fs.lstatSync(path).isFile()) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        return false;
    }
}

function getChangedFiles(src) {
    

    return new Promise((resolve, reject) => {

        createCheckSums(src).then(checkSums => {

            let changedFiles = [];

            // Read the cashe file.
            if (fileExists(cachePath)) {
                var cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
                // find any new or changed files.
                changedFiles = Object.keys(checkSums).filter(key => {
                    if (cache.hasOwnProperty(key)) {
                        return cache[key] !== checkSums[key];
                    }
                    return true;
                })
            }
            else {                
                // if the cache do not exist, all files are new.
                changedFiles = Object.keys(checkSums);
            }

            // write the changes to the cache.
            
            resolve({ files: changedFiles, checkSums});
        }).catch(e => reject)
    })
}

function saveChangedFiles (files) {
    var cache = {};
    if (fileExists(cachePath)) {
        cache = JSON.parse(fs.readFileSync(cachePath, "utf8"));
    }

    for (var key in files)
        cache[key] = files[key];

    fs.writeFileSync(cachePath, JSON.stringify(cache, null, "\t"), "utf8");
}

function purge () {
    fs.writeFileSync(cachePath, JSON.stringify({}, null, "\t"), "utf8");
}

module.exports = {
    getChangedFiles,
    saveChangedFiles,
    purge
}