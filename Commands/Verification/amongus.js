const path = require('path');
module.exports = {
	commandName: "t",
    fileName: module.filename.slice(__filename.lastIndexOf(path.sep)+1, module.filename.length),

        //for intellisense the var type must be defined
        /**
        * 
        * @param {Client} client - The Discord client instance
        * @param {CommandInteraction} interaction - The interaction object
        * 
        */ 

    execute: async function execute() {

    }
};