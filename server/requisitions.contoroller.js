const Joi = require('joi');
const datastore = require('./requisitions.datastore');
const { createScheme } = require('./requisitions.schemes');

exports.create = async function(req, res, next) {
  try {
    const body = await createScheme.validateAsync(req.body);
    const autoId = await datastore.getAutoId();
    const data = await datastore.insert({
      _id: autoId,
      ...body,
      createdAt: new Date(Date.now()).toISOString()
    });
    res.status(201).json({ message: 'Created', data });
  } catch (error) {
    next(error)
  }
};

exports.get = async function (req, res, next) {
  try {
    const querySchema = Joi.object({
      page: Joi.number().default(1),
      perPage: Joi.number().default(10),
    });
    const { page, perPage }  = await querySchema.validateAsync(req.query);
    const all = await datastore.count({ _id: { $ne: '__autoinc__' } });

    const data = await datastore
      .find({ _id: { $ne: '__autoinc__' } })
      .sort({ _id: 1 })
      .skip(page === 1 ? 0 : ((page - 1) * perPage))
      .limit(perPage);

    res.status(200).json({ 
      message: 'OK',
      pagination: { page, perPage, all },
      data
    });
  } catch (error) {
    next(error)
  }
};

exports.getById = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'OK' });
  } catch (error) {
    next(error)
  }
};

exports.update = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Updated' });
  } catch (error) {
    next(error)
  }
};

exports.remove = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'Removed' });
  } catch (error) {
    next(error)
  }
};