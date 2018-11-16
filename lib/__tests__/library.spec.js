const chai = require('chai');
const expect = chai.expect;

const {verifySchema} = require('../library');

describe("library test", () => {
  it("verifySchema", () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {type: 'string'},
        hello: {default: 'world'}
      }
    };
    // без ошибки валидации
    let data = {foo: 'bar'};
    data = verifySchema(data, schema);
    expect(data).to.have.property('foo');
    expect(data).to.have.property('hello');
    // c ошибкой валидации
    try{
      verifySchema({foo: 1}, schema);
    } catch (e) {
      expect(e.name, 'SchemaValidateException').to.be.ok;
    }
  });

  it("verifyConfig", () => {
    const schema = {
      type: 'object',
      properties: {
        foo: {type: 'string'},
        hello: {default: 'world'}
      }
    };
    // без ошибки валидации
    let data = {foo: 'bar'};
    data = verifySchema(data, schema);
    expect(data).to.have.property('foo');
    expect(data).to.have.property('hello');
    // c ошибкой валидации
    try{
      verifySchema({foo: 1}, schema);
    } catch (e) {
      expect(e.name, 'SchemaValidateException').to.be.ok;
    }
  });


});
