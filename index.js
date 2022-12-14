const http = require('http');
const https = require('https');
const { getHttpsOpt } = require('./cert');

// 端口[0 ~ 65535]
const argRegExp = /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])\/.*/

const httpsProxyServer = async () => {
    const [_cmd, _script, ...argv] = process.argv;

    const proxyRules = [];
    argv.forEach(arg => {
        if(argRegExp.test(arg)) {
           proxyRules.push(arg.split('/'));
        }
    });

    const options = await getHttpsOpt();

    https.createServer(options, (req, res) => {
        const rule = proxyRules.find(([_port, _path]) => {
           return req.url.startsWith(`/${_path}`); 
        });

        if (!rule) {
            res.writeHead(404);
            res.end();

            return;
        }

        const _req = http.request({
            host: 'localhost',
            port: rule[0],
            path: req.url,
            method: req.method,
            headers: req.headers,
        }, (_res) => {
            res.writeHead(_res.statusCode, _res.headers);
            _res.pipe(res);
        });
        _req.on('error', (e) => {
            console.error(`proxy request failed: ${e.message}`);
            res.writeHead(500);
            res.end();
        });
        req.pipe(_req);

   }).listen(8989, () => {
        console.log(`\
proxy server listening on 8989
${proxyRules.map(([port, path]) => `${path} => ${port}/${path}`).join('\n')}`);
   }); 
};

module.exports = httpsProxyServer;