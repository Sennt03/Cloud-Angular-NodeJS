const Joi = require('joi');
const { validatorHandler } = require('../../middlewares/validatorHandlers')

const password = Joi.string().min(8);
const actual =Joi.string()

const changePasswordSchema = Joi.object({
  actual: actual.required(),
  newPassword: password.required()
})

const changePasswordValidator = validatorHandler(changePasswordSchema)

module.exports = { changePasswordValidator }