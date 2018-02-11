const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const {
  allPersons, addOne, findById, deleteById, updateById,
} = require('./src/person');

const app = express();

morgan.token('body', req => JSON.stringify(req.body));

app.use(morgan(':method :url :body :status ' +
  ':res[content-length] - :response-time ms'));

app.use(cors());
app.use(express.static('static'));
app.use(bodyParser.json());

const base = '/api';

const infoMessage = (numbers, date) => [
  `puhelinluettelossa on ${numbers.length} henkilön tiedot`,
  '',
  date.toString(),
].join('\n');

app.get(`${base}/persons`, (req, res) => {
  allPersons().then(persons => res.json(persons));
});

app.delete(`${base}/persons/:id`, (req, res) => {
  deleteById(req.params.id).then(() => {
    res.status(200).end('200');
  }).catch((e) => {
    res.status(400).json({ error: e.message });
  });
});

app.put(`${base}/persons/:id`, (req, res) => {
  const { name, number } = req.body;
  updateById(req.params.id, name, number).then(() => {
    res.status(200).end('200');
  }).catch((e) => {
    res.status(400).json({ error: e.message });
  });
});

app.post(`${base}/persons`, (req, res) => {
  const { name, number } = req.body;

  addOne(name, number).then(() => {
    res.status(200).end('200');
  }).catch((e) => {
    res.status(400).json({ error: e.message });
  });
});

app.get(`${base}/persons/:id`, (req, res) => {
  findById(req.params.id).then((person) => {
    res.json(person);
  }).catch(() => {
    res.status(404).end('404');
  });
});

app.get('/info', (req, res) => {
  allPersons().then((people) => {
    res.end(infoMessage(people, new Date()));
  }).catch((e) => {
    console.error(e);
  });
});

const listener = app.listen(process.env.PORT || 3001, () => {
  console.log('server started at port', listener.address().port);
});
