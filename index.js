'use strict';

var fs = require('fs');
var qs = require('querystring');
var path = require('path');
var yaml = require('yamljs');
var paramify = require('paramify');
var parseurl = require('parseurl');
var _ = require('underscore');

module.exports = apimock;

function apimock(configPath) {
  if (configPath[0] !== '/') {
    configPath = path.join(process.cwd(), configPath);
  }

  var configDir = path.dirname(configPath);

  return function(req, res, next) {
    var routes = yaml.load(configPath);
    var url = parseurl(req);
    var query = qs.parse(url.query);
    var route = _.find(routes, function(_route) {
      var method = _route.request.method ? _route.request.method.toUpperCase() : 'GET';
      if (method !== req.method) return false;

      var match = paramify(url.pathname);
      if (!match(_route.request.url)) return false;
      req.params = match.params;

      if (_route.request.body) {
        return includeEqual(_route.request.body, req.body);
      }

      if (_route.request.query) {
        return includeEqual(_route.request.query, query);
      }

      if (_route.request.header) {
        return includeEqual(toLowerKeys(_route.request.header), req.headers);
      }

      return true;
    });

    if (!route) return next();

    var tmplParams = {
      body: req.body,
      params: req.params,
      query: query,
      header: req.headers
    };

    var filepath = _.template(path.join(configDir, route.response.file))(tmplParams);
    var handleRes = handleResponse.bind(null, res);

    res.setHeader('Content-Type', 'application/json; charset=utf-8');

    if (route.response.type === 'js') {
      delete require.cache[filepath];
      var fn = require(filepath);
      var result = fn(tmplParams);
      if (typeof result.then === 'function') {
        result.then(handleRes, next);
      }
      else {
        handleRes(result);
      }
    }
    else {
      fs.readFile(filepath, function(err, json) {
        if (err) return next(err);

        var status = route.response.status || 200;
        handleRes({
          status: _.template(status.toString())(tmplParams),
          json: json.toString()
        });
      });
    }
  };
}

// from https://github.com/yosuke-furukawa/stubcell/blob/master/lib/check.js
function includeEqual(small, large){
  if (small === large) return true;

  if (typeof small !== 'object' && typeof large !== 'object') {
    return small == large;
  }

  var attrs = Object.keys(small);
  for (var i = 0; i < attrs.length; i++) {
    var attr = attrs[i];
    if (!includeEqual(small[attr], large[attr])) return false;
  }

  return true;
}

function toLowerKeys(obj) {
  return _.chain(obj)
    .map(function(val, key) { return [key.toLowerCase(), val]; } )
    .object()
    .value();
}

function handleResponse(res, data) {
  var code = data.status || 200;
  var json = data.json;

  if (typeof json !== 'string') {
    json = JSON.stringify(json);
  }

  res.statusCode = code;
  res.end(json);
}
