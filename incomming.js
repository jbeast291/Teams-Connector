//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
//ngrok http 8000 --host-header="localhost:8000"

//url example: https://2e01-2601-646-8f00-6c8e-cd9c-b774-a131-895e.ngrok-free.app/apisecret123456789101112?msgcontent=@{outputs('Get_message_details')?['body/body/content']}username=@{outputs('Get_message_details')?['body/from/user/displayName']}

const http = require('http');
const messageSender = require('./messageSender.js');

const httpPort = process.env.port || process.env.PORT || 8000;
const apiSecret = "apisecret123456789101112";

http.createServer(function (request, response) {
    // Process the request
    console.log("Recived: " + request.url);
    //ensure url request is using api
    if(getApiSecretFromUrl(request.url) !== apiSecret) {
        response.writeHead(403);
        response.end();
        console.log("ended request with invalid API Key!");
        return;
    }

    const msgcomps = parseUrlVars(request.url);
    const name = msgcomps[1];
    const messageContents = msgcomps[0];
    console.log("message: (" + messageContents + ") Name: (" + name + ")")

    //check if the message was sent from a regular user (ie: not workflow/bot)
    if(name === ""){
        console.log("ended request, msg from from webhook!")
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
            data: 'I aint payin for your premium workflows ;)',
        }));
        return;
    }
    
    messageSender.sendTeamsMessage(name, messageContents);

    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
        data: 'I aint payin for your premium workflows ;)',
    }));

}).listen(httpPort, error => {
    if (error) {
        console.log(error);
        return process.exit(1);
    } else {
        console.log('Listening on port: %s', httpPort);
    }
});


/**
* @param {String} url
* returns the api secret from the url
*/ 
function getApiSecretFromUrl(url) {
    const urlArray = url.split("?");
    return urlArray[0].split("/")[1];
}

/**
* @param {String} url
* returns array with: MsgContent, Username all formated to be human readable
*/
function parseUrlVars(url) {
    url = decodeURIComponent(url);
    const urlArray = url.split("?");

    const MsgContent = urlArray[1].split("msgcontent=")[1].split("&username=")[0];
    const MsgSender = urlArray[1].split("&username=")[1];

    return [MsgContent, MsgSender];
}