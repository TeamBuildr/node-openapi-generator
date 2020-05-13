const mapType = (openapiType) => {
  if (openapiType === null || openapiType === undefined) {
    return 'Object';
  }

  const type = openapiType.toLowerCase();
  switch (type) {
    case 'integer':
      return 'Integer';
    case 'number':
      return 'Number';
    case 'string':
      return 'String';
    default:
      return 'Object';
  }
};

module.exports = openapiType => mapType(openapiType);
