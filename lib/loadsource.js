const fs = require('fs');
const yaml = require('js-yaml');

const loadSourceSync = (filePath) => {
  const doc = yaml.safeLoad(fs.readFileSync(filePath));
  return doc;
};

module.exports = {
  loadSourceSync,
};
