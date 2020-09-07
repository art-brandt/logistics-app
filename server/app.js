const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const requisitionsRouter = require('./requisitions.router');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan('tiny'));

app.use('/requisitions', requisitionsRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

app.use((err, _req, res, next) => {
  if (err) {
    res
      .status(err.code || 500)
      .json({ message: err.message });
  } else {
    next();
  }
});

app.listen(PORT, (error) => {
  if (error) process.stdout.write(error.concat('\n'));
  process.stdout.write(`Server started at localhost:${PORT}\n`);
});
