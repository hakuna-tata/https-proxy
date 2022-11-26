const path = require('path');
const fs = require('fs');
const mkcert = require('mkcert');

const genCert = async () => {
    // 创建 “CA认证机构” 
    const result = await mkcert.createCA({
        organization: 'Proxy CA',
        countryCode: 'CN',
        state: 'GuangDong',
        locality: 'ShenZhen',
        validityDays: 3650,
    });
    
    // 生成证书
    return await mkcert.createCert({
        domains: ['localhost', '127.0.0.1'],
        validityDays: 3650,
        caKey: result?.key,
        caCert: result?.cert,
    });
};

exports.getHttpsOpt = async () => {
    const basePath = path.resolve(process.env.HOME, '.proxy');
    const keyPath = path.resolve(basePath, 'ca.key');
    const certPath = path.resolve(basePath, 'ca.crt');

    try {
        fs.statSync(basePath);
    } catch(_) {
        const cert = await genCert();

        try {
            fs.mkdirSync(basePath);
        } catch(e) {}
        fs.writeFileSync(keyPath, cert.key, {mode: 0o600});
        fs.writeFileSync(certPath, cert.cert);
        
        return cert;
    }

    return {
        key: fs.readFileSync(keyPath),
        cert: fs.readFileSync(certPath),
    };
};