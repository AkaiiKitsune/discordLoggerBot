module.exports = {
	/* Setings : */
	admin: 'false',
	guildOnly: 'false',
	name: 'beep',
	//aliases: '',
	description: 'Beep!',

	/* Command : */
	execute(message) {
		message.channel.send('Boop.');
	},
};
