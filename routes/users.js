const usersRouter = require('express').Router();
const users = require('../models/users');

usersRouter.get('/', (req, res) => {
  const { language } = req.query;
  users.findUsers({ filters: { language } })
    .then((result) => {
      res.json(result);
    }).catch((err) => {
      res.send('Error retrieving users from database');
    })
})

usersRouter.get ('/:id', (req, res) => {
  users.findOne(req.params.id)
  .then((result) => {
    if (result[0].length) res.status(201).json(result[0]);
    else res.status(404).send('User not found');
  }).catch((err) => {
    res.send('Error retrieving data from database');
  })
});

usersRouter.post('/', (req, res) => {
  const error = users.validateData(req.body);
  if (error){
    res.status(422).json({ validationErrors: error.details });
  } else {
    users.createUser(req.body)
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      res.send('Error saving the user');
    })
}
})

usersRouter.put ('/:id', (req, res) => {
  const error = users.validateData(req.body, false);
  if (error) {
    res.status(422).json({ validationErrors: error.details });
  } else {
    users.findOne(req.params.id)
      .then ((user) => {
        if(user){
          users.updateUser(req.body, req.params.id)
          .then((result) => {
            res.status(200).json({ ...user[0][0], ...req.body });
          });
        return;
      }
      return res.status(404).json({ msg: 'User not found' })
    })
    .catch((err) => {
      res.status(500).send('Error updating the user');
    })
}
})

usersRouter.delete ('/:id', (req, res)=> {
  users.deleteUser(req.params.id)
  .then ((result)=> {
    res.json(result);
  })
  .catch ((err)=> { 
    res.send("Error deleting the user")
  })
})

module.exports = usersRouter;