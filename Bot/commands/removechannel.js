module.exports = {
	/* Setings : */
	admin: 'true',
	guildOnly: 'true',
	name: 'removechannel',
	//aliases: 'removechannel',
	description: 'Removes this channel from the database',

	/* Command : */
	execute(message, args, database) {
		database.isChannelInDB(message.channel.id.toString(), function (response) {
			if (response == null) {
				message.channel.send("Channel not in database!");
			} else {
				database.removeChannel(message.channel.id);
				message.channel.send("Channel has been removed.");
			}
		});
	},
};