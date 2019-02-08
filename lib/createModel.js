const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const configs = require('../config/node');

const parseType = (propObj) => {
  if (propObj.type === 'array') {
    return `[{${configs.typemap(propObj.items.type)}}]`;
  }

  return `{${configs.typemap(propObj.type)}}`;
};

const createModel = async (hbsPath, outDirPath, key, openapispec) => {
  const fileName = `${key.charAt(0).toLowerCase()}${key.slice(1)}.js`;
  const modelDef = openapispec.components.schemas[key];
  const template = fs.readFileSync(hbsPath).toString('utf-8');
  const compiledTemplate = handlebars.compile(template);

  modelDef.fileName = fileName;
  modelDef.modelName = key;
  Object.keys(modelDef.properties).forEach((property) => {
    const propObj = modelDef.properties[property];
    propObj.dataType = parseType(propObj);
    propObj.required = (modelDef.required !== undefined && modelDef.required.includes(property));
  });

  const result = compiledTemplate(modelDef);
  const stream = fs.createWriteStream(path.join(outDirPath, fileName), { encoding: 'utf8' });
  stream.once('open', () => {
    stream.write(result);
    stream.close();
  });
};

module.exports = (hbsPath, outDirPath, key, openapispec) => createModel(hbsPath,
  outDirPath,
  key,
  openapispec);
