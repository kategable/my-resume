const https = require('https');
const fs = require('fs-extra');

var BEARER=''
function setBearer() {
    var auth = fs.readFileSync('.auth')
    var token = Buffer.from(auth).toString('base64');
    console.error(process.argv)
    const sdlc = process.argv[2];

    const host = sdlc.startsWith('dev') ? 'isso-devint.fip.dev.finra.org' : 'isso-qaint.fip.qa.finra.org';

    const options = {
        hostname: host,
        port: 443,
        path: '/fip/rest/isso/oauth2/access_token?grant_type=client_credentials',
        method: 'POST',
        headers: {
            'Authorization': `Basic ${token}`,
            'Content-Length': 0
        }
    }
    var req = https.request(options,(res) => {
     
        res.on('data', (d) => {
            BEARER=JSON.parse(d).access_token;
            console.log(`${BEARER}`);
        });
    });

    req.on('error', (e) => {
        console.error(e);
      });
      
    req.end();
}

setBearer();