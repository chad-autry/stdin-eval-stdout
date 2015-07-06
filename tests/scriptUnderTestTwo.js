//Request a number from the 'server' process
requestHelper.writeRequest('Give me a number', function (responseBody) {
    var number = parseInt(responseBody);
    
    //Request a second number from the server
    requestHelper.writeRequest('Give me a number', function (responseBody) {
        number = number + parseInt(responseBody);
        
        //Write back the two numbers added together
        requestHelper.writeRequest(''+number);
    });
});
