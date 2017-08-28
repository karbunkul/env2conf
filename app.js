/* jshint esversion:6 */

const env2conf = require('./lib/main.js');
const config = env2conf.load();

env2conf.save({
  dev: config.DEV,
  ameba: config.AMEBA
});

console.log(process.env2conf, 'all values');
