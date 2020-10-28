const express = require('express');
const Users = require('./userDb')
const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(error => {
    res.status(500).json({message: error.message })
  })
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  Users.get(req.query)
  .then(users => {
    res.status(200).json(users)
  })
  .catch(error => {
    res.status(500).json({ 
      message: error.message, stack: error.stack
    })
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', (req, res) => {
  const { id } = req.params
  Users.getUserPosts(id)
  .then(posts => {
    if (posts){
      res.status(200).json(posts)
    } else {
      res.status(404).json({message: 'posts not found'})
    }
  })
  .catch(error => {
    res.status(500).json({message: error.message, stack: error.stack })
  })
});

router.delete('/:id', validateUserId, (req, res) => {
  Users.remove(req.params.id)
  .then(count => {
    res.status(200).json({message: 'user has been deleted'})
  })
  .catch(error => {
    res.status(500).json({message: error.message, stack: error.stack })
  })
});

router.put('/:id', (req, res) => {
  const {id} = req.params
  const changes = req.body
  console.log("req.body", req)
  Users.update(id, changes)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(error => {
    res.status(500).json({message: error.message, stack: error.stack})
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params
  Users.getById(id)
  .then(data => {
    if (data){
      req.user = data
      next()
    } else {
      res.status(400).json({message: 'invalid user id'})
    }
  })
  .catch(error => {
    console.log(error.message)
    res.status(404).json({message: 'user id not found'})
  })
}

function validateUser(req, res, next) {
  const { name, id } = req.body
  if (!Object.keys(req.body)) {
    res.status(400).json({message: "missing user data" })
  } else if (!name) {
      res.status(400).json({message: "missing user name" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  // do your magic!
}

module.exports = router;
