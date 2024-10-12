const path = require('path');
const fs = require('fs');
const { AdminNames } = require('./config/config.json');

const commands = [];

module.exports = {
    initCommands: async function initCommands() {
        // Grab all the command folders from the commands directory
        const foldersPath = path.join(__dirname, 'Commands');
        const commandFolders = fs.readdirSync(foldersPath);

        for (const folder of commandFolders) {
            // Grab all the command files from the commands directory
            const commandsPath = path.join(foldersPath, folder);
            const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                const filePath = path.join(commandsPath, file);
                const command = require(filePath);
                if ('commandName' in command) {
                    commands.push([command.commandName, command.fileName, command.requireAdmin]);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
    },
    
    executeCommand: async function executeCommand(commandNameToExec, channelId, replyId, messageContents, name) {
        for(let command of commands){
            if (command[0] === commandNameToExec.toLowerCase()) {
                exec = require(command[1]);
                exec.execute(channelId, replyId, messageContents, name);
            }
        }
    },

    checkIfCommandIsRegistered: async function checkIfCommandIsRegistered(commandNameToCheck) {
        //check if command exists in cache
        for(let command of commands){
            if (command[0] === commandNameToCheck.toLowerCase()) {
                return true;
            }
        }
        return false;
    },

    checkIfUserHasPermission: async function checkIfUserHasPermission(commandNameToCheck, name) {
        //check if command exists in cache
        for(let command of commands){
            if (command[0] === commandNameToCheck.toLowerCase()) {
                if(command[2] === true) {//check if admin is required
                    if(AdminNames.includes(name)){
                        return true;
                    }
                    return false;
                }
                return true;
            }
        }
        return false;
    },
    
};

//get and register all commands
