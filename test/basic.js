var request = require('supertest');
var http = require('http');
var connect = require('connect');
var bodyParser = require('body-parser');
var apimock = require('../index');
var app = connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(apimock('test/fixture/apimock.yml'));

describe('GET /api/users/1.json', function() {
  it('respond with json', function(done) {
    request(app)
      .get('/api/users/1.json')
      .expect(200, '{"id":1,"name":"foo"}\n')
      .end(done);
  });
});

describe('GET /api/users/2.json', function() {
  it('respond with json', function(done) {
    request(app)
      .get('/api/users/2.json')
      .expect(200, '{"id":2,"name":"bar"}\n')
      .end(done);
  });
});

describe('POST /api/users', function(){
  it('respond with json', function(done) {
    request(app)
      .post('/api/users')
      .expect(201, '{"result":"ok"}\n')
      .end(done);
  });
});
