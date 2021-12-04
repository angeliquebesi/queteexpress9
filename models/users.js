const connection = require('../db-config');
const Joi = require('joi');

const validateData = (data, forCreation = true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    email: Joi.string().email().max(255).presence(required),
    firstname: Joi.string().max(255).presence(required),
    lastname: Joi.string().max(255).presence(required),
    city: Joi.string().allow(null, '').max(255).presence(optional),
    language: Joi.string().allow(null, '').max(255).presence(optional),
  }).validate(data, { abortEarly : false}).error;
}

const findUsers = () => {
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
  return connexion.promise().query(
    'INSERT INTO users(firstname, lastname, email, city, language) VALUES (?, ?, ?, ?, ?)',
      [firstname, lastname, email, city, language])
      .then(([result]) => {
        const id = result.insertId;
        return {id, firstname, lastname, email, city, language}
      })
  }

const updateUser = (data, id) => {
  return connexion.promise().query(
    'UPDATE users SET ? WHERE id = ?',
    [data, id])
    .then((result) => result)
}

const deleteUser = (id) => {
  return connexion.promise().query(
    'DELETE FROM users WHERE id = ?',
    [userId])
    .then((result) => {
      res.send('User deleted successfully')})
}
module.exports = {
  findUsers,
  validateData,
  findOne,
  createUser,
  updateUser,
  deleteUser
}