const Ajv = require('ajv');
const { ConfigValidateException } = require('../../npmjs/env2conf/lib/exceptions');

/**
 * Валидация объекта по схеме
 *
 * @param data - данные для валидирования
 * @param schema - схема
 * @returns {*} Ошибка валидации или исходные данные с значениями по умолчанию
 */
const verifySchema = (data, schema) => {
  const ajv = new Ajv({ useDefaults: true });
  const validate = ajv.compile(schema);
  let valid = validate(data);
  if (!valid) {
    throw new ConfigValidateException(validate.errors);
  } else {
    return data;
  }
};

/**
 * Проверка конфига и добавление значений по умолчанию
 *
 * @param config - объект с конфигом
 * @returns {*|void} Ошибка валидации или исходный конфиг с значениями по умолчанию
 */
const verifyConfig = config => {
  const schema = {
    type: 'object',
    properties: {
      variables: {
        type: 'array',
        items: {
          type: 'object',
          required: ['name'],
          properties: {
            name: { type: 'string' },
            type: { default: 'string' },
            constraints: { type: 'object', default: {} }
          }
        }
      },
      environments: {
        type: 'object',
        default: {}
      }
    }
  };

  return verifySchema(config, schema);
};

module.exports = {
  verifyConfig,
  verifySchema,
};
