//Requirements
//SETTINGS
const { prefix, activity, version, processBots, databaseName } = require('./config.json'); // Loads the settings
const { idToken } = require('./secrets.json'); // Loads the token

//DISCORD
const Discord = require('discord.js'); // Discord api
const client = new Discord.Client(); // Init discord client
client.commands = new Discord.Collection();

//Console and logging
const fs = require('fs');
const { Console } = require('console');
const output = fs.createWriteStream('./logs/stdout.log');
const errorOutput = fs.createWriteStream('./logs/stderr.log');
const logger = new Console(output, errorOutput);

//Database
const database = require('./databaseUtils');
if (!fs.existsSync('./' + databaseName + '.db')) {
    database.initDatabase(false)
    log("misc", "Database Initialized.");
}
else {
    database.initDatabase(true);
    log("info", "Database Loaded.");
}

//COMMANDS
var commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

client.on("ready", () => { // Handle the activity of the bot on login time
    client.user.setActivity(activity + " " + version);
    console.log("Server started : " + client.user.username + "#" + client.user.discriminator + " (@" + client.user.id + ")."); //cursed formatting

    client.guilds.cache.forEach(guild => {
        database.isServerInDB(guild.id.toString(), function (response) {
            if (response == null) {
                database.addServerToDB(guild.id.toString(), guild.name);
            }
        });
    });

    console.log(client.commands);
});

client.on('message', message => { execute(message); });

async function execute(message) {
    if (message.content.startsWith(prefix)) { //Command handling
        command(message);
    } else { //Logging !
        logMsg(message);
    }
}

client.on('messageUpdate', (oldMessage, newMessage) => {
    oldMsg = oldMessage.content.toString().replace(/\|/g, '\\|');
    newMsg = newMessage.content.toString().replace(/\|/g, '\\|');

    database.appendMessageEdit(oldMessage.id.toString(), oldMsg, newMsg);
})

async function command(message) {
    if (message.content.length <= 1) return;

    try {
        if (message.author.bot) return;

        const args = message.content.slice(prefix.length).split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName);/* || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));*/

        log("info", (message.author.tag + ' issued a command'));
        if (!command) { log("error", message.author.tag + ' issued a wrong command : ' + commandName); return; }

        log("misc", 'Full string :  ' + message.content + '\n	Running command : ' + commandName + '\n	Args :  ' + args + '\n	Command Settings :  ' + "Admin : " + command.admin + ", Guildonly : " + command.guildOnly + ", Aliases : " + command.aliases);
        if (command.guildOnly == "true" && message.channel.type !== 'text') { return message.reply('You can\'t do that in your DM\'s !'); }
        if (command.guildOnly == "true" && command.admin == "true") { if (!message.channel.permissionsFor(message.member).has("ADMINISTRATOR")) { return message.reply('You\'re not admin !.'); } }

        command.execute(message, args, database);
    } catch (error) {
        log("error", 'CRITICAL : ' + error);
    }
}

async function logMsg(message) {
	/**
	 * Given a message object as argument, run an SQL query on the SQLite3 database
	 * to add the message into a new row of the `messages` table.
	 */
	database.isServerInDB(message.channel.guild.id.toString(), function (result) {
		if(result == null)
			return;
		database.isChannelInDB(message.channel.id.toString(), function (result) {
			if(result == null)
				return;
			database.addMessageToDB(  // Calling method from the databaseUtils.js module
				message.id.toString(), 
				message.channel.id.toString(), 
				message.channel.guild.id.toString(), 
				message.content.toString(), 
				message.author.id.toString(),
				message.author.tag,
				message.createdAt.toString() );
		});
	});
}

async function log(value, str) { //Logging stuff + console output
    if (value == "info") {
        console.log(" [INFO] : " + str);
        logger.log("[INFO] : " + str);
    } else if (value == "error") {
        console.error('\x1b[31m', "[ERROR] : " + str, '\x1b[0m');
        logger.error("[ERROR] : " + str);
    } else if (value == "debug" && debug == 1) {
        console.warn('\x1b[32m', "[DEBUG] : " + str, '\x1b[0m');
        logger.warn("[DEBUG] : " + str);
    } else if (value == "misc") {
        console.log("\x1b[33m", "[MISC] : " + str, "\x1b[0m");
        logger.log("[MISC] : " + str);
    }
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

client.login(idToken); //Logging in
