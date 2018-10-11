const fs = require('fs');
const path = require('path');

const getNodeType = (openapiType) => {
  if (openapiType === null || openapiType === undefined) {
    return '{Object}';
  }

  if (openapiType.toLowerCase() === 'string') {
    return '{String}';
  }

  if (openapiType.toLowerCase() === 'integer') {
    return '{Integer}';
  }

  return '{Object}';
};

const parseType = (propObj) => {
  if (propObj.type === 'array') {
    return `[${getNodeType(propObj.items.type)}]`;
  }

  return getNodeType(propObj.type);
};

const createModel = async (directory, key, openapispec) => {
  const modelDef = openapispec.components.schemas[key];

  const stream = fs.createWriteStream(path.join(directory, `${key}.js`), { encoding: 'utf8' });
  stream.once('open', () => {
    stream.write(`// ${key}.js\n`);
    stream.write('\n');
    stream.write(`class ${key} {\n`);
    stream.write('  /**\n');
    stream.write(`   * @param {Object} options an object with the defined values for the ${key} model.\n`);
    Object.keys(modelDef.properties).forEach((property) => {
      stream.write(`   * - ${parseType(modelDef.properties[property])}`);
      if (modelDef.required !== undefined && modelDef.required.includes(property)) {
        stream.write(` ${property}\n`);
      } else {
        stream.write(` [${property}]\n`);
      }
    });
    stream.write('   */\n');
    stream.write('  constructor(options) {\n');
    Object.keys(modelDef.properties).forEach((property) => {
      stream.write(`    this.${property} = options.${property};\n`);
    });
    stream.write('  }\n');
    stream.write('}\n');
    stream.write('\n');
    stream.write(`module.exports = ${key};\n`);
    stream.close();
  });
};

module.exports = (directory, key, openapispec) => createModel(directory, key, openapispec);
