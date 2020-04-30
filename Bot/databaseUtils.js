const sqlite3 = require('sqlite3'); // Database stuff
const { databaseName } = require('./config.json'); // Loads the settings
let db;

module.exports = {
    // Init the database
    initDatabase: function (exists) {
        db = new sqlite3.Database(databaseName + '.db', (err) => {
            if (err) {
                return console.error(err.message);
            }

            console.log('Connected to the in-memory SQlite database.');

            if (exists === false) {
                db.run('CREATE TABLE servers(server_id text PRIMARY KEY, name text NOT NULL)', (err) => {
                    if (err) return console.log("servers : " + err)
                });
                db.run('CREATE TABLE channels(channel_id text PRIMARY KEY, name text NOT NULL, server_id text NOT NULL)', (err) => {
                    if (err) return console.log("channels : " + err)
                });
                db.run('CREATE TABLE messages(message_id text PRIMARY KEY, server_id text NOT NULL, channel_id text NOT NULL, message text NOT NULL, author text NOT NULL, time text NOT NULL)', (err) => {
                    if (err) return console.log("messages : " + err)
                });
            }
        });
    },

    // Adding a server to the database
    addServerToDB: function (serverId, serverName) {
        console.log("Adding server " + serverId + " (" + serverName + ") to the database.");
        db.run(`INSERT INTO servers(server_id, name) VALUES(?, ?)`, [serverId, serverName], (err) => {
            if (err) {
                console.error("addServerToDB : " + err.message);
            }
        });
    },

    // -- Database inserts -- //

    // Adding a channel to the database
    addChannelToDB: function (channelID, channelName, serverId) {
        console.log("Adding channel " + channelID + " (" + channelName + ") to the database.");

        db.run(`INSERT INTO channels(channel_id, name, server_id) VALUES(?, ?, ?)`, [channelID, channelName, serverId], (err) => {
            if (err) {
                console.error("addChannelToDB : " + err.message);
            }
        });
    },

    // Adding a message to the database
    addMessageToDB: function (messageId, channelID, serverId, message, author_id, author, time) {
    console.log("Adding Message " + messageId + " (" + '[' + time + ']' + author + ':' + message + ") to the database.");

    db.run(`INSERT INTO messages(message_id, server_id, channel_id, message, author_id, author, time) VALUES(?, ?, ?, ?, ?, ?, ?)`, [messageId, serverId, channelID, message, author_id, author, time], (err) => {
      if (err) {
        console.error("addMessageToDB : " + err.message);
      }
    });
  },

    // -- Database query -- //

    // Querying if there is a server with the given ID in the database
    isServerInDB: function (serverID, callback) {
        console.log("Checking if server " + serverID + " is in the database...");

        db.get(`SELECT server_id FROM servers WHERE server_id = ?`, [serverID], (err, result) => {
            if (err) return console.log(err)
            if (result != null) {
                return callback(result.server_id);
            } return callback(null);
        })
    },

    // Querying if there is a channel with the given ID in the database
    isChannelInDB: function (channelID, callback) {
        console.log("Checking if channel " + channelID + " is in the database...");
        db.get(`SELECT channel_id FROM channels WHERE channel_id = ?`, [channelID], (err, result) => {
            if (err) return console.log(err)
            if (result != null) {
                return callback(result.channel_id);
            } return callback(null);
        })
    },

    // -- Database removals -- //

    removeGuild: function (serverID) {
        console.log("Removing guild: " + serverID + " from database");
        db.run("DELETE FROM servers where server_id=(?)", [serverID], function (err) {
            if (err) {
                return console.error(err);
            }
            db.run("DELETE FROM channels WHERE server_id=(?)", [serverID], function (err) {
                if (err) {
                    return console.error(err);
                }
                db.run("DELETE FROM messages WHERE server_id=(?)", [serverID], function (err) {
                    if (err) {
                        return console.error(err);
                    }
                });
            });
            console.log("Guild removed");
        })
    },

    removeChannel: function (channelID) {
        console.log("Removing guild: " + channelID + " from database");
        db.run("DELETE FROM channels WHERE channel_id=(?)", [channelID], function (err) {
            if (err) {
                return console.error(err);
            }
            db.run("DELETE FROM messages WHERE channel_id=(?)", [channelID], function (err) {
                if (err) {
                    return console.error(err);
                }
            });
        });
    },

    // -- Database edit -- //


    renameServer: function (guildID, newGUildName) {
        console.log("Updating server: " + guildID + " name to: " + newGUildName);
        db.run("UPDATE servers set name=? where server_id=?", [newGUildName, guildID], function (err) {
            if (err) {
                return console.error(err);
            }
        });
    },


    renameChannel: function (channelID, newChannelName) {
        console.log("Updating channel: " + channelID + " name to: " + newChannelName);
        db.run("UPDATE channels set name=? where channel_id=?", [newChannelName, channelID], function (err) {
            if (err) {
                return console.error(err);
            }
        });
    },

    // -- Database exit -- //

    // End the connection to the database
    closeDatabase: function () {
        db.close((err) => {
            if (err) {
                return console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }
}
