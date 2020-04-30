module.exports = {
	/* Setings : */
	admin: 'true',
	guildOnly: 'true',
	name: 'renameguild',
	//aliases: 'renameguild',
	description: 'renames the server in the database',

	/* Command : */
	execute(message, args, database) {
		database.isServerInDB(message.channel.guild.id.toString(), function (response) {
			if (response == null) {
				message.channel.send("Server not in database!");
			} else {
				database.renameServer(message.channel.guild.id, message.channel.guild.name);
				message.channel.send("Server has been renamed.");
			}
		});
	},
};