module.exports = {
	/* Setings : */
	admin: 'true',
	guildOnly: 'true',
	name: 'renamechannel',
	//aliases: 'renamechannel',
	description: 'renames the channel in the database',

	/* Command : */
	execute(message, args, database) {
		database.isChannelInDB(message.channel.id.toString(), function (response) {
			if (response == null) {
				message.channel.send("Channel not in database!");
			} else {
				database.renameChannel(message.channel.id, message.channel.name);
				message.channel.send("Channel has been renamed.");
			}
		});
	},
};