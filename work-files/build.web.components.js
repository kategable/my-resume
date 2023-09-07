#!/usr/bin/env node

const fs = require('fs-extra');
const concat = require('concat');
const replace = require('buffer-replace');
 
function makeStylesJs(cssName, jsName) {
    const header = `const styleElement = document.createElement('style');styleElement.appendChild(document.createTextNode(\``;
    const footer = `\`));document.getElementsByTagName('head')[0].appendChild(styleElement);\n`;
    
    fs.writeFileSync(jsName, header);
    const cssContent = replace(fs.readFileSync(cssName),'`','\\`');  
    const cssContent1 = replace(cssContent,'\\','\\\\');
    fs.appendFileSync(jsName, cssContent1);    
    fs.appendFileSync(jsName, footer);
}

function makeScriptsFix(jsName) {
    fs.writeFileSync(jsName, 'var _xamzrequire;\n');
}

function copyFileSyncWithReplace(srcFile, destFile, replaceFrom, replaceTo) {
    fs.writeFileSync(destFile,replace(fs.readFileSync(srcFile),replaceFrom, replaceTo));
}


async function build(distFolder, webComponentFileName) {
    makeStylesJs(`${distFolder}/styles.css`,`${distFolder}/styles.js`);    
    makeScriptsFix(`${distFolder}/scripts-fix.js`);
    const files = [
        `${distFolder}/styles.js`,
        `${distFolder}/runtime.js`,
        `${distFolder}/polyfills.js`,
        `${distFolder}/main.js`,
        `${distFolder}/scripts-fix.js`, // this makes scripts.js/ctl-common.js ES6/module compliant
        `${distFolder}/scripts.js`,
        ];

        fs.ensureDirSync('dist/apps/ccm-webcomponent/web-components');
        await concat(files, `dist/apps/ccm-webcomponent/web-components/${webComponentFileName}`);
}

async function buildAll() { 
    // minified
    build('dist/apps/ccm-webcomponent', 'outbox-web-components.js');
    fs.copyFileSync( 'apps/ccm-webcomponent/src/test-harness/index.html', 'dist/apps/ccm-webcomponent/web-components/index.html');
    // full-size
    // build('dist/apps/outbox-ui/debug', 'outbox-web-components-debug.js');
    // copyFileSyncWithReplace( 'apps/outbox-ui/src/test-harness/index.html', 'dist/apps/outbox-ui/web-components/index-debug.html',
    //                 'outbox-web-components.js', 'outbox-web-components-debug.js');
}

buildAll();


