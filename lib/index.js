const KEY = Symbol.for('env2conf');

const globalSymbols = Object.getOwnPropertySymbols(global);
let hasInstance = globalSymbols.indexOf(KEY) > -1;

if (!hasInstance) {
  console.log('init');

  const fs = require('fs');
  const path = require('path');
  const {
    verifyConfig,
    variableGetRawValue,
    convertVariableToType,
    applyConstraints
  } = require('./library');

  const config = fs.readFileSync(path.resolve('.env2conf.json'), 'utf-8');

  let configObj = JSON.parse(config);
  // проверяем конфиг
  configObj = verifyConfig(configObj);

  if (configObj) {
    const { variables, environments } = configObj || {};
    const stage = 'development';
    const config = {};

    variables.forEach(({ name, type, constraints }) => {
      try {
        const rawEnvValue = variableGetRawValue({
          name,
          variables: environments[stage]
        });
        const convertedValue = convertVariableToType({
          value: rawEnvValue,
          type
        });
        config[name] = applyConstraints({
          value: convertedValue,
          type,
          constraints
        });
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
