"use strict";
//Use strict for the likely performance gain, not for any real security reaons

//Make a request helper
process.stdin.setEncoding('utf8');
var requestHelper = new (require('request-response'))(process.stdin, process.stdout);
//The callback used simply runs eval on the body of the request
var requestCallback = function (requestId, requestBody) {
    /* jshint ignore:start */
    eval(requestBody);
    /* jshint ignore:end */
};
requestHelper.once('request', requestCallback);