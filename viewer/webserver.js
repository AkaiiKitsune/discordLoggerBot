const http = require('http');
const fs   = require('fs');

http.createServer(function (request, response) {
    console.log('Received a request: ' + request.url);
    switch(request.url) {
        case '/data.json':
            fs.readFile('./data.json', function (err, text) {
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
        case '/format.js':
            fs.readFile('./format.js', function (err, text) {
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
        case '/favicon.ico':
            fs.readFile('./favicon.ico', function (err, pic) {
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
            fs.readFile('./index.html', function (err, text) {
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