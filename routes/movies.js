// Create the router object that will manage all operations on movies
const moviesRouter = require('express').Router();
// Import the movie model that we'll need in controller functions
const Movie = require('../models/movie');

// GET /api/movies/
moviesRouter.get('/', (req, res) => {
  const { max_duration, color } = req.query;
  Movie.findMany({ filters: { max_duration, color } })
    .then((movies) => {
      res.json(movies);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error retrieving movies from database');
    });
});

moviesRouter.get('/:id', (req, res) => {
  Movies.findOne(req.params.id)
    .then((result) => {
      if (result[0].length) res.status(201).json(result[0]);
      else res.status(404).send('Movie not found');
    }).catch((err) => {
      res.send('Error retrieving data from database');
    })
});
moviesRouter.post ('/', (req, res) => {
  const error = validateData(req.body);
  console.log(error)
  if (error) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    Movies.createMovie(req.body)
      .then((result) => {
        res.send(result);
      })
      .catch((err) => {
        res.send('Error saving the movie');
      })
  }
})

moviesRouter.put ('/:id', (req, res) => {
  const error = validateData(req.body, false)
  console.log(error)
  if (error) {
    res.status(422).json({ validationErrors: error.details })
  } else {
    Movies.findOne(req.params.id)
      .then((movie) => {
        if (movie) {
          existingMovie = movie;
          console.log("Updating")
          Movies.updateOne(req.body, req.params.id)
            .then((result) => {
              res.status(200).json({ ...movie[0][0], ...req.body });
            });
          return;
        }
        return res.status(404).json({ msg: 'Record not found' })
      })
      .catch((err) => {
        res.status(500).send('Error updating the movie');
      })
  }
})

moviesRouter.delete("/:id", (req, res) => {
  Movies.deleteOne(req.params.id)
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      res.send('Error deleting movies from database');
    })
});

module.exports = moviesRouter;