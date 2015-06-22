//I hear you like to run node in your node, so I'm testing node using node
var spawn = require('spawn-cmd').spawn,
    testProcess = spawn('node ./src/index.js < ./tests/eval.js'),
    assert = require('assert');

testProcess.stdout.on('data', function (data) {
  assert.equal(data, 'This is only a test');
});

testProcess.stderr.on('data', function (data) {
  assert.fail(data, "nothing", "Did not expect any stderr", ":")
});

testProcess.on('close', function (code) {
  assert.equal(code, 0);
});
console.log("Huzzah! The simple single test passes");