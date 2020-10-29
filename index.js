require('dotenv').config()

const port = process.env.PORT || 4040
const server = require('./server.js');

server.listen(port, () => {
  console.log(`\n* Server Running on http://localhost:${port} *\n`);
});