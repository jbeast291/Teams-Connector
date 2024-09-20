//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
//ngrok http 80 --host-header="localhost:80"

//url example: https://2e01-2601-646-8f00-6c8e-cd9c-b774-a131-895e.ngrok-free.app/apisecret123456789101112?msgcontent=@{outputs('Get_message_details')?['body/body/content']}username=@{outputs('Get_message_details')?['body/from/user/displayName']}
const database = require('./database/database');

const { APISecret, HttpPort, CommandPrefix, IDOfParentMessageForTeams2MC, IDOfChannelForTeams2Mc, MCServerUrl } = require('./config/config.json');
const http = require('http');
const CommandHandler = require('./CommandHandler.js');
const httppost = require('./HTTPUtils/post.js');

CommandHandler.initCommands();

const httpPort = process.env.port || process.env.PORT || HttpPort;
http.createServer(async function (request, response) {
    // Process the request
    console.log("Recived: " + request.url);
    //ensure url request is using api
    if(getApiSecretFromUrl(request.url) !== APISecret) {
        response.writeHead(403);
        response.end();
        console.log("ended request with invalid API Key!");
        return;
    }

    const msgcomps = parseUrlVars(request.url);
    const messageContents = msgcomps[0];
    const name = msgcomps[1];
    const replyId = msgcomps[2];
    const channelId = msgcomps[3];

    console.log("\tmessage: (" + messageContents + ") Name: (" + name + ")")

    //check if the message was sent from a regular user (ie: not workflow/bot)
    if(name === ""){
        console.log("ended request, msg from from webhook!")
        response.writeHead(200, { 'Content-Type': 'application/json' });
        response.end(JSON.stringify({
            data: 'I aint payin for your premium workflows ;)',
        }));
        return;
    }

    //check if this is meant for the mc server
    if(replyId === IDOfParentMessageForTeams2MC && channelId === IDOfChannelForTeams2Mc) {
        httppost.htppPost(JSON.stringify({
            data: {
                name: `${name}`,
                message: `${messageContents}`
            }
        }), MCServerUrl)
        console.log("\tSent message to mc server!")
        return;
    }

    //execute it if it is a command
    if(messageContents.charAt(0) === CommandPrefix){
        console.log("\tcommand detected!");
        const command = messageContents.split("!")[1].split(" ")[0]
        if( await CommandHandler.checkIfCommandIsRegistered(command)){
            console.log("\tcommand Valid!");
            await CommandHandler.executeCommand(command, channelId, replyId, messageContents, name);
        }
    }
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

    const urlArray = url.slice(url.indexOf('?') + 1);
    console.log(urlArray)

    const MsgContent = urlArray.split("msgcontent=")[1].split("&username=")[0];
    const MsgSender = urlArray.split("&username=")[1].split("&replyid=")[0];
    const ReplyID = urlArray.split("&replyid=")[1].split("&channelid=")[0];
    const ChannelId = urlArray.split("&channelid=")[1];

    return [MsgContent, MsgSender, ReplyID, ChannelId];
}