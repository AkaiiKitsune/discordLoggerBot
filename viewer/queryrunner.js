const sqlite3 = require('sqlite3');
const fs      = require('fs');
const pmd     = require('./markdown_parser');

exports.queryRunner = function (dbpath, channelid, ofile) {
    /**
     * Runs an SQL query inside the SQLite3 database, reading all messages from a given channel.
     * Reads `message, `author and `time fields from the channel.
     * Then opens the file whose name is given by the ofile argumens and prints the object as a
     * JSON string. Formats the message with parsemd first.
     */
    let db = new sqlite3.Database(dbpath, function (err) {
        if(err) {
            console.error('Could not open database!');
            console.error('Error: ' + err);
            fs.writeFile(ofile, 'data = null', function (err) {
                if(err) {
                    console.error("Wow! I can't even write the error file!");
                    console.error("This is going to lead to some nasty results on the webpage...");
                }
            });
            return ;
        }
    });
    db.all('select * from messages where channel_id = ' + channelid, function (err, obj) {
        if(err) {
            console.error(err);
            fs.writeFile(ofile, 'data = null', function (err) {
                if(err) {
                    console.error("Wow! I can't even write the error file!");
                    console.error("This is going to lead to some nasty results on the webpage...");
                }
            });
        }
        else {
            console.log(`Read ${obj.length} lines form the DB`);
            for(let i = 0; i < obj.length; i++) {
                row = obj[i];
                row.message = pmd.parsemd(row.message);
                obj[i] = row;
            }
            let jstr = 'data = ' + JSON.stringify(obj);
            fs.writeFile(ofile, jstr, function (err) {
                if(err) {
                    console.error("Welp! Can't write to the ofile.");
                    console.error("This is going to lead to some nasty results on the webpage...");
                }
                else {
                    console.log(`Written ${ofile}`);
                }
            });
        }
    });
}