const Joi = require('joi');

module.exports = {
  createScheme: Joi.object({
    clientName: Joi.string().trim().empty('').required(),
    carrier: Joi.object({
      firstName: Joi.string().empty('').trim().required(),
      lastName: Joi.string().empty('').trim(),
      patronymic: Joi.string().empty('').trim(),
      phone: Joi
        .string()
        .trim()
        .empty('')
        // регулярка на страны СНГ
        .pattern(/^[+\d]{1,3}[+\d]{10}$/)
        .required(),
      ati: Joi.number().integer()
    }),
    comments: Joi.string().empty('').trim(),
  })
}