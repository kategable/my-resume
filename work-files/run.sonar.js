// onboarding doc: https://wiki.finra.org/display/DOE/Onboarding+to+SonarQube+2.0
const { spawn } = require('child_process')
require('dotenv').config()
const jenkins_login = process.env.SVC_JENKINS_SQ_D

let command;
if (jenkins_login) {
    command = spawn('node_modules/sonar-scanner/bin/sonar-scanner',
        ['-Dsonar.host.url=https://sonarqube2.finra.org/',
            '-Dsonar.login=' + jenkins_login])
}
else {
    command = spawn('node_modules/sonar-scanner/bin/sonar-scanner',
        ['-Dsonar.host.url=' + process.env.sonar_local_host_url,
        '-Dsonar.login=' + process.env.sonar_local_login])
}

command.stdout.on('data', output => {
    process.stdout.write(output.toString())
})
command.stderr.on('data', output => {
    process.stderr.write(output.toString())
})
command.on('close', code => {
    process.exit(code)
})



