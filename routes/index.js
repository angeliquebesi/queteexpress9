const moviesRouter = require('./movies');
const userRouter = require('./users');

const setupRoutes = (app) => {
  app.use('/api/movies', moviesRouter);
  app.use ('/api/users', usersRouter);
};

module.exports = {
  setupRoutes,
};