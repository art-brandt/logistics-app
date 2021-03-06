const datastore = require('./requisitions.datastore');

const requisition = {
  clientName: 'ООО "Фрукты и Овощи"',
  carrier: {
    firstName: 'Иван',
    patronymic: 'Иванович',
    lastName: 'Иванов',
    phone: '+79052671294',
    ati: 12345,
  },
  comments: 'Задача организации в формировании соответствующий условий активизации.',
};

const mocks = new Array(50).fill(requisition);

mocks.forEach(async (data) => {
  const autoId = await datastore.getAutoId();
  await datastore.insert({
    _id: autoId,
    ...data,
    createdAt: new Date(Date.now()).toISOString(),
  });
});

process.stdout.write('migrate ok\n');
