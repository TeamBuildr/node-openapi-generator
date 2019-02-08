const del = require('del');
const fs = require('fs');
const nodeDir = require('node-dir');
const path = require('path');
const util = require('util');

const clearDirectory = async (directory) => {
  try {
    const dirStr = util.isString(directory) ? directory : path.format(directory);
    return del([`${dirStr}/*`]);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const getAllFilePaths = async (directory) => {
  try {
    const dirStr = util.isString(directory) ? directory : path.format(directory);
    return nodeDir.promiseFiles(dirStr);
  } catch (e) {
    console.log(e);
    return null;
  }
};

const mkDirByPathSync = (targetDir, { isRelativeToScript = false } = {}) => {
  const { sep } = path;
  const initDir = path.isAbsolute(targetDir) ? sep : '';
  const baseDir = isRelativeToScript ? __dirname : '.';

  return targetDir.split(sep).reduce((parentDir, childDir) => {
    const curDir = path.resolve(baseDir, parentDir, childDir);
    try {
      fs.mkdirSync(curDir);
    } catch (err) {
      if (err.code === 'EEXIST') { // curDir already exists!
        return curDir;
      }

      // To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
      if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
        throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
      }

      const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
      if (!caughtErr || (caughtErr && curDir === path.resolve(targetDir))) {
        throw err; // Throw if it's just the last created dir.
      }
    }

    return curDir;
  }, initDir);
};

module.exports = {
  clearDirectory,
  getAllFilePaths,
  mkDirByPathSync,
};
