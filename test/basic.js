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

  context('When set X-Foo header', function() {
    it('respond with foo.json', function(done) {
      request(app)
        .get('/api/users/1.json')
        .set('X-Foo', 'foo')
        .expect('Content-Type', /json/)
        .expect(200, '{"result":"x-foo"}\n')
        .end(done);
    });
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

  context('When set Content-Type header', function() {
    it('response with html', function(done) {
      request(app)
        .get('/api/users/2.html')
        .expect('Content-Type', 'text/html')
        .expect(200, '<body>id:2, name: foo</body>\n')
        .end(done);
    });
  });
});

describe('POST /api/users', function() {
  context('When set body name to n1', function() {
    it('should be n1.json', function(done) {
      request(app)
        .post('/api/users')
        .send({ name: 'n1' })
        .expect('Content-Type', /json/)
        .expect(201, '{"name":"n1"}\n')
        .end(done);
    });
  });

  context('When set query name to n2', function() {
    it('should be n2.json', function(done) {
      request(app)
        .post('/api/users?name=n2')
        .expect('Content-Type', /json/)
        .expect(201, '{"name":"n2"}\n')
        .end(done);
    });
  });

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

  context('When set body name to foo', function() {
    it('should be created.json', function(done) {
      request(app)
        .post('/api/users')
        .send({ name: 'foo' })
        .expect('Content-Type', /json/)
        .expect(201, '{"result":"ok"}\n')
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

describe('Response with js file', function() {
  it('should be return with result executed the js file.', function(done) {
    request(app)
      .post('/api/users/js')
      .send({ name: 'kazuhito hokamura', age: 30 })
      .expect('Content-Type', /json/)
      .expect(201, '{"name":"kazuhito hokamura","age":30}')
      .end(done);
  });

  context('when return promise object', function() {
    it('should wait to resolve the promise', function(done) {
      request(app)
        .post('/api/users/js_promise')
        .send({ name: 'kazuhito hokamura', age: 30 })
        .expect('Content-Type', /json/)
        .expect(201, '{"name":"kazuhito hokamura","age":30}')
        .end(done);
    });
  });
});
