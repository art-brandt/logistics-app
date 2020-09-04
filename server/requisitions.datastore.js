const Datastore = require('nedb-promises');

const requisitions = Datastore.create({
  filename: 'requisitions.db',
  autoload: true,
});

requisitions.setAutoincrementIdMode = async function setAutoincrementIdMode() {
  const docs = await this.find({ _id: '__autoinc__' });
  if (docs.length === 0) {
    requisitions.insert({ _id: '__autoinc__', value: 0 });
  }
};

requisitions.setAutoincrementIdMode();

requisitions.getAutoId = async function getAutoId() {
  const { value } = await this.update(
    { _id: '__autoinc__' },
    { $inc: { value: 1 } },
    { upsert: true, returnUpdatedDocs: true },
  );
  return value;
};

module.exports = requisitions;
