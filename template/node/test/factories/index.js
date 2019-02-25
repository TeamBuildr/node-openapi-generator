const { forEach } = require('lodash');
const requireDirectory = require('require-directory');

const factories = requireDirectory(module, './');

forEach(factories, (value, key) => { factories[key] = value; });

module.exports = factories;
