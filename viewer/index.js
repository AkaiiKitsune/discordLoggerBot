const http = require('http');
const fs   = require('fs');

http.createServer( function (req, res) {
    let page  = url.split('?')[0];
    let query = null;
    if(url.includes('?')) {
        query = url.split('?')[1];
    }
 
    
}).listen(8080);