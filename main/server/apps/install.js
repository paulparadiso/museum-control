const fs = require('fs');
const resolve = require('path').resolve;
const join  = require('path').join;
const cp = require('child_process');


fs.readdirSync(__dirname).forEach(d => {

    const appPath = join(__dirname, d);

    if(!fs.existsSync(join(appPath, 'package.json'))) return;

    cp.spawn('yarn', ['install'], {env: process.env, cwd: appPath, stdio: 'inherit'});

})
