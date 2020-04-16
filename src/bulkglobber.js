const glob = require("glob").Glob

function doGlob(path) {
    return new Promise((resolve, reject) => {
        glob(path, function (err, files) {
            if (err) reject(files);
            resolve(files)
        })
    })
}

function bulkGlob(path, flatten = true) {

    let promises = [];
    if (Array.isArray(path)) {
        promises = path.map(path => doGlob(path));
    } else {
        promises.push(doGlob(path))
    }

    return new Promise(resolve => {
        Promise.all(promises)
        .then(files => {
            
            // flatten the result ?
            let result = flatten 
                ? files.reduce((bucket, current) => bucket.concat(current), []) 
                : files;

            resolve(result);
        })
    })
}


module.exports = bulkGlob;