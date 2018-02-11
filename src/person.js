let mobileNumbers = [
  {
    name: 'Arto Hellas',
    number: '040-123456',
    id: 1,
  },
  {
    name: 'Martti Tienari',
    number: '040-123456',
    id: 2,
  },
  {
    name: 'Arto Järvinen',
    number: '040-123456',
    id: 3,
  },
  {
    name: 'Lea Kutvonen',
    number: '040-123456',
    id: 4,
  },
];

const generateId = () => Math.floor(Number.MAX_SAFE_INTEGER * Math.random());

const allPersons = () => mobileNumbers;

const findById = (id) => {
  const numId = parseInt(id, 10);
  return mobileNumbers.find(p => p.id === numId);
};

const deleteById = (id) => {
  const person = findById(id);

  if (!person) {
    throw new Error(`cannot find person with id ${id}`);
  }

  mobileNumbers = mobileNumbers.filter(p => p.id !== person.id);

  return person;
};

const addOne = (name, number) => {
  if (!name || !number) {
    throw new Error('name or number invalid');
  }

  const oldPerson = mobileNumbers
    .find(p => p.name.toLowerCase() === name.toLowerCase());

  if (oldPerson) {
    throw new Error('name must be unique');
  }

  const newPerson = {
    name,
    number,
    id: generateId(),
  };

  mobileNumbers = mobileNumbers.concat(newPerson);
};


module.exports = {
  findById, addOne, deleteById, allPersons,
};
