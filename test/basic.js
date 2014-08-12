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
      .expect('Content-Type', /json/)
      .expect(200, '{"id":1,"name":"foo"}\n')
      .end(done);
  });
});

describe('GET /api/users/2.json', function() {
  it('respond with json', function(done) {
    request(app)
      .get('/api/users/2.json')
      .expect('Content-Type', /json/)
      .expect(200, '{"id":2,"name":"bar"}\n')
      .end(done);
  });
});

describe('POST /api/users', function() {
  context('When set body', function() {
    it('should be success', function(done) {
      request(app)
        .post('/api/users')
        .send({ name: 'foo' })
        .expect('Content-Type', /json/)
        .expect(201, '{"result":"ok"}\n')
        .end(done);
    });

    it('should failed', function(done) {
      request(app)
        .post('/api/users')
        .expect('Content-Type', /json/)
        .expect(422, '{"result":"error"}\n')
        .end(done);
    });
  });
});

describe('GET /api/foo', function() {
  it('should be 404', function(done) {
    request(app)
      .put('/api/foo')
      .expect(404)
      .end(done);
  });
});

describe('PUT /api/users', function() {
  it('should be 404', function(done) {
    request(app)
      .put('/api/users')
      .expect(404)
      .end(done);
  });
});
