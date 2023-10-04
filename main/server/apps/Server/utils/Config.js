const path = require('path');
const { JsonDB, Config } = require('node-json-db');

class ConfigManager {

    constructor() {
        console.log(__dirname);
        this.db = new JsonDB(new Config(path.join(__dirname, '../config.json'), true, true, '/'));
    }

    async getConfig(name) {
        const config = await this.db.getData(`/configs/${name}`);
        return config
    }

    async getAllConfigs() {
        const configs = await this.db.getData('/configs');
        return configs;
    }

    async removeConfig(name) {
        await this.db.delete(`/configs/${name}`);
        return this.getAllConfigs();
    }

    async saveConfig(name, data) {
        console.log(data);
        await this.db.push(`/configs/${name}`, data);
        return this.getAllConfigs();
    }
}

module.exports = ConfigManager;