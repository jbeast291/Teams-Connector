const httpPost = require('../../HTTPUtils/post.js');
const genericResponse = require('../../FormatedCards/genericResponse.js');
const { ResponseWebHookUrl, IDOfParentMessageForVerificationLogs, IDOfLogChannel  } = require('../../config/config.json');
const database = require('../../database/database.js');


module.exports = {
	commandName: "unlink",
    requireAdmin: false,
    fileName: __filename,
    execute: async function execute(channelId, replyId, messageContents, name) {
        //check if user is in the database
        TeamsNameCount = await database.queryDatabase("SELECT COUNT(*) FROM verification WHERE TeamsName = ?;", [name])
        if (TeamsNameCount[0]["COUNT(*)"] <= 0) {
            httpPost.htppPost(genericResponse.getGenericResponse(channelId, replyId, name, "Your accounts are not even linked! You must be verified with !link before this command is useable."), ResponseWebHookUrl);
            return;
        }

        //delete row from database
        await database.queryDatabase("DELETE FROM verification WHERE TeamsName = ?;", [name])
        httpPost.htppPost(genericResponse.getGenericResponse(channelId, replyId, name, "Accounts Unlinked! To relink your accounts simply run !link again."), ResponseWebHookUrl);

        //log unlink
        httpPost.htppPost(genericResponse.getGenericResponse(IDOfLogChannel, IDOfParentMessageForVerificationLogs, "New Unlink!", `Unlinked: @${name}`), ResponseWebHookUrl);
    }
};