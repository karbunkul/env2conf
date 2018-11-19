function SchemaValidateException(message) {
  this.message = message;
  this.name = 'SchemaValidateException';
}

function DoesNotExistEnvException(name) {
  this.message = `ENV ${name} doesn't exist`;
  this.name = 'DoesNotExistEnvException';
}

function ConvertTypeException(value, type) {
  this.message = `value ${value} doesn't convert to type ${type}`;
  this.name = 'ConvertTypeException';
}

module.exports = {
  SchemaValidateException,
  DoesNotExistEnvException,
  ConvertTypeException,
};
