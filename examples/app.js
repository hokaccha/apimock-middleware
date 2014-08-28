var http = require('http');
var connect = require('connect');
var bodyParser = require('body-parser');
var apimock = require('../index');
var app = connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(apimock('../test/fixture/apimock.yml'));

http.createServer(app).listen(3333);
