require('dotenv').config()
const mongoose = require('mongoose');
const routes = require('./routes/index.js');

const app = require('express')();
const port = process.env.PORT;

require('./config/middleware.js')(app);

mongoose.Promise = global.Promise;
mongoose.connect(process.env.DB_HOST);

app.use('/', routes);

app.listen(port, () => {
  console.log("+---------------------------------------+");
  console.log("|                                       |");
  console.log(`|  [\x1b[34mSERVER\x1b[37m] Listening on port: \x1b[36m${port} 🤖  \x1b[37m |`);
  console.log("|                                       |");
  console.log("\x1b[37m+---------------------------------------+");
});