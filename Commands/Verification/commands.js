const httpPost = require('../../HTTPUtils/post.js');
const helpResponse = require('../../FormatedCards/helpResponse.js');
const { ResponseWebHookUrl } = require('../../config/config.json');

module.exports = {
	commandName: "commands",
    requireAdmin: false,
    fileName: __filename,
    execute: async function execute(channelId, replyId, messageContents, name) {
        httpPost.htppPost(helpResponse.getHelpResponse(channelId, replyId, name), ResponseWebHookUrl);
    }
};