//I hear you like to run node in your node, so I'm testing node using node
var spawn = require('spawn-cmd').spawn,
    assert = require('assert'),
    fs = require('fs'),
    RequestHelper = require('request-response');

//Let this test be re-used with the docker image
var useDocker = process.argv[2] == "docker";


//***** Test 1 *****//

//Set up a simple test to see that piped in eval code writes the expected result
var evalStream = fs.createReadStream('./tests/eval.js');

var firstTestProcess;

if (!useDocker) {
    //Spawn straight with node
    firstTestProcess = spawn('node',['./src/index.js']);
} else {
    //Spawn with docker, and let the image start node
    firstTestProcess = spawn('docker',['run', '-i', 'chadautry/stdin-eval-stdout:automated']);
}

var firstTestProcessRequestHelper = new RequestHelper(firstTestProcess.stdout,firstTestProcess.stdin, false);
firstTestProcessRequestHelper.pipeRequest(evalStream);
  
//We expect this process to write out a specific phrase before it closes
var firstTestProcesWroteOut = false;
firstTestProcessRequestHelper.on('request', function (requestId, data) {
    assert.equal(data, 'This is only a test');
    firstTestProcesWroteOut = true;
    console.log("Received expected request from firstTestProcess");
    firstTestProcess.stdin.end();
});

//Never expect anything on stderr
firstTestProcess.stderr.setEncoding('utf8');
firstTestProcess.stderr.on('data', function (data) {
    console.log("stderr:"+data);
   // assert.fail(data, "nothing", "Did not expect any stderr", ":");
});

//We expect this process to close. In fact I think we need to wait for the process to close so we don't close ourself...
var firstTestProcesClosed = false;
firstTestProcess.on('close', function (code) {
    assert.equal(code, 0, "The first spawned process did not exit cleanly");
    firstTestProcesClosed = true;
});

//***** Test 2 *****//

//Second test, create a process and perform some read/write logic
var scriptUnderTestTwoStream = fs.createReadStream('./tests/scriptUnderTestTwo.js');
if (!useDocker) {
    //Spawn straight with node
    secondTestProcess = spawn('node',['./src/index.js']);
} else {
    //Spawn with docker, and let the image start node
    secondTestProcess = spawn('docker',['run', '-i', 'chadautry/stdin-eval-stdout:automated']);
}

var secondTestProcessRequestHelper = new RequestHelper(secondTestProcess.stdout,secondTestProcess.stdin, false);
secondTestProcessRequestHelper.pipeRequest(scriptUnderTestTwoStream);

var secondTestProcesWroteOut = false;
secondTestProcessRequestHelper.on('request', function (requestId, data) {
    //We expect the 'client' process to request a number twice
    if (data === 'Give me a number') {
        console.log("secondTestProcess requested a number");
        secondTestProcessRequestHelper.writeResponse(requestId, '21');
        return;
    }
    assert.equal(data, '42', "The first spawned process did not exit cleanly");
    secondTestProcesWroteOut = true;
    console.log("Received expected final request from secondTestProcess");
    secondTestProcess.stdin.end();
});

//Never expect anything on stderr
secondTestProcess.stderr.setEncoding('utf8');
secondTestProcess.stderr.on('data', function (data) {
    console.log(data);
    assert.fail(data, "nothing", "Did not expect any stderr", ":");
});

//We expect this process to close successfully
var secondTestProcessClosed = false;
secondTestProcess.on('close', function (code) {
  console.log("secondTestProcess has closed");
  assert.equal(code, 0, "The second spawned process did not exit cleanly");
  secondTestProcessClosed = true;
});

//Third test, let the process hang, and validate the parent needs a timer


//It is possible for things to hang if they didn't work
setTimeout(function(){process.exit()}, 5000).unref();

//Verify that all of the expected callbacks were called
process.on('exit', function(code) {
    assert.ok(firstTestProcesWroteOut, "The first test process wrote nothing");
    assert.ok(firstTestProcesClosed, "The first test process never closed itself");
    
    assert.ok(secondTestProcesWroteOut, "The first test process wrote nothing");
    assert.ok(secondTestProcessClosed, "The first test process never closed itself");
});