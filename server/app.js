const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
  res.status(200).json({ message: 'OK' });
});

app.use((req, res) => {
  res.status(404).json({ message: 'Not Found' })
});

app.listen(PORT, (err) => {
  if (err) console.error(err);
  console.log(`Server started at localhost:${PORT}`)
});

