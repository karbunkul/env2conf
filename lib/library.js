const Ajv = require('ajv');
const {
  SchemaValidateException,
  DoesNotExistEnvException
} = require('./exceptions');

/**
 * Validate object via json-schema.
 *
 * @param data - object or array for validate
 * @param schema - json-schema
 * @returns {*} Validation error or source data with defaults
 */
const verifySchema = ({ data, schema }) => {
  const ajv = new Ajv({ useDefaults: true });
  const validate = ajv.compile(schema);
  let valid = validate(data);
  if (!valid) {
    throw new SchemaValidateException(validate.errors);
  } else {
    return data;
  }
};

/**
 * Config verify and set defaults.
 *
 * @param config - config object
 * @returns {*|void} Validation error or config object with defaults
 */
const verifyConfig = config => {
  const schema = {
    type: 'object',
    properties: {
      variables: {
        type: 'array',
        default: [],
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

  return verifySchema({ data: config, schema });
};

/**
 * Get variable value from variables.
 *
 * @param name - environment variable name
 * @param variables
 */
const variableGetRawValue = ({ name, variables }) => {
  const raw = !variables
    ? process.env[name]
    : variables[name] || process.env[name];
  if (raw) {
    return raw;
  } else {
    throw new DoesNotExistEnvException(name);
  }
};

module.exports = {
  verifyConfig,
  verifySchema,
  variableGetRawValue,
};
