const express = require('express');
const Users = require('./userDb')
const router = express.Router();
const Posts = require('../posts/postDb')

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
  .then(user => {
    res.status(201).json(user)
  })
  .catch(error => {
    res.status(500).json({message: error.message })
  })
});

router.post('/:id/posts', validatePost, (req, res, next) => {
    const postInfo = { ...req.body, user_id: req.params.id }
    Posts.insert(postInfo)
    .then(post => {
      res.status(201).json(post)
    })
    .catch(error => {
      next({message: error.message})
    })
});

router.get('/', (req, res, next) => {
  Users.get(req.query)
  .then(users => {
    res.status(200).json(users)
  })
  .catch(error => {
    next({message: error.message})
  })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user)
});

router.get('/:id/posts', (req, res, next) => {
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
    next({message: error.message})
  })
});

router.delete('/:id', validateUserId, (req, res, next) => {
  Users.remove(req.params.id)
  .then(count => {
    res.status(200).json({message: 'user has been deleted'})
  })
  .catch(error => {
    next({message: error.message})
  })
});

router.put('/:id', (req, res, next) => {
  const {id} = req.params
  const changes = req.body
  console.log("req.body", req)
  Users.update(id, changes)
  .then(user => {
    res.status(200).json(user)
  })
  .catch(error => {
    next({message: error.message})
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
  const { name } = req.body
  if (!Object.keys(req.body)) {
    res.status(400).json({message: "missing user data" })
  } else if (!name) {
      res.status(400).json({message: "missing user name" })
  } else {
    next()
  }
}

function validatePost(req, res, next) {
  const { text } = req.body
  if (!Object.keys(req.body)) {
    res.status(400).json({message: "missing post data" })
  } else if (!text) {
      res.status(400).json({message: "missing text" })
  } else {
    next()
  }
}

router.use((error, req, res, next) => {
  res.status(500).json({ message: error.message })
})

module.exports = router;
