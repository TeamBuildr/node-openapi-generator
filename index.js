#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const fileUtils = require('./lib/fileUtils');
const loadSource = require('./lib/loadsource');
const createModel = require('./lib/createModel');
const createRoute = require('./lib/createRoute');

const init = () => {

};

const run = async () => {
  init();

  const inputPath = path.parse('./template/node');
  const outputPath = path.parse('./output');

  const doc = loadSource.loadSourceSync('./openapi_source/teambuildr.yml');
  await fileUtils.clearDirectory(outputPath);
  const filePaths = await fileUtils.getAllFilePaths(inputPath);
  console.log(filePaths);

  filePaths.forEach((p) => {
    const pathObj = path.parse(p);

    // Create an output directory matching the path directory under the output folder if it
    // does not exist.
    const inputPathStr = path.normalize(path.format(inputPath));
    const outputPathStr = path.join(path.format(outputPath), path.normalize(path.format(pathObj)).replace(inputPathStr, ''));
    const outputPathObj = path.parse(outputPathStr);
    const outputPathDir = outputPathObj.dir;
    if (!fs.existsSync(outputPathDir)) {
      try {
        fileUtils.mkDirByPathSync(outputPathDir);
      } catch (e) {
        console.log(e);
      }
    }

    if (outputPathObj.base === 'model.hbs') {
      Object.keys(doc.components.schemas).forEach((key) => {
        createModel(p, outputPathDir, key, doc);
      });
    }

    if (outputPathObj.base === 'route.hbs') {
      Object.keys(doc.paths).forEach((key) => {
        createRoute(p, outputPathDir, key, doc);
      });
    }
  });


  // Object.keys(doc.components.schemas).forEach((key) => {
  //   console.log(doc.components.schemas[key]);
  //   createModel('./output', key, doc);
  // });
};

run();
