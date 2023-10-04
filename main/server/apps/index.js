const activeApps = ['Server', 'SyncManager'];
const apps = {};

activeApps.map(app => {
    apps.app = require(`./${app}`)();
})