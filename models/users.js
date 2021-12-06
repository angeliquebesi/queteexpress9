const connection = require('../db-config');
const Joi = require('joi');

const validateData = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    email: Joi.string().email().max(255).presence(presence),
    firstname: Joi.string().max(255).presence(presence),
    lastname: Joi.string().max(255).presence(presence),
    city: Joi.string().allow(null, '').max(255).presence(presence),
    language: Joi.string().allow(null, '').max(255).presence(presence),
  }).validate(data, { abortEarly : false}).error;
}

const findUsers = ({filters:{language}}) => {
  let query = 'SELECT * FROM users';
  let sqlValues = [];
  if (language) {
    query += ' WHERE language = ?';
    sqlValues.push(language);
  }
  return connection.promise().query(query, sqlValues)
    .then(([results]) => {
      console.log(results);
      return results;
    })
};

const findOne = (id) => {
  return connection.promise().query(
    'SELECT * FROM users WHERE id = ?',
    [id])
    .then((results) => results)
}

const createUser = ({firstname, lastname, email, city, language}) => {
  return connection.promise().query(
    'INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, email, city, language])
      .then(([result]) => {
        const id = result.insertId;
        return {id, firstname, lastname, email, city, language}
      })
  }

const updateUser = (data, id) => {
  return connection.promise().query(
    'UPDATE users SET ? WHERE id = ?',
    [data, id])
    .then((result) => result)
}

const deleteUser = (id) => {
  return connection.promise().query(
    'DELETE FROM users WHERE id = ?',
    [id])
    .then((result) => 'User deleted successfully')
}
module.exports = {
  findUsers,
  validateData,
  findOne,
  createUser,
  updateUser,
  deleteUser
}