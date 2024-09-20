# Teams Connector
 Connect teams to Minecraft and other (explanation needs to be expanded)

## Running Locally (designed to be beginner friendly):

### Prerequisites:
Install everything here to follow this guide
- [Docker](https://www.docker.com/)
  - This will be used for hosting your database and if you desire a built image of the server
  - You do not necessarily need it, but if you want to host the database another way, this guide will only show Docker
- [Visual Studio Code](https://code.visualstudio.com/)
  - This will be used to edit your javascript
  - Can be substituted for whatever text editor you like, but this guide will only show Visual Studio Code.
- [Node v20.17.0](https://nodejs.org/en/download/prebuilt-installer)
  - This repo was made with v20.17.0 so ensure to use the same version to not run into conflicts
  - This is required and can not be substituted
- Ngrok, with [Account](https://ngrok.com/) and [Locally Installed](https://dashboard.ngrok.com/get-started/setup/windows)
  - This is needed as Teams will send data to the server through a URL, the simplest way is to use Ngrok, but if you have another method to point teams to your server that will work
  - Ensure your auth token is added
- Minecraft Server Connector

## Development Setup/self host:
- ### Docker container for the database

This is an example run command for a basic development Database.
Create a folder where you want to store the database, replace the path to that folder in the command with /path/on/host/machine. should look something like: _C:\Users\jbeast\OneDrive\Desktop\developmentdb:/var/lib/mysql:Z_

```
docker run \
    --detach \
    --name developmentmariadb \
    --restart=unless-stopped \
    -v /path/on/host/machine:/var/lib/mysql:Z \
    -p 3306:3306 \
    --env MYSQL_TCP_PORT=3306 \
    --env MARIADB_DATABASE=minecraft \
    --env MARIADB_ROOT_PASSWORD=devpassword mariadb:11.3.1-rc-jammy
````
Use this if on Windows (windows doesn't support multi-line by default):
```
docker run --detach --name developmentmariadb --restart=unless-stopped -v /path/on/host/machine:/var/lib/mysql:Z -p 3306:3306 --env MYSQL_TCP_PORT=3306 --env MARIADB_DATABASE=minecraft --env MARIADB_ROOT_PASSWORD=devpassword mariadb:11.3.1-rc-jammy
````



- ### MS Teams workflows
This project works on Microsoft Teams' workflows to get around restrictions

Sadly Workflows cannot be copied out of teams easily so you will have to recreate it. Create a new flow and copy the same setup as below

When creating a webhook, remember that the team boxes relate to what team you want the bot to run in. AND only the channels setup in the Outgoing Workflows will be watching for messages

**Outgoing Workflow**

![Outgoing Workflow](https://github.com/jbeast291/Teams-Connector/blob/main/images/DEVout.png?raw=true)

This is the URL in the last part, ensure it is exactly the same
```
https://af98-2601-646-8f00-6c8e-14c8-79a0-cc25-29d0.ngrok-free.app/development1234?msgcontent=@{outputs('Get_message_details')?['body/body/plainTextContent']}&username=@{outputs('Get_message_details')?['body/from/user/displayName']}&replyid=@{outputs('Get_message_details')?['body/replyToId']}&channelid=@{outputs('Get_message_details')?['body/channelId']}
```
Do also note that "development1234" is the API token in the config, so they must match up in both places to ensure it isn't some random person pinging the server 

**Incoming Workflow**

![Incoming Workflow](https://github.com/jbeast291/Teams-Connector/blob/main/images/DEVin.png?raw=true)

When recreating this workflow you will notice that some of the options do not show up. This project uses some custom statements so copy and paste below into the boxes that are missing the autocomplete

Set Variable, Value:
```
@{items('Apply_to_each')?['channelID']}
```
Reply with an adaptive card in a channel, Message ID
```
@{items('Send_each_adaptive_card')?['messageID']}
```
Reply with an adaptive card in a channel, Adaptive Card
```
@{items('Send_each_adaptive_card')?['content']}
```

Also, save the HTTP POST URL at the top of the flow in "When a Teams Webook request is received" as it will be needed for later


- ### Node project in Visual Studio

Download the repo with the method of your choice to a folder (green button at the top for example). And unzip the repo into a folder where you want to store the server files.

Open Visual Studio code and open the folder with the project files (main.js, package.json, Dockerfile, etc...)

Create a new terminal (top bar of VS code) and init the node project
```
npm install
````
Once that is finished the config file needs to be set up.
in the .\Config folder of the project, create a file called config.json and add paste the following in below
```
{
	"HttpPort": "80",

	"APISecret": "development1234",
	"CommandPrefix": "!",

	"ResponseWebHookUrl": "https://prod-80.westus.logic.azure.com:443//....PASTE THE URL THAT LOOKS SIMILIAR TO THIS",
	"MCServerUrl" : "http://localhost:8000",

	"IDOfParentMessageForTeams2MC": "1724894219006",
	"IDOfChannelForTeams2Mc": "19:ed253bf276704055ac6d1fdb0156117d@thread.tacv2",

	"IDOfParentMessageForVerificationLogs": "1726721740209",
	"IDOfLogChannel": "19:db5f016346154d2789e73870668d9604@thread.tacv2",

	"DBhost": "127.0.0.1",
	"DBuser": "root",
	"DBpassword": "devpassword",
	"DBport": "3306",
	"DBdefaultdatabse": "minecraft"
}
```
The easiest way to get IDs of channels is to copy the link teams.microsoft.com/l/channel/`19%3Aed253bf276704055ac6d1fdb0156117d%40thread.tacv2`/channel_name... 

- note that it is formated as a [URL](https://www.w3schools.com/tags/ref_urlencode.asp?_sm_au_=iVVDMg0TSmrMV6Dm) so replace the %3 at the beginning with a : and the %40 near the end with a @ symbol. You will end up with something like `19:Aed253bf276704055ac6d1fdb0156117d@thread.tacv2`

Similarly, if you copy the link to a message you will get teams.microsoft.com/l/message/19:db5f016346154d2789e73870668d9604@thread.tacv2/`1726721740209`?tenantId=b0e...

- simply copy the highlighted numbers and that is the message id

Once you have filled in the config vars for the channels and messages you wish, the other config values should work in their default if you follow this guide. 

 - ### Ngrok Connection
NOTE, every time you stop and restart Ngrok the link in teams will need to be changed to point to your server

If you have Ngrok all setup with your account and auth token, open a new terminal in VS code or just a cmd window and run the command below. 
```
ngrok http 80 --host-header="localhost:80"
```
Leave this terminal open to keep the tunnel alive. In the Team's "Outgoing workflow" from earlier, change the drop box url to point to your server. Should look something like this but with your URL from Ngrok:
```
https://af98-2601-646-8f00-6c8e-14c8-79a0-cc25-29d0.ngrok-free.app/development1234?msgcontent=@{outputs('Get_message_details')?['body/body/plainTextContent']}&username=@{outputs('Get_message_details')?['body/from/user/displayName']}&replyid=@{outputs('Get_message_details')?['body/replyToId']}&channelid=@{outputs('Get_message_details')?['body/channelId']}
```
This will have to be redone every time ngrok gives you a new URL.

- ### Starting Server
If you have done everything above and Ngrok is pointing to your machine, run this:
```
npm start
````
This will startup the server and you should be good to go!
