const KEY = Symbol.for('env2conf');


const globalSymbols = Object.getOwnPropertySymbols(global);
let hasInstance = globalSymbols.indexOf(KEY) > -1;

if (!hasInstance) {
  console.log('init');

  const fs = require('fs');
  const path = require('path');
  const library = require('./library');

  const config = fs.readFileSync(path.resolve('.env2conf.json'), 'utf-8');

  let configObj = JSON.parse(config);
  // проверяем конфиг
  configObj = library.verifyConfig(configObj);

  if (configObj) {
    const { variables, environments } = configObj || {};
    const stage = 'development';
    const config = {};

    const convert = (rawEnvValue, type, constraints) => rawEnvValue;

    variables.forEach(({ name, type, constraints }) => {
      try {
        const rawEnvValue = process.env[name] || environments[stage][name];
        if (rawEnvValue) {
          config[name] = convert(rawEnvValue, type, constraints);
        } else {
          console.log(` нет значения для переменной ${name}`);
          process.exit(1);
        }
      } catch (e) {
        throw new Error(e);
      }
    });

    global[KEY] = config;
  }
}

const singleton = {};

Object.defineProperty(singleton, 'getInstance', {
  get: function() {
    return global[KEY];
  }
});

Object.freeze(singleton);

module.exports = singleton;
