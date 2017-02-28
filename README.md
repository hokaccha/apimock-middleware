# apimock-middleware

Node.js API Mocking middleware.

WITH ADDED DELAY PROPERTY.

inspired by [stubcell](https://github.com/yosuke-furukawa/stubcell)

## Install

```
$ npm install apimock-middleware
```

## Usage

server.js

```javascript
var http = require('http');
var connect = require('connect');
var bodyParser = require('body-parser');
var apimock = require('apimock-middleware');
var app = connect();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(apimock('apimock.yml'));

http.createServer(app).listen(3000);
```

apimock.yml

```yaml
- request:
    url: /api/users/:id.json
    method: GET
    delay: 300
  response:
    status: 200
    file: "json/users/<%= params.id %>.json"

- request:
    url: /api/users
    method: POST
  response:
    status: "<%= body.name ? 201 : 422 %>"
    file: "json/users/<%= body.name ? 'created' : 'failed' %>.json"
```
