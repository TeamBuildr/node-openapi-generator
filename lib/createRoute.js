const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
const fileUtils = require('./fileUtils');

const validActions = ['delete', 'get', 'patch', 'post', 'put'];

handlebars.registerHelper('is', (a, b, opts) => {
  if (a === b) return opts.fn(this);
  return opts.inverse(this);
});

const createRoute = async (hbsPath, outDirPath, key, openapispec) => {
  const pathParts = key.split('/');
  const fileName = `${pathParts[pathParts.length - 1].charAt(0).toLowerCase()}${pathParts[pathParts.length - 1].slice(1)}.js`;
  const template = fs.readFileSync(hbsPath).toString('utf-8');
  const compiledTemplate = handlebars.compile(template);

  const routeDef = openapispec.paths[key];
  routeDef.fileName = fileName;
  routeDef.methods = [];
  Object.keys(routeDef).forEach((action) => {
    if (validActions.includes(action)) {
      const openapiPathObj = routeDef[action];
      let scope = '';
      if (Array.isArray(openapiPathObj.security)
        && openapiPathObj.security.find(o => o && o.OAuth)) {
        scope = openapiPathObj.security.find(o => o && o.OAuth).OAuth.join(',');
      }

      routeDef.methods.push({
        action,
        name: openapiPathObj.operationId,
        scope,
      });
    }
  });

  let joinPath = outDirPath;
  for (let i = 1; i < pathParts.length - 1; i += 1) {
    joinPath += path.sep + pathParts[i];
  }
  if (!fs.existsSync(joinPath)) {
    fileUtils.mkDirByPathSync(joinPath);
  }
  joinPath += path.sep + fileName;

  const result = compiledTemplate(routeDef);
  const stream = fs.createWriteStream(joinPath, { encoding: 'utf8' });
  stream.once('open', () => {
    stream.write(result);
    stream.close();
  });
};

module.exports = (hbsPath, outDirPath, key, openapispec) => createRoute(
  hbsPath,
  outDirPath,
  key,
  openapispec,
);
