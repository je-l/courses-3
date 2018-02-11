const mongoose = require('mongoose');

const { MONGO_PATH } = process.env;

const Person = mongoose.model('person', {
  name: String,
  number: String,
});

const addNewPerson = (name, number) => {
  const newPerson = new Person({ name, number });

  return newPerson.save()
    .then(() => {
      console.log(`lisätään henkilö ${name} numero ${number} luetteloon`);
    });
};

const printAllPeople = () => {
  return Person.find()
    .then((people) => {
      const print = people.map(p => `${p.name} ${p.number}`).join('\n');
      console.log(print);
    });
};

mongoose.connect(MONGO_PATH).then(() => {
  const [,, newName, newNumber] = process.argv;

  if (newName && newNumber) {
    return addNewPerson(newName, newNumber);
  }

  return printAllPeople();
}).then(() => {
  mongoose.connection.close();
}).catch(e => console.error(e));

