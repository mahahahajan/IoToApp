var express = require('express');
var validator = require('express-validator');
var bodyParser = require('body-parser');
var useragent = require('express-useragent');
var app = express();



app.use(validator());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(useragent.express());

app.use('/', require('./routes/routes'));

app.use(express.static('www'));

var port = process.env.PORT || 5000;
app.listen(port, function () {
    console.log('Express server listening on port ' + port);
});