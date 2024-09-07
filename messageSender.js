const axios = require('axios');

module.exports = {
    sendTeamsMessage: function sendTeamsMessage(name, message) {
        var formatted_Card_Payload = {
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

        const webhookUrl = "https://prod-80.westus.logic.azure.com:443/workflows/de117688d91e4ab8a0e9b6261cd1fd72/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=bVBjUX7vJN4qCS5UB4Zdu7F4XPsZa2wby_9LsraU0Yw";

        axios.post(webhookUrl , formatted_Card_Payload )
        .then(res => {
            //console.log(`statusCode: ${res.status}`)
            //console.log(res)
        })
        .catch(error => {
            console.error(error)
        })
    }
};
//https://teams.microsoft.com/l/message/19:ed253bf276704055ac6d1fdb0156117d@thread.tacv2/1724894648808?tenantId=b0e91a46-079b-4108-bd1a-e246d5d2f971&groupId=afa79ada-1b72-4aaa-a418-e19eac3d1f2e&parentMessageId=1724894648808&teamName=bot%20testing&channelName=discord-to-minecraft-test&createdTime=1724894648808