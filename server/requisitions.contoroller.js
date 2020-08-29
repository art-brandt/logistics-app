exports.create = async function(req, res, next) {
  try {
    res.status(201).json({ message: 'Created' });
  } catch (error) {
    next(error)
  }
};

exports.get = async function (req, res, next) {
  try {
    res.status(200).json({ message: 'OK' });
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