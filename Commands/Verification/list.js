const httpPost = require('../../HTTPUtils/post.js');
const { MCServerUrl } = require('../../config/config.json');

module.exports = {
	commandName: "list",
    requireAdmin: true,
    fileName: __filename,
    execute: async function execute(channelId, replyId, messageContents, name) {
        httpPost.htppPost(JSON.stringify({
            data: {
                type: "command-list",
                replyID: `${replyId}`,
                channelID: `${channelId}`,
                name: `${name}`
            }
        }), MCServerUrl);
    }
};