const myError = require('../libs/myError')

function cleanData(data){
  for(const key in data){
    if(typeof data[key] === 'string'){
      data[key] = data[key].trim()
    }
  }
  return data
}

function validatorHandler(schema, field = 'body') {
  return (req, res, next) => {
    let data = req[field];
    data = cleanData(data)
    const { error } = schema.validate(data, { abortEarly: false, allowUnknown: true });
    if (error) {
      next(myError(error, 400, error.details));
    }
    next();
  }
}

function validatorParamsHandler(schema) {
  return (req, res, next) => {
    let data = req.params;
    data = cleanData(data)
    const { error } = schema.validate(data, { abortEarly: true, allowUnknown: true });
    if (error) {
      next(myError(error, 400, error.details));
    }
    next();
  }
}

function validatorFiles(schema){
  return (req, res, next) => {
    const data = {
        files: req.files ? req.files.files : null,
    };
  
    const { error } = schema.validate(data);
  
    if (error) {
      next(myError(error, 400, error.details));
    }
    next();
  }
}

function validateFile(value, helpers){
  if (!value) {
      return helpers.error('any.required');
  }
  return value;
};

module.exports = { validatorHandler, validatorParamsHandler, validatorFiles, validateFile };