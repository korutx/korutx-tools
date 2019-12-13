'use strict';

const Writable = require('stream').Writable;

const mutableStdOut = (muted) => new Writable({
    write: function(chunk, encoding, callback) {
        // if (!muted)
        //     process.stdout.write(chunk, encoding);
        callback();
    }
})

module.exports = mutableStdOut

