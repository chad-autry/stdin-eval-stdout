//I hear you like to run node in your node, so I'm testing node using node
var spawn = require('child_process').spawn,
    testProcess = spawn('node ./src/index.js < ./tests/eval.js'),
    assert = require('assert');
console.log("Modules required and process spawned");
  
testProcess.stdout.on('data', function (data) {
  assert.equal(data, 'This is only a test');
  console.log("Received expected output on stdout");
});

testProcess.stderr.on('data', function (data) {
  assert.fail(data, "nothing", "Did not expect any stderr", ":")
});

testProcess.on('close', function (code) {
  assert.equal(code, 0, "The spawned process did not exit cleanly");
  
});
