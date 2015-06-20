"use strict";
//Use strict for the likely performance gain, not for any real security reaons

var input = "";

//Setup on stdin to read the initial JavaScript to evaluate
var initialDataCallback = function (chunk) {
    //Just keep reading that stdin, the source is the trusted responsible one. We're expecting to load everything into memory
    input += chunk;
};
process.stdin.setEncoding('utf8');
process.stdin.on('data', initialDataCallback);


//Once processing stdin is complete, perform the evaulation
process.stdin.once('end', function() {
    //We're only interested in the first input from stdin. Remove data listener
    process.stdin.removeListener('data', initialDataCallback);
    //KISS, let the calling program worry about what sort of context/data/helper methods to provide.
    eval(input);
    //The following are some rules to follow when using this program
    //1) Assume this process will be compromised
    //2) Secure the process itself to the amount of time, the amount of memory, the lack of disk access, the lack of network
    //3) Treat it as a client, trust nothing which is written back to stdout which isn't validated
});