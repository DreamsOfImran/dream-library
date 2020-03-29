var Author = require('../models/author')

// Display list of all authors
exports.author_list = (req, res) => {
  res.send('Under construction: Authors List')
}

// Display detail page for a specific author
exports.author_detail = (req, res) => {
  res.send('Under construction: Author Detail for: ' + req.params.id)
}

// Display Author Create form on GET
exports.author_create_get = (req, res) => {
  res.send('Under construction: Author Create Get')
}

// Handle Author create on POST
exports.author_create_post = (req, res) => {
  res.send('Under construction: Author Create POST')
}

// Display Author Delete on GET
exports.author_delete_get = (req, res) => {
  res.send('Under construction: Author Delete GET')
}

// Handle Author delete on POST
exports.author_delete_post = (req, res) => {
  res.send('Under construction: Author Delete POST')
}

// Display Author update form on GET
exports.author_update_get = (req, res) => {
  res.send('Under construction: Author Update GET')
}

// Handle Author Update on POST
exports.author_update_post = (req, res) => {
  res.send('Under construction: Author Update POST')
}
