const connection = require('../db-config');
const Joi = require('joi');

const validateData = (data, forCreation=true) => {
  const presence = forCreation ? 'required' : 'optional';
  return Joi.object({
    title: Joi.string().max(255).presence(presence),
    director: Joi.string().max(255).presence(presence),
    year: Joi.number().integer().min(1888).presence(presence),
    color: Joi.number().presence(presence).min(0),
    duration: Joi.number().integer().min(1).presence(presence),
  }).validate(data, { abortEarly: false }).error;
};

const findMany = ({ filters: { color, max_duration } }) => {
  let query = 'SELECT * FROM movies';
  const sqlValues = [];
  if (color && max_duration) {
    query += ' WHERE color = ? AND duration = ?';
    sqlValues.push(color, max_duration)
  } else if (color) {
    query += ' WHERE color = ?';
    sqlValues.push(color)
  } else if (max_duration) {
    query += ' WHERE duration < ?';
    sqlValues.push(max_duration)
  }
  return connection.promise().query(query, sqlValues)
    .then(([results]) => results)
};

const findId = (id) => {
  return connection.promise().query(
    'SELECT * FROM movies WHERE id = ?',
    [id])
    .then((results) => results)
}

const createMovie = ({title, director, year, color, duration }) => {
  return connexion.promise().query(
    'INSERT INTO movies(title, director, year, color, duration) VALUES (?, ?, ?, ?, ?)',
    [title, director, year, color, duration])
    .then(([result]) => {
      const id = result.insertId;
      return { id, title, director, year, color, duration };
    })
}

const updateMovie = (data, id) => {
  return connection.promise().query(
    'UPDATE movies SET ? WHERE id = ?',
    [data, id])
    .then((result) => result)
}

const deleteOne = (id) => {
  return connection.promise().query(
    'DELETE FROM movies WHERE id = ?',
    [id])
    .then((result) => 'Movie deleted successfully')
}
module.exports = {
  findMany,
  findId,
  validateData,
  createMovie,
  updateMovie,
  deleteOne
}