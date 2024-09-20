const httpPost = require('../../HTTPUtils/post.js');
const genericResponse = require('../../FormatedCards/genericResponse.js');
const { ResponseWebHookUrl, IDOfParentMessageForVerificationLogs, IDOfLogChannel } = require('../../config/config.json');
const database = require('../../database/database.js');
const mojangApiConnector = require('../../mojangAPIConnector.js');


module.exports = {
	commandName: "link",
    fileName: __filename,
    execute: async function execute(channelId, replyId, messageContents, name) {
        const code = messageContents.split(" ")[1];
        //check if a code was sent with the command
        if(code === undefined) {
            httpPost.htppPost(genericResponse.getGenericResponse(channelId, replyId, name, "No code supplied! You need to sent the code after the !link, should be formatted as: \n\n/link code"), ResponseWebHookUrl);
            return;
        }

        //check if the inputed code is in the McCodes table
        minecraftLinkCodeCount = await database.queryDatabase("SELECT COUNT(*) FROM minecraftCodes WHERE LinkCode = ?;", code);
        if (minecraftLinkCodeCount[0]["COUNT(*)"] <= 0) {
            httpPost.htppPost(genericResponse.getGenericResponse(channelId, replyId, name, "Invalid Code! Ensure there are no spaces or any other characters. the command should be formatted as: \n\n!link code"), ResponseWebHookUrl);
            return;
        }

        //get the uuid from the users code they sent in
        mcUUID = await database.queryDatabase("SELECT MinecraftUUID FROM minecraftCodes WHERE LinkCode = ?;", code);

        //insert new user data into database and finish verification
        await database.queryDatabase("INSERT INTO verification(MinecraftUUID, TeamsName, LinkCode, LinkDate) VALUES(?, ?, ?, ?);", [mcUUID[0]["MinecraftUUID"], name, code, new Date().toISOString().slice(0, -5).replace('T', ' ')]);

        //delete cached code and uuid from minecraftCodes so they can be reused
        await database.queryDatabase("DELETE FROM minecraftCodes WHERE MinecraftUUID = ?;", [mcUUID[0]["MinecraftUUID"]]);

        //Success response
        httpPost.htppPost(genericResponse.getGenericResponse(channelId, replyId, name, "Your accounts are now linked and you are able to join the server!"), ResponseWebHookUrl);
            
        //Send to log channel
        httpPost.htppPost(genericResponse.getGenericResponse(IDOfLogChannel, IDOfParentMessageForVerificationLogs, "New Link!", `@${name} Linked with ${await mojangApiConnector.getPlayernameFromUUID(mcUUID[0]["MinecraftUUID"])}(${(mcUUID[0]["MinecraftUUID"])}`), ResponseWebHookUrl);
    }
};