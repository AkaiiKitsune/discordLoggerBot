module.exports = {
	/* Setings : */
	admin: 'true',
	guildOnly: 'true',
	name: 'addchannel',
	//aliases: 'addserver',
	description: 'Adds this channel to the guild database',

	/* Command : */
	execute(message, args, database) {
		database.isChannelInDB(message.channel.id.toString(), function (response) {
			if (response == null) {
				database.addChannelToDB(message.channel.id.toString(), message.channel.name, message.channel.guild.id.toString());
				message.channel.send("ID : " + message.channel + ", Name : " + message.channel.name);
				message.channel.send("Added channel to database");
			} else {
				message.channel.send("Channel already in database");
			}
		});
	},
};


