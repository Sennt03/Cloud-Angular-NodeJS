const Joi = require('joi');
const { validatorHandler, validateFile, validatorFiles, validatorParamsHandler } = require('../../middlewares/validatorHandlers')

const pathSchema = Joi.object({
  path: Joi.string().required()
});

const nameSchema = Joi.object({
  name: Joi.string().required().regex(/^[a-zA-Z0-9\s-._@!()]+$/)
});

const newPathSchema = Joi.object({
  newPath: Joi.string().required()
});

const uploadFileSchema = Joi.object({
  files: Joi.any().custom(validateFile, 'File required').required()
});

const pathValidator = validatorParamsHandler(pathSchema)
const nameValidator = validatorHandler(nameSchema)
const uploadFileValidator = validatorFiles(uploadFileSchema)
const newPathValidator = validatorHandler(newPathSchema)

module.exports = { pathValidator, nameValidator, uploadFileValidator, newPathValidator }