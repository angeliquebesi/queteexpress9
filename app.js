const connexion = require('./db-config');
const express = require('express');
const Joi = require('joi');
const app = express();
const { setupRoutes } = require('./routes');

setupRoutes(app);

const port = process.env.PORT || 3000;

connexion.connect((err) => {
  if (err) {
    console.error('error connecting' + err.stack)
  } else {
    console.log('connected as id ' + connexion.threadId)
  }
})

app.use(express.json());

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});