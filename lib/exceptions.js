function SchemaValidateException(message) {
  this.message = message;
  this.name = 'SchemaValidateException';
}

function DoesNotExistEnvException(name) {
  this.message = `ENV ${name} doesn't exist`;
  this.name = 'DoesNotExistEnvException';
}

module.exports = {
  SchemaValidateException,
  DoesNotExistEnvException,
};
