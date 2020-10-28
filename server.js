const express = require('express');
const helmet = require('helmet')
const server = express();
const morgan = require('morgan')
const userRouter = require('./users/userRouter')

server.use(express.json())
server.use(morgan('tiny'))
server.use(helmet())
server.use('/api/users', userRouter)
server.use(logger)

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware

function logger(req, res, next) {
  console.log(`[${req.method} ${req.url} ${new Date().toISOString()}]`)
  next()
}

module.exports = server;
