const express = require('express');
const auth = require('./lib/auth');
const app = express();


app.use(express.static('public'));

auth.init(`/`, app);
app.use('/', require('./routers/root'));

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});