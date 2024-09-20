class MojangApiConnector {
    async getUUIDFromPlayername(playername) {
        return fetch(`https://api.mojang.com/users/profiles/minecraft/${playername}`)
            .then(data => data.json())
            .then(player => player.id.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5'));//adds the dashes back to the uuid that the mojang api ommits
    }

    async getPlayernameFromUUID(uuid) {
        return fetch(`https://api.mojang.com/user/profile/${uuid}`)
            .then(data => data.json())
            .then(player => player.name);
    }
}

const mojangApiConnector = new MojangApiConnector();

module.exports = mojangApiConnector;

/*mojangApiConnector.getUUIDFromPlayername("Jbeast291").then(id => {
	console.log(`ID is ${id}`)
})
mojangApiConnector.getPlayernameFromUUID("0cb77a34b17f48d5b521bdc4a00cd699").then(name => {
	console.log(`name is ${name}`)
})

const id = await getId(args[2])
console.log(`ID is ${id}`)*/