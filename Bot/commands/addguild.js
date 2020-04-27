/** ADDGUILD
 *  ========
 * 
 * This module provides the command `addguild` to the bot. The command adds the guild into the SQLite3
 *  Database if it did not already exist in the database. Otherwise it responds with the message "Guild
 *  already in database"
 * 
 * This command can only be used by an admin.
 */

module.exports = {
	/* Settings : */
	admin: 'true',
	guildOnly: 'true',
	name: 'addguild',
	//aliases: 'addserver',
	description: 'Adds this guild to the guild database',

	/* Command : */
	execute(message, args, database) {
		database.isServerInDB(message.channel.guild.id.toString(), function (response) {
			if (response == null) {
				database.addServerToDB(message.channel.guild.id.toString(), message.channel.guild.name);
				message.channel.send("ID : " + message.channel.guild + ", Name : " + message.channel.guild.name);
				message.channel.send("Added guild to database");
			} else {
				message.channel.send("Guild already in database");
            }
		});
	},
};


