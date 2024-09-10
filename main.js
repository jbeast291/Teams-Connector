//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
//ngrok http 80 --host-header="localhost:80"

//url example: https://2e01-2601-646-8f00-6c8e-cd9c-b774-a131-895e.ngrok-free.app/apisecret123456789101112?msgcontent=@{outputs('Get_message_details')?['body/body/content']}username=@{outputs('Get_message_details')?['body/from/user/displayName']}


const T2MCCard = require('./FormatedCards/t2mcResponse.js');

const CommandHandler = require('./CommandHandler.js');




CommandHandler.initCommands();
CommandHandler.executeCommand("test");

const http = require('http');
const httpPost = require('./HTTPUtils/post.js');
const httpPort = process.env.port || process.env.PORT || 80;
const apiSecret = "apisecret123456789101112";

http.createServer(async function (request, response) {
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
    
    //httpPost.htppPost(T2MCCard.getT2MCResponse(name, messageContents), "https://prod-80.westus.logic.azure.com:443/workflows/de117688d91e4ab8a0e9b6261cd1fd72/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bVBjUX7vJN4qCS5UB4Zdu7F4XPsZa2wby_9LsraU0Yw");

    httpPost.htppPost(JSON.stringify({data: { name: `${name}`, message: `${messageContents}`},}), "http://localhost:8000");


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


//BELOW SHOULD BE MOVED TO ITS OWN FILE

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