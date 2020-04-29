module.exports = {
    /* Setings : */
    admin: 'true',
    guildOnly: 'true',
    name: 'removeguild',
    //aliases: 'removeguild',
    description: 'Removes this guild from the database',

    /* Command : */
    execute(message, args, database) {
        database.isServerInDB(message.channel.id.toString(), function (response) {
            if (response == null) {
                database.removeGuild(message.channel.guild.id);
                message.channel.send("Server has been removed.");
            } else {
                message.channel.send("Guild not in database!");
            }
        });
    },
};