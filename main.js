//
// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license.
//
//ngrok http 80 --host-header="localhost:80"
//docker build -t jbeast291/teamslink:latest .

const database = require('./database/database');

const { APISecret, HttpPort, CommandPrefix, IDOfParentMessageForTeams2MC, IDOfChannelForTeams2Mc, MCServerUrl, ResponseWebHookUrl } = require('./config/config.json');
const http = require('http');
const CommandHandler = require('./CommandHandler.js');
const httpPost = require('./HTTPUtils/post.js');
const genericResponse = require('./FormatedCards/genericResponse.js');

const fs = require('fs');
const os = require('os');
const path = require('path');

//Setup Logging system
function attachFSLogger(filePath) {
    // remember the old log method
    const oldLog = console.log; // remove this line if you only want to log into the file


    // override console.log
    console.log = (...messages) => {

        // Ensure the directory exists 
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        // log the console message immediately as usual
        oldLog.apply(console, messages); // remove this line if you only want to log into the file

        var myDate = new Date(Math.floor(new Date().getTime()));
        const formattedDate = `[${myDate.toLocaleDateString()};${myDate.toLocaleTimeString()}]`;

        const messageString = messages.map(msg => typeof msg === 'object' ? JSON.stringify(msg, null, 2).replace(/(?<!\\)\\n/g, '\n') : msg).join(' ');

        // stream message to the file log
        fs.appendFile(filePath, `${formattedDate} ${messageString}\n`, (err) => {
            if (err) { 
                console.error('Error writing to file:', err); 
            }
        });
    }
}
attachFSLogger('./config/logs/log.txt');

console.log(`====New Session Started====`);

CommandHandler.initCommands();

const httpPort = process.env.port || process.env.PORT || HttpPort;
http.createServer(async function (request, response) {
    // Process the request
    console.log("(" + request.socket.remoteFamily + ";" + request.socket.remoteAddress + ") Recived: " + request.url);
    //ensure url request is using api
    if (getApiSecretFromUrl(request.url) !== APISecret) {
        response.writeHead(403);
        response.end();
        console.log("\tended request with invalid API Key!");
        return;
    }
    //respond that message was received and so teams doesn't fail the task
    response.writeHead(200, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({
        data: 'I aint payin for your premium workflows ;)',
    }));

    const msgcomps = parseUrlVars(request.url);
    const messageContents = msgcomps[0];
    const name = msgcomps[1];
    const replyId = msgcomps[2];
    const channelId = msgcomps[3];

    console.log("\tmessage: (" + messageContents + ") Name: (" + name + ")")

    //check if the message was sent from a regular user (ie: not workflow/bot)
    if (name === "") {
        console.log("ended request, msg from from webhook!")
        return;
    }

    //execute it if it is a command
    if (messageContents.charAt(0) === CommandPrefix) {
        console.log("\tcommand detected!");
        const command = messageContents.split("!")[1].split(" ")[0];

        if (await CommandHandler.checkIfCommandIsRegistered(command)) {
            console.log("\tcommand Valid!");

            if (await CommandHandler.checkIfUserHasPermission(command, name)) {
                console.log("\tExecuting Command!");
                await CommandHandler.executeCommand(command, channelId, replyId, messageContents, name);
            } else {
                //repond no perms
                httpPost.htppPost(genericResponse.getGenericResponse(channelId, replyId, name, "No Permission!!!"), ResponseWebHookUrl);
                console.log("\tno Permission!");
            }
        }
        return; //if it was a command we don't want to do any more checks on it
    }

    //check if this is meant for the mc server
    if (replyId === IDOfParentMessageForTeams2MC && channelId === IDOfChannelForTeams2Mc) {
        httpPost.htppPost(JSON.stringify({
            data: {
                type: "teams2mc",
                name: `${name}`,
                message: `${messageContents}`
            }
        }), MCServerUrl)
        console.log("\tSent message to mc server!")
    }

}).listen(httpPort, error => {
    if (error) {
        console.log(error);
        return process.exit(1);
    } else {
        console.log(`Listening on port: ${httpPort}`);
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