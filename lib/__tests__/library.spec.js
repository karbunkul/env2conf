const chai = require('chai');
const expect = chai.expect;

const {
  verifySchema,
  verifyConfig,
  variableGetRawValue
} = require('../library');

describe('library test', () => {
  describe('verifySchema', () => {
    const schema = {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        hello: { default: 'world' }
      }
    };

    it('verify success', () => {
      let data = { foo: 'bar' };
      data = verifySchema({ data, schema });
      expect(data).to.have.property('foo');
      expect(data).to.have.property('hello');
    });

    it('verify is failed', () => {
      try {
        verifySchema({ data: { foo: 1 }, schema });
      } catch (e) {
        expect(e.name === 'SchemaValidateException').to.be.true;
      }
    });
  });

  describe('verifyConfig', () => {
    let config = {
      variables: [
        {
          name: 'NODE_ENV',
          constraints: {
            pattern: '/(development|production)/'
          }
        }
      ]
    };

    config = verifyConfig(config);
    it('must be have properties: variables, variables', () => {
      expect(config)
        .to.be.an('object')
        .have.all.keys(['variables', 'environments']);
    });

    it('variables must be array', () => {
      expect(config.variables).to.be.an('array');
    });

    describe('variable item', () => {
      expect(config.variables.length === 1).to.be.true;
      const variable = config.variables[0];
      it('must be object with keys name, type, constraints', () => {
        expect(variable)
          .to.be.an('object')
          .all.keys(['name', 'type', 'constraints']);
      });

      it('name must be string and equal NODE_ENV', () => {
        expect(variable.name)
          .to.be.an('string')
          .equal('NODE_ENV');
      });

      it('type must be string and equal string', () => {
        expect(variable.type)
          .to.be.an('string')
          .equal('string');
      });

      it('constraints must be object and have property pattern', () => {
        expect(variable.constraints)
          .to.be.an('object')
          .key('pattern');
      });
    });

    describe('default values', () => {
      const data = verifyConfig({});
      it('variables must be empty array', () => {
        expect(data.variables).to.be.an('array');
        expect(data.variables.length === 0).to.be.true;
      });

      it('variables must be empty object', () => {
        expect(data.environments).to.be.an('object');
        expect(Object.keys(data.environments).length).to.be.equal(0);
      });
    });
  });

  describe('variableGetRawValue', () => {
    const name = 'ENV2CONF_VAR_GET_VALUE_TEST';
    process.env[name] = 'pass';
    describe('only name', () => {
      it('should be equal pass', function() {
        const raw = variableGetRawValue({ name });
        expect(raw).to.be.equal('pass');
      });

      it('should be throw exception DoesNotExistEnvException', () => {
        try {
          variableGetRawValue({ name: 'ENV2CONF_VAR_DOES_NOT_EXIST' });
        } catch (e) {
          expect(e.name === 'DoesNotExistEnvException').to.be.true;
        }
      });
    });

    describe('variables, local value', () => {
      const raw = variableGetRawValue({
        name,
        variables: { [name]: 'local value' }
      });
      expect(raw).to.be.equal('local value');
    });

    describe('variables, system value', () => {
      const raw = variableGetRawValue({
        name,
        variables: { ENV2CONF_VAR_DOES_NOT_EXIST: 'local value' }
      });
      expect(raw).to.be.equal('pass');
    });
  });
});
