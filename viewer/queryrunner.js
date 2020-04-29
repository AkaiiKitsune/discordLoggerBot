const sqlite3 = require('sqlite3');
const fs      = require('fs');

function queryRunner(dbpath, channelid) {
    /**
     * Runs an SQL query inside the SQLite3 database, reading all messages from a given channel.
     * Reads `message, `author and `time fields from the channel.
     * Then opens the file `data.json` and prints the object as a JSON string.
     */
    let db = new sqlite3.Database(dbpath, function (err) {
        console.error('Could not open database!');
        fs.writeFile('data.json', 'data = null', function (err) {
            if(err) {
                console.error("Wow! I can't even write the error file!");
                console.error("This is going to lead to some nasty results on the webpage...");
            }
        });
        return ;
    });
    db.all('select * from messages where channel_id = ' + channelid, function (err, obj) {
        if(err) {
            console.error(err);
            fs.writeFile('data.json', 'data = null', function (err) {
                if(err) {
                    console.error("Wow! I can't even write the error file!");
                    console.error("This is going to lead to some nasty results on the webpage...");
                }
            });
        }
        else {
            console.log(`Read ${obj.length} lines form the DB`);
            let jstr = 'data = ' + obj.stringify();
            fs.writeFile('data.json', jstr, function (err) {
                if(err) {
                    console.error("Welp! Can't write to the data.json file.");
                    console.error("This is going to lead to some nasty results on the webpage...");
                }
            });
        }
    });
}