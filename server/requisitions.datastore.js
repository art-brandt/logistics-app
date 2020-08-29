const Datastore = require('nedb-promises');

const requisitions = Datastore.create({
  filename: 'requisitions.db',
  autoload: true,
});

requisitions.find({ _id: '__autoinc__' })
  .then((docs) => {
    if (docs.length === 0) {
      requisitions.insert({ _id: '__autoinc__', value: 0 });
    }
  })

requisitions.getAutoId = async function () {
  try {
    const { value } = await this.update(
      { _id: '__autoinc__' },
      { $inc: { value: 1 } },
      { upsert: true, returnUpdatedDocs: true }
    );
    return value;
  } catch (error) {
    throw error;
  }
};

module.exports = requisitions;
