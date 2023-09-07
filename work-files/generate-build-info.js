const fs = require('fs-extra');
const { promisify } = require('util');

async function build() {
    const exec = promisify(require('child_process').exec);
    const npmVersion = await exec('npm -v');
    const buildInfo = {
        "COMPONENT":        process.env.COMPONENT,
        "BUILD_TIMESTAMP":  process.env.BUILD_TIMESTAMP,
        "BUILD_ID":         process.env.BUILD_ID,
        "BUILD_URL":        process.env.BUILD_URL,
        "GIT_BRANCH":       process.env.GIT_BRANCH,
        "GIT_COMMIT":       process.env.GIT_COMMIT,
        "GIT_URL":          process.env.GIT_URL,
        "BUILD_PLATFORM":   process.platform,
        "BUILD_NODE":       process.version,
        "BUILD_NPM":        npmVersion.stdout.trim()
    }
    await fs.ensureDir('generated');
    await fs.writeJSONSync('generated/build-info.json', buildInfo);
    console.log('Build environment:\n', buildInfo); // to show it on Jenkins log
}

build();

