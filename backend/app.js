const express = require("express");
const bodyParser = require("body-parser");
const db = require("./queries");

const userRoutes = require('./routes/user');
const flatsRoutes = require('./routes/flats');
const feedbacksRoutes = require('./routes/feedbacks');
const addressesRoutes = require('./routes/addresses');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.get('/',(req, res, next) => {
  res.json({message: 'work'});
});

app.use('/api/addresses', addressesRoutes);

app.use('/api/user',userRoutes);

app.use('/api/flats',flatsRoutes);

app.use('/api/feedbacks', feedbacksRoutes);

module.exports = app;
