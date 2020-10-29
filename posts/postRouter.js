const express = require('express');
const Posts = require('./postDb')
const router = express.Router();

router.get('/', (req, res, next) => {
  Posts.get(req.query)
  .then(post =>{
    res.status(200).json(post)
  })
  .catch(error => {
    next({message: error.message})
});
})

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

router.delete('/:id', validatePostId, (req, res, next) => {
  Posts.remove(req.params.id)
  .then(count => {
    res.status(200).json({ message: 'post was deleted'})
  })
  .catch(error => {
    next({message: error.message})
  })
});

router.put('/:id', validatePostId, (req, res, next) => {
  Posts.update(req.params.id, req.body)
  .then(post => {
    if (post){
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'post has not been found'})
    }
  })
  .catch(error => {
    // log error to server
    console.log(error);
    next({message: error.message})
  });
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params
  Posts.getById(id)
  .then(data => {
    if (data) {
     req.post = data
      next()
    } else {
      res.status(400).json({message: 'missing id'})
    }
  })
  .catch(error => {
    next({message: error.message})
  })
}

router.use((error, req, res, next) => {
  res.status(500).json({ message: error.message })
})

module.exports = router;
