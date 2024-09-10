module.exports = {
    getT2MCResponse: function getT2MCResponse(name, message) {
        return {
            "type": "message",
            "attachments": [
                {
                    "contentType": "application/vnd.microsoft.card.adaptive",
                    "content": {
                        "type": "AdaptiveCard",
                        "$schema": "https://adaptivecards.io/schemas/adaptive-card.json",
                        "version": "1.4",
                        "body": [
                            {
                                "type": "ColumnSet",
                                "columns": [
                                    {
                                        "type": "Column",
                                        "width": "auto",
                                        "items": [
                                            {
                                                "type": "Image",
                                                "url": "https://mc-heads.net/avatar/0cb77a34b17f48d5b521bdc4a00cd699/100/nohelm.png",
                                                "horizontalAlignment": "Left",
                                                "size": "Small",
                                                "style": "RoundedCorners",
                                                "height": "20px"
                                            }
                                        ],
                                        "spacing": "None"
                                    },
                                    {
                                        "type": "Column",
                                        "width": "stretch",
                                        "items": [
                                            {
                                                "type": "TextBlock",
                                                "text": `ECHO: (${name}): ${message}`,
                                                "wrap": true,
                                                "spacing": "None"
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                }
            ]
        }

    }
};