const sqlite3 = require('sqlite3'); // Database stuff 
const { databaseName } = require('./config.json'); // Loads the settings
let db;

module.exports = {

  //Init the database
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

  //Adding a server to the database
  addServerToDB: function (serverId, serverName) {
    console.log("Adding server " + serverId + " (" + serverName + ") to the database.");
      db.run(`INSERT INTO servers(server_id, name) VALUES(?, ?)`, [serverId, serverName], (err) => {
      if (err) {
        console.error("addServerToDB : " + err.message);
      }
    });
    },

  addChannelToDB: function (channelID, channelName, serverId)
  {
      console.log("Adding channel " + channelID + " (" + channelName + ") to the database.");

      db.run(`INSERT INTO channels(channel_id, name, server_id) VALUES(?, ?, ?)`, [channelID, channelName, serverId], (err) => {
          if (err) {
              console.error("addChannelToDB : " + err.message);
          }
      });
    },

  addMessageToDB: function (messageId, channelID, serverId, message, author, time) {
    console.log("Adding Message " + messageId + " (" + '[' + time + ']' + author + ':' + message + ") to the database.");

    db.run(`INSERT INTO messages(message_id, server_id, channel_id, message, author, time) VALUES(?, ?, ?, ?, ?)`, [messageId, serverId, channelID, message, author, time], (err) => {
      if (err) {
        console.error("addMessageToDB : " + err.message);
      }
    });
  },

  isServerInDB: function (serverID, callback) {
      console.log("Checking if server " + serverID + " is in the database...");

    db.get(`SELECT server_id FROM servers WHERE server_id = ?`, [serverID], (err, result) => {
      if (err) return console.log(err)
      if (result != null) {
        return callback(result.server_id);
      } return callback(null);
    })
  },

  //End the connection to the database
  closeDatabase: function (){
    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log('Close the database connection.');
    });
  }
}


