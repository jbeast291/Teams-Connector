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
Use this if on windows (windows doesn't support multi-line by default):
```
docker run --detach --name developmentmariadb --restart=unless-stopped -v /path/on/host/machine:/var/lib/mysql:Z -p 3306:3306 --env MYSQL_TCP_PORT=3306 --env MARIADB_DATABASE=minecraft --env MARIADB_ROOT_PASSWORD=devpassword mariadb:11.3.1-rc-jammy
````

- ### MS teams workflows
This project works on Microsoft Teams' workflows to get around restrictions

Sadly Workflows cannot be copied out of teams easily so you will have to recreate it.


- ### Node project in visual studio

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
	"APISecret": "development1234",
	"HttpPort": "80",
	"CommandPrefix": "!",   
	"ResponseWebHookUrl": "https://prod-80.westus.logic.azure.com:443//....PASTE THE URL THAT LOOKS SIMILIAR TO THIS",
	"IDOfParentMessageForTeams2MC": "1724894219006",
	"IDOfChannelForTeams2Mc": "19:ed253bf276704055ac6d1fdb0156117d@thread.tacv2",
	"MCServerUrl" : "http://localhost:8000",

	"IDOfParentMessageForVerificationLogs": "1726721740209",
	"IDOfLogChannel": "19:db5f016346154d2789e73870668d9604@thread.tacv2",

	"DBhost": "127.0.0.1",
	"DBuser": "root",
	"DBpassword": "devpassword",
	"DBport": "3306",
	"DBdefaultdatabse": "minecraft"
}
```

```
npm start
````
