const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const {
  allPersons, addOne, findById, deleteById,
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
  res.json(allPersons());
});

app.delete(`${base}/persons/:id`, (req, res) => {
  try {
    deleteById(req.params.id);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }

  res.status(200).end('200');
});

app.post(`${base}/persons`, (req, res) => {
  const { name, number } = req.body;

  try {
    addOne(name, number);
  } catch (e) {
    res.status(400).json({ error: e.message });
    return;
  }

  res.status(200).end('200');
});

app.get(`${base}/persons/:id`, (req, res) => {
  const person = findById(req.params.id);

  if (!person) {
    res.status(404).end('404');
    return;
  }

  res.json(person);
});

app.get('/info', (req, res) => {
  res.end(infoMessage(allPersons(), new Date()));
});

app.listen(process.env.PORT || 3001, () => console.log('server listening'));
