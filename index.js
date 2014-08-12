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
    var route = _.find(routes, function(_route) {
      var method = _route.request.method ? _route.request.method.toUpperCase() : 'GET';
      if (method !== req.method) return false;

      var match = paramify(url.pathname);
      if (match(_route.request.url)) {
        req.params = match.params;
        return true;
      }
      else {
        return false;
      }
    });

    if (route) {
      var tmplParams = {
        body: req.body,
        params: req.params,
        query: qs.parse(url.query)
      };

      var jsonPath = _.template(path.join(configDir, route.response.file), tmplParams);

      if (!fs.existsSync(jsonPath)) return next();
      fs.readFile(jsonPath, function(err, json) {
        if (err) return next(err);
        res.statusCode = route.response.status ? _.template(route.response.status.toString(), tmplParams) : 200;
        res.end(json);
      });
    }
    else {
      next();
    }
  };
}
