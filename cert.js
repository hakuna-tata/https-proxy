const path = require('path');
const fs = require('fs');
const mkcert = require('mkcert');

const genCert = async () => {
  try {
    // 创建 “CA认证机构” 
    const ca = await mkcert.createCA({
      organization: 'Proxy CA',
      countryCode: 'CN',
      state: 'GuangDong',
      locality: 'ShenZhen',
      validityDays: 3650,
    });

    // 创建 TLS 证书
    return await mkcert.createCert({
      domains: ['localhost', '127.0.0.1'],
      validityDays: 3650,
      caKey: ca?.key, // CA private key
      caCert: ca?.cert, // CA certificate
    });
  } catch (error) {
    console.error('Failed to generate certificate:', error);
    throw error;
  }
};

exports.getHttpsOpt = async () => {
  const basePath = path.resolve(process.env.HOME || process.env.USERPROFILE, '.proxy');
  const keyPath = path.resolve(basePath, 'ca.key');
  const certPath = path.resolve(basePath, 'ca.crt');

  try {
    fs.statSync(basePath);

    return {
      key: fs.readFileSync(keyPath),
      cert: fs.readFileSync(certPath),
    };
  } catch (error) {
    try {
      const cert = await genCert();
      fs.mkdirSync(basePath, { recursive: true });
      fs.writeFileSync(keyPath, cert.key, { mode: 0o600 });
      fs.writeFileSync(certPath, cert.cert);

      return cert;
    } catch (err) {
      console.error('Failed to get or generate HTTPS options:', err);
      throw err;
    }
  }
};