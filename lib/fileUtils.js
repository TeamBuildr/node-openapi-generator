const fs = require('fs');
const util = require('util');

const readdir = util.promisify(fs.readdir);
const unlink = util.promisify(fs.unlink);

const clearDirectory = async (directory) => {
  try {
    const files = await readdir(directory);
    const unlinkPromises = files.map(filename => unlink(`${directory}/${filename}`));
    return await Promise.all(unlinkPromises);
  } catch (e) {
    console.log(e);
    return null;
  }
};

module.exports = {
  clearDirectory,
};
