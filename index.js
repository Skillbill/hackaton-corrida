const express = require('express');
const auth = require('./lib/auth');
const database = require('./lib/database');
const bodyParser = require('body-parser');
const app = express();

database.init();

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

auth.init(`/api`, app);
app.use('/api', require('./routers/root'));

const port = process.env.PORT || 3000;

app.listen(port, function () {
  console.log(`corrida is listening on port ${port}!`);
});