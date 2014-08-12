# connect-apimock

connect middleware for API Mocking.

inspired by [stubcell](https://github.com/yosuke-furukawa/stubcell)

## Usage 

server.js

```javascript
var http = require('http');
var connect = require('connect');
var apimock = require('apimock');
var app = connect();

app.use(apimock('apimock.yml'));
http.createServer(app).listen(3000);
```

apimock.yml

```yaml
-
  request:
    url: /api/users/:id.json
    method: GET
  response:
    status: 200
    file: json/users/<%= params.id %>.json
-
  request:
    url: /api/users
    method: POST
  response:
    status: 201
    file: json/users/created.json
```
