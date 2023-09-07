var winston = require('winston');
const HttpsAgent = require('agentkeepalive').HttpsAgent;

// the line below controls which API to connect to. dev/devint/qa/qaint
var SDLC = 'dev';

var BEARER;
let CCM_API_BASE;

if (SDLC == 'devint') {
  CCM_API_BASE = 'https://docgen-devint.ccm.dev.finra.org';
} else if (SDLC == 'qa') {
  CCM_API_BASE = 'https://docgen-qa.ccm.qa.finra.org';
} else if (SDLC == 'dev') {
  CCM_API_BASE = 'https://docgen-dev.ccm.dev.finra.org';
} else if (SDLC == 'qaint') {
  CCM_API_BASE = 'https://docgen-qaint.ccm.qa.finra.org';
}

const isDev = SDLC == 'dev' || SDLC == 'devint';
const dopplerHost = isDev ? 'https://search-api.dplr.dev.finra.org' : 'https://search-api.dplr.qa.finra.org';
let contactsHost = isDev ? 'https://isso-int.contacts.dev.finra.org' : 'https://isso-int.contacts.qa.finra.org';
let alfrescoHost = isDev
  ? 'https://entity-devint.alfresco.dev.finra.org'
  : 'https://alf00-web-component.alfresco.qa.finra.org';

if (process.env.BEARER) {
  BEARER = process.env.BEARER;
} else {
  BEARER = require('child_process').execSync(`node getbearer.js ${SDLC}`).toString().trim();
}
console.log(`Bearer ${BEARER}`);

function logProvider() {
  return winston.createLogger({
    level: 'debug',
    logProvider: logProvider,
    format: winston.format.combine(winston.format.splat(), winston.format.simple()),
    transports: [new winston.transports.Console()],
  });
}

var PROXY_CONFIG = [
  {
    context: ['/sentry-api/', '/outbox-api/', '/search-api/'],
    target: CCM_API_BASE,
    secure: true,
    logLevel: 'debug',
    logProvider: logProvider,
    changeOrigin: true,
    // agent: new HttpsAgent({
    //   maxSockets: 100,
    //   keepAlive: true,
    //   maxFreeSockets: 10,
    //   keepAliveMsecs: 100000,
    //   timeout: 6000000,
    //   freeSocketTimeout: 90000
    // }),
    headers: {
      origin: CCM_API_BASE,
      host: CCM_API_BASE,
    },
  },
  {
    context: ['/doppler-lookup/'],
    target: dopplerHost,
    secure: true,
    logLevel: 'debug',
    logProvider: logProvider,
    changeOrigin: true,
    headers: {
      origin: dopplerHost,
      host: dopplerHost,
    },
  },
  {
    context: ['/api'],
    target: contactsHost,
    secure: true,
    logLevel: 'debug',
    logProvider: logProvider,
    changeOrigin: true,
    headers: {
      host: contactsHost,
      // the 3 lines below are to tell API gateway that this is common for them M2M call, not browser-originated.
      cookie: '',
      referer: '',
      origin: '',
      // Set BEARER environment variable before debugging with 'npm run start'
      authorization: 'Bearer ' + BEARER,
    },
    // onProxyReq: function (proxyReq, req, res) {console.log(proxyReq); },
    // onProxyRes: function (proxyRes, req, res) {console.log(proxyRes); },
  },
  {
    context: [
      '/alfresco',
      '/app.config.json',
      '/assets/i18n',
      '/assets/adf-core',
      '/assets/adf-content-services',
      '/releases/v1.0.0/alf-web-components-1.0.0.js',
    ],
    target: alfrescoHost,
    bypass: function (req, res, proxyOptions) {
      res.end('{}');
      return true;
    },
    secure: true,
    logLevel: 'debug',
    logProvider: logProvider,
    changeOrigin: true,
    headers: {
      host: alfrescoHost,
      // alfresco does not like local.dev.finra.org, but is OK with localhost:4200
      origin: 'http://localhost:4200',
      // Set BEARER environment variable before debugging with 'npm run start'
      authorization: 'Bearer ' + BEARER,
    },
  },
];

module.exports = PROXY_CONFIG;
