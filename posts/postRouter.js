const express = require('express');
const Posts = require('./postDb')
const router = express.Router();

router.get('/', (req, res) => {
  Posts.get(req.query)
  .then(post =>{
    res.status(200).json(post)
  })
  .catch(error => {
    res.status(500).json({ message: error.message })
  })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post)
});

////////////////

router.post('/', validatePost, (req, res) => { 
  res.status(201).json(req.body.text)
})


router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.params.id)
  .then(count => {
    res.status(200).json({ message: 'post was deleted'})
  })
  .catch(error => {
    res.status(500).json({message: error.message})
  })
});

router.put('/:id', validatePostId, (req, res) => {
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
    res.status(500).json({
      message: 'Error updating the hub',
    });
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
    res.status(500).json({ message: error.message })
  })
}

function validatePost(req, res, next) {
  const { text } = req.body
  if(!text){
    res.status(400).json({message: 'text is required'})
  } else {
    next()
  }
}

module.exports = router;
