const sqlite = require('sqlite3');

const dbpath = "Bot/database.db";

module.exports = {
    getQuery: async function (get_token) {
        /**
         * Reads a token from the argument, and if that token
         * is present within the Database, returns the corresponding server's `server_id`.
         * If not, it returns `"not-in-db"`. If there is an error accessing the database, 
         * returns the string `"db-error"`;
         */
        let db   = new sqlite.Database(dbpath);
        let data = await db.all(`SELECT server_id FROM tokens WHERE token = ${get_token};`, function (error) {
            console.error("Error in method getParser.");
            console.error(error);
        });
        if(data = null) {
            console.error("Database returned null object.");
            return "db-error";
        }
        if(Array.isArray(data) && data.length == 0) {
            console.log("The token is not in the array.")
            return "not-in-db";
        }
        console.log(`GET request parsed and returned ${data} from the database.`);
        return data[0].server_id;
    },

    getChannels: async function (server_id) {
        /**
         * Reads a `server_id` as argument. 
         *   * If the string is `"db-error"`, returns `"db-error"`.
         *   * If the string is `"not-in-db"`, returns `"invalid-token"`.
         * Otherwise, searches for rows with that `server_id` in the `channels` table of the 
         * database. Returns a list of `channel_id` for channels from that server. 
         * **NOTE:** This list is empty if there are no logged channels in that server.
         */
        if(server_id == "db-error") {
            return "db-error";
        }
        if(server_id == "not-in-db") {
            return "invalid-token";
        }

        let db = new sqlite.Database(dbpath);
        let channels = await db.all(`SELECT channel_id FROM channels WHERE server_id = ${server_id}`, function (error) {
            return "db-error";
        });
        let channel_list = [];
        for(let i = 0; i < channels.length; i++)
            channel_list.push(channels[i].channel_id);
        return channel_list;
    },

    msgQuery: async function (channel_id) {
        /**
         * Reads `channel_id` as argument, and queries the database for all messages with that `channel_id`.
         * Generates a Javascript code in a string which will write these messages into a node named `chat`.
         * Returns this string.
         */
        let db = new sqlite.Database(dbpath);
        let messages = await db.all(`SELECT * FROM messages WHERE channel_id = ${channel_id};`);
        
        let dataLoader = "function loadData() {\n";
        let dataLoader = "let chat = document.getElementById(\"chat\");\n";
        for(let i = 0; i < messages.length; i++) {
            dataLoader += `\tchat.innerHTML += '<username>${messages[i].author.split("#")[0]}</username>';\n`;
            dataLoader += `\tchat.innerHTML += '<timestamp>${messages[i].time}</timestamp>';\n`;
            dataLoader += `\tchat.innerHTML += '<p>${messages[i].message}</p>';\n`;
            dataLoader += '\n}';
        }

        console.log(`Finished writing the dataloader.js for server ${server_id}`);
        return dataLoader;
    }
};