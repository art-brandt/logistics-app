const Joi = require('joi');
const datastore = require('./requisitions.datastore');
const { createScheme, updateScheme } = require('./requisitions.schemes');

exports.create = async function create(req, res, next) {
  try {
    const body = await createScheme.validateAsync(req.body);
    const autoId = await datastore.getAutoId();
    const data = await datastore.insert({
      _id: autoId,
      ...body,
      createdAt: new Date(Date.now()).toISOString(),
    });
    res.status(201).json({ message: 'Created', data });
  } catch (error) {
    if (error.name === 'ValidationError') error.code = 400;
    next(error);
  }
};

exports.get = async function get(req, res, next) {
  try {
    const querySchema = Joi.object({
      page: Joi.number().default(1),
      perPage: Joi.number().default(10),
    });
    const { page, perPage } = await querySchema.validateAsync(req.query);
    const all = await datastore.count({ _id: { $ne: '__autoinc__' } });

    const data = await datastore
      .find({ _id: { $ne: '__autoinc__' } })
      .sort({ _id: 1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'OK',
      pagination: { page, perPage, all },
      data,
    });
  } catch (error) {
    next(error);
  }
};

exports.getById = async function getById(req, res, next) {
  try {
    const data = await datastore.findOne({ _id: parseInt(req.params.id, 10) });
    if (!data) {
      res.status(404).json({ message: 'Not Found' });
    } else {
      res.status(200).json({ message: 'OK', data });
    }
  } catch (error) {
    next(error);
  }
};

exports.update = async function update(req, res, next) {
  try {
    const body = await updateScheme.validateAsync(req.body);
    const data = await datastore.update(
      { _id: parseInt(req.params.id, 10) },
      { $set: body },
      { returnUpdatedDocs: true },
    );
    if (!data) {
      res.status(404).json({ message: 'Not Found' });
    } else {
      res.status(200).json({ message: 'Updated', data });
    }
  } catch (error) {
    next(error);
  }
};

exports.remove = async function remove(req, res, next) {
  try {
    const id = parseInt(req.params.id, 10);
    const numRemove = await datastore.remove({ _id: id });
    if (numRemove === 0) {
      res.status(404).json({ message: 'Not Found' });
    } else {
      res.status(200).json({ message: 'Removed', _id: id });
    }
  } catch (error) {
    next(error);
  }
};
