/** BEEP
 *  ====
 * 
 * This module provides a command to the bot. The command `beep` may be used by any user to check the
 * ping of the bot. When a user issues the command `>beep` or `>Beep!`, the bot should reply with `Boop.` 
 */

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
