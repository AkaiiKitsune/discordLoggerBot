/**
 *   !!! NOTE !!!
 *   ============
 *  
 *   THIS THING DOESN'T WORK YET, BECAUSE I HAVEN'T FIGURED OUT HOW TO 
 *   TAKE INPUT FOR WHICH CHANNEL TO VIEW.
 */


// Importing required modules
const http = require('http');
const fs   = require('fs');
const qr   = require('./queryrunner.js');

// Parameters for running the file
const dbpath = 'Bot/database.db';
const testChannel = '703793735208534108';

http.createServer(function (request, response) {
    console.log('Received a request: ' + request.url);
    switch(request.url) {
        
        case '/viewer/data.js':    
            console.log('Generating new Query Runner to make a data.js.');
            qr.queryRunner(dbpath, testChannel, 'data.js');
            console.log("Query completed. Now reading the file data.js");
            fs.readFile('viewer/data.js', function (err, text) {
                if(err) {
                    console.error('Error: ' + err);
                    response.writeHead(404, "text/javascript");
                    response.write("data = []");
                    response.end();
                }
                else {
                    console.log('Sending file.');
                    response.writeHead(200, "text/javascript");
                    response.write(text);
                    response.end();
                }
            });
            break;
        case '/viewer/format.js':
            fs.readFile('viewer/format.js', function (err, text) {
                if(err) {
                    console.error('Error: ' + err);
                    response.writeHead(404, "text/javascript");
                    response.write('function formatJs() {document.write("<h3>Error 404: File not found.</h3>")}');
                    response.end();
                }
                else {
                    console.log('Sending file.');
                    response.writeHead(200, "text/javascript");
                    response.write(text);
                    response.end();
                }
            });
            break;
        case '/viewer/favicon.ico':
            fs.readFile('viewer/favicon.ico', function (err, pic) {
                if(err) {
                    console.error('Error: ' + err);
                    response.writeHead(404, "text/plain");
                    response.write("Umm, can't find the favicon. TwT");
                    response.end();
                }
                else {
                    console.log('Sending file.');
                    response.writeHead(200, "img");
                    response.write(pic);
                    response.end();
                }
            });
            break;
        default:
            fs.readFile('viewer/index.html', function (err, text) {
                if(err) {
                    console.error('Error: ' + err);
                    response.writeHead(500, "text/plain");
                    response.write("There was an error in constructing the document from the database.");
                    response.end();
                }
                else {
                    console.log('Sending file.');
                    response.writeHead(200, "text/javascript");
                    response.write(text);
                    response.end();
                }
            });
            break;
    }
}).listen(8080);