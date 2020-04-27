/** DATABASE UTILITIES
 *  ==================
 * 
 * This is a module which provides methods to access the SQLite3 database and enter new server, channel
 * and message data into it using the API provided by the NodeJS SQLite3 module. This includes the following
 * methods:
 * 
 *    1. `initDatabase`: A method to initiate a connection to the SQLite3 database. It takes a single boolean 
 *       argument which indicates whether or not the required relations already exist in the database. If 
 *       these relations/tables have already been created, then there is no need to rebuild them, hence the
 *       argument should be `false`. Setting the argument to `true` causes this method to create the required 
 *       tables upon initializing the database.
 * 
 *    2. `addServerToDB`: A method which takes the Discord Guild ID (ServerID) and a Server Name (string) and
 *       runs an SQL query to insert the data into a new row of the `servers` table in the database.
 * 
 *    3. `addChannelToDB`: A method to insert a row into the `channels` table of the database, it takes arguments
 *       for the Discord channel ID, channel name and the Discord Guild ID of the server the channel belongs to.
 * 
 *    4. `addMessageToDB`: Arguments - messageId, channelID, serverId, message, author, time;
 *       Inserts a new row into the `messages` table, which contains the above arguments as its fields. The messageId
 *       should be the Discord Message ID of the message, preferably.
 * 
 *    5. `isServerInDB`: This method uses the `get` method of the SQLite3 module to query for a server using a given
 *       server ID. It takes two arguments: a server ID to query by, and a `callback` function, which should take one
 *       argument. If the server of the given ID is found in the database, this method calls the callback with the server
 *       ID as argument and forwards the value it returns to its own returned value. Otherwise it called the callback with
 *       NULL and returns the result.
 *       To obtain a simple boolean value which indicates whether a server is in the database, use:
 *       `isServerInDB(serverId, (result) => { return result != NULL; } );`
 * 
 *    6. `closeDatabase`: Closes the connection with the SQLite3 database safely, using the SQLite3 module.
 */

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


