const mkcert = require('mkcert');

const genCert = async () => {
    const result = await mkcert.createCA({
        organization: 'Proxy CA',
        countryCode: 'CN',
        state: 'GuangDong',
        locality: 'ShenZhen',
        validityDays: 3650,
    });

    console.log(result);
};

exports.getCert = async () => {
    await genCert();
};