const mongoose = require('mongoose');

const { MONGO_PATH } = process.env;

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
});

personSchema.statics.format = (person) => {
  const { number, name, _id } = person;

  return {
    number,
    name,
    id: _id,
  };
};

const Person = mongoose.model('person', personSchema);

mongoose.connect(MONGO_PATH).then(() => {
  console.log('connected to mongodb');
}, e => console.error(e));

const allPersons = () => {
  return Person.find().then(persons => persons.map(Person.format));
};

const findById = (id) => {
  return Person.findById(id).then(p => Person.format(p));
};

const updateById = (id, name, number) => {
  if (!name || !number) {
    Promise.reject(new Error('name or number invalid'));
  }

  return Person
    .findByIdAndUpdate(id, { name, number })
    .then(updated => updated);
};

const deleteById = (id) => {
  return findById(id).then((person) => {
    return Person.findByIdAndRemove(person.id);
  }).catch((e) => {
    console.error(e.message);

    throw new Error(`cannot find person with id ${id}`);
  });
};

const addOne = (name, number) => {
  const newPerson = new Person({
    name,
    number,
  });

  return Person.findOne({ name }).then((oldPerson) => {
    if (!name || !number) {
      throw new Error('name or number invalid');
    }

    if (oldPerson) {
      throw new Error('name must be unique');
    }
  }).then(() => {
    return newPerson.save(newPerson);
  }).catch((e) => {
    console.error(e.message);
    throw new Error(e.message);
  });
};


module.exports = {
  findById, addOne, deleteById, allPersons, updateById,
};
