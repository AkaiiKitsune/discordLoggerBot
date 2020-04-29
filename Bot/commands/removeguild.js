module.exports = {
    /* Setings : */
    admin: 'true',
    guildOnly: 'true',
    name: 'removeguild',
    //aliases: 'removeguild',
    description: 'Removes this guild from the database',

    /* Command : */
    execute(message, args, database) {
        database.isServerInDB(message.channel.guild.id.toString(), function (response) {
            if (response == null) {
                message.channel.send("Guild not in database!");
            } else {
                database.removeGuild(message.channel.guild.id);
                message.channel.send("Server has been removed.");
            }
        });
    },
};