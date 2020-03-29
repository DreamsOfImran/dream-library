var BookInstance = require('../models/bookinstance')

// Display list of all BookInstances
exports.bookinstance_list = (req, res) => {
  res.send('Under construction: BookInstace List')
}

// Display Detail page for specific BookInstance
exports.bookinstance_detail = (req, res) => {
  res.send('Under construction: BookInstace Detail for: ' + req.params.id)
}

// Display BookInstance Create Form on GET
exports.bookinstance_create_get = (req, res) => {
  res.send('Under construction: BookInstace Create GET')
}

// Handle BookInstance Create on POST
exports.bookinstance_create_post = (req, res) => {
  res.send('Under construction: BookInstace Create POST')
}

// Display BookInstance Delete form on GET
exports.bookinstance_delete_get = (req, res) => {
  res.send('Under construction: BookInstace Delete GET')
}

// Handle BookInstance Delete on POST
exports.bookinstance_delete_post = (req, res) => {
  res.send('Under construction: BookInstace List')
}

// Display BookInstance Update form on GET
exports.bookinstance_update_get = function (req, res) {
  res.send('Under construction: BookInstace Update GET')
};

// Handle BookInstance Update on POST
exports.bookinstance_update_post = function (req, res) {
  res.send('Under construction: BookInstace Update POST')
};
