/* jshint esversion:6 */

const fs = require('fs');
const  path = require('path');
const dotenv = require('dotenv');

const EnvException = require('./exception.js');

/**
 * Load library config
 */
const libConfig = ({dir}) => {
    const configFile = path.join(dir, 'config.json');
    if (fs.existsSync(configFile)) {
        return require(configFile);
    }else {
        return {
            required: []
        };
    }
};

/**
 * Save config in process
 */
const save = (config) => {
    Object.defineProperty(process, 'env2conf', {
        value: config,
        writable: false,
        configurable: false
    });
};

/**
 * Load ENV from file
 */
const load = (options = {}) => {
    const envName = process.env.NODE_DEV || 'local';
    const envDir = path.join(process.cwd(), options.dir || 'env2conf');
    const envFile = path.join(envDir, `${envName}.env`);

    // load env from file (if exist)
    if (fs.existsSync(envFile)) {
        dotenv.load({ path: envFile });
    }
    const {required} = libConfig({ dir: envDir });
    required.map((name) => {
        if (process.env[name] == undefined) {
            const message = `Missing required ENV variable ${name} in ${envFile}`;
            throw new EnvException(message);
        }
    });

    return process.env;
    };

module.exports = {
    load,
    save
};
