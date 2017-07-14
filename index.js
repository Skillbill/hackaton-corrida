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

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});