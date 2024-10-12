module.exports = {
    getHelpResponse: function getHelpResponse(channelId, parentMessageId, recipientName) {
        return {
            "type": "message",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.adaptive",
                    "messageID": `${parentMessageId}`,
                    "channelID": `${channelId}`,
                    "content": {
                        "type": "AdaptiveCard",
                        "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
                        "version": "1.4",
                        "body": [
                            {
                                "type": "TextBlock",
                                "horizontalAlignment": "Left",
                                "spacing": "None",
                                "text": `⬆️@${recipientName}`,
                                "size": "Medium"
                            },
                            {
                                "type": "TextBlock",
                                "horizontalAlignment": "Left",
                                "separator": true,
                                "text": "Available Commands:\n",
                                "wrap": true,
                                "size": "Large"
                            },
                            {
                                "type": "TextBlock",
                                "text": "- !commands\n- !list - list of online players!\n- !link\n- !unlink\n",
                                "wrap": true,
                                "spacing": "None"
                            }
                        ]
                    }
                }
            ]
        }

    }
};