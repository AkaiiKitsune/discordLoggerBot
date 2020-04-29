module.exports = {
    /* Setings : */
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