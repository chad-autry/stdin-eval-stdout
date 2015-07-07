### Status
[![Build Status](https://travis-ci.org/chad-autry/request-response.svg?branch=master)](https://travis-ci.org/chad-autry/stdin-eval-stdout)
[![Docker Hub](https://img.shields.io/badge/docker-ready-blue.svg)](https://registry.hub.docker.com/u/chadautry/stdin-eval-stdout/)

## Synopsis

A secure Javascript sandbox using Node.js and Docker. Uses [request-response](https://www.npmjs.com/package/request-response) to push the initial script for evaluation into the Docker process.
The request-response object remains available to facilitate two way communication between the parent and child.

## Usage

Here is an example of securely evaluating a script inside a child process which makes a request containing "Hello World!"

```
//spawn-cmd simply wraps child_process.spawn to work on windows
var spawn = require('spawn-cmd').spawn,
    RequestHelper = require('request-response');

/* -i for interactive
 * --net="none" to deny network
 * --read-only to deny disk writes
 * --memory="32m" to limit the memory. Make sure its enough since we have no swap (--read-only disallows swap space?)
 */
var evalProcess = spawn('docker',['run', '-i', '--net="none"', '--read-only', '--memory="32m"', 'chadautry/stdin-eval-stdout:automated']);

//Setup our request-response helper
var requestHelper = new RequestHelper(evalProcess.stdout,evalProcess.stdin);
evalProcess.stdin.setEncoding('utf8');
evalProcess.stdout.setEncoding('utf8');

//Setup a listener to handle requests from the child process
requestHelper.on('request', function (requestId, msgBody) {
   console.log(msgBody);
   evalProcess.stdin.end(); //closing stdin allows the child process to end (assuming it hasn't started any other callbacks outside of the request-response)
});

//Write the code (could also pipe it) to evalute into the process. In this case just making use of request helper to write a request straight back
requestHelper.writeRequest('requestHelper.writeRequest("Hello World!")');

//Rule #3! Always set a timeout, as the code being evaluated might never return
setTimeout(function(){process.exit()}, 5000).unref();
```

## Motivation

Securely evaluate user submitted Javascript. Secureity isn't accomplished just by using the image and still requires following some rules:
1. Assume the spawned process will be compromised
  1. It is meant to be thrown away, don't re-use
  2. Don't inject any data into the process the code under evaluation isn't privileged to see
2. Secure the process itself (using Docker) to the CPU share, the amount of memory, the lack of disk access, the lack of network
3. Run a time out from the parent process the limit real world time execution
4. Treat the child process as a client, trust nothing which is written back to parent which isn't validated

## Further Customizations

Currently any higher level API written on top of request-response has to be injected into the child process with the code under test. If there is a large static request-response using API, or any other library you wish the evaluated code had access to, simply add it to the dependencies and require it in index.js.