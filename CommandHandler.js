const path = require('path');
const fs = require('fs');

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
                    commands.push([command.commandName, command.fileName]);
                } else {
                    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
            }
        }
        console.log(commands);
    },
    executeCommand: async function executeCommand(commandNameToExec) {
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
                if (command.commandName === commandNameToExec) {
                    command.execute();
                }
            }
        }
    }
};

//get and register all commands
