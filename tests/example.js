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
console.log('test');
//Setup a listener to handle requests from the child process
requestHelper.on('request', function (requestId, msgBody) {
   console.log(msgBody);
   evalProcess.stdin.end(); //closing stdin allows the child process to end (assuming it hasn't started any other callbacks outside of the request-response)
});

//Write the code (could also pipe it) to evalute into the process. In this case just making use of request helper to write a request straight back
requestHelper.writeRequest('requestHelper.writeRequest("Hello World!")');

//Rule #3! Always set a timeout, as the code being evaluated might never return
setTimeout(function(){process.exit();}, 5000).unref();