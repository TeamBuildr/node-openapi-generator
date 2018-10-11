#!/usr/bin/env node
const fileUtils = require('./lib/fileUtils');
const loadSource = require('./lib/loadsource');
const createModel = require('./lib/createModel');

const init = () => {

};

const run = async () => {
  init();
  const doc = loadSource.loadSourceSync('./openapi_source/teambuildr.yml');
  await fileUtils.clearDirectory('./output');
  console.log(doc);
  Object.keys(doc.components.schemas).forEach((key) => {
    console.log(doc.components.schemas[key]);
    createModel('./output', key, doc);
  });
};

run();
