module.exports = function(data) {
  return {
    status: data.body.name ? 201 : 422,
    json: {
      name: data.body.name,
      age: data.body.age
    }
  };
};
