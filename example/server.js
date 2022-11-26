const http = require('http');
   
http.createServer((req, res) => {
    res.write('hello to proxy \n');
    res.end();

}).listen(8080, () => {
    console.log('server listening on 8080');
}); 