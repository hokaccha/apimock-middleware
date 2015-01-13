var Promise = require('bluebird');

module.exports = function(data) {
  return new Promise(function(resolve, reject) {
    resolve({
      status: data.body.name ? 201 : 422,
      json: {
        name: data.body.name,
        age: data.body.age
      }
    });
  });
};
