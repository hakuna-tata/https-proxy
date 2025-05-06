const http = require('http');

http.createServer((req, res) => {
  console.log(`${req.url}:`, Date.now());
  res.write('hello! http request \n');
  res.end();

}).listen(8080, () => {
  console.log('server listening on 8080');
});