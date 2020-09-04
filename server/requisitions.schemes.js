const Joi = require('joi');

module.exports = {
  createScheme: Joi.object({
    clientName: Joi.string().trim().empty('').required(),
    carrier: Joi.object({
      firstName: Joi.string().empty('').trim().required(),
      lastName: Joi.string().empty('').trim().required(),
      patronymic: Joi.string().empty('').trim().required(),
      phone: Joi
        .string()
        .trim()
        .empty('')
        .pattern(/^[+\d]{1,3}[+\d]{10}$/)
        .required(),
      ati: Joi.number().integer().positive().required(),
    }),
    comments: Joi.string().empty('').trim(),
  }),
  updateScheme: Joi.object({
    clientName: Joi.string().trim().empty(''),
    carrier: Joi.object({
      firstName: Joi.string().empty('').trim(),
      lastName: Joi.string().empty('').trim(),
      patronymic: Joi.string().empty('').trim(),
      phone: Joi
        .string()
        .trim()
        .empty('')
        // регулярка на страны СНГ
        .pattern(/^[+\d]{1,3}[+\d]{10}$/)
        .required(),
      ati: Joi.number().integer().positive(),
    }),
    comments: Joi.string().empty('').trim(),
  }),
};
