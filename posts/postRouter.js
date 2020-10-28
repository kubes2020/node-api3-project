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

router.get('/:id', (req, res) => {
  // do your magic!
});

router.post('/', (req, res) => { //validatePost
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

// custom middleware

function validatePostId(req, res, next) {
  // do your magic!
}

module.exports = router;
