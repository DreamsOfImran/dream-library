var Genre = require('../models/genre')
var Book = require('../models/book')
var async = require('async')
const validator = require('express-validator')

// Display list of all Genre
exports.genre_list = (req, res, next) => {
  Genre.find()
    .sort([['name', 'ascending']])
    .exec((err, list_genres) => {
      if (err) { return next(err) }
      res.render('genre_list', { title: 'Genre List', genre_list: list_genres })
    })
}

// Display detail page for a specific Genre
exports.genre_detail = (req, res, next) => {

  async.parallel({
    genre: (callback) => {
      Genre.findById(req.params.id)
        .exec(callback);
    },

    genre_books: (callback) => {
      Book.find({ 'genre': req.params.id })
        .exec(callback);
    },

  }, (err, results) => {
    if (err) { return next(err); }
    if (results.genre == null) {
      var err = new Error('Genre not found');
      err.status = 404;
      return next(err);
    }
    res.render('genre_detail', { title: 'Genre Detail', genre: results.genre, genre_books: results.genre_books });
  });
}

// Display Genre create form on GET
exports.genre_create_get = (req, res, next) => {
  res.render('genre_form', { title: 'Create Genre' })
}

// Handle Genre create on POST
exports.genre_create_post = [

  // Validate that the name field is not empty.
  validator.body('name', 'Genre name required').trim().isLength({ min: 1 }),

  // Sanitize (escape) the name field.
  validator.sanitizeBody('name').escape(),

  (req, res, next) => {
    const errors = validator.validationResult(req);

    var genre = new Genre(
      { name: req.body.name }
    );


    if (!errors.isEmpty()) {
      res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array() });
      return;
    }
    else {
      Genre.findOne({ 'name': req.body.name })
        .exec((err, found_genre) => {
          if (err) { return next(err); }

          if (found_genre) {
            res.redirect(found_genre.url);
          }
          else {
            genre.save((err) => {
              if (err) { return next(err); }
              res.redirect(genre.url);
            });

          }
        });
    }
  }
];

// Display Genre delete form on GET
exports.genre_delete_get = (req, res, next) => {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_books: function (callback) {
      Book.find({ 'genre': req.params.id }).exec(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.genre == null) { // No results.
      res.redirect('/catalog/genres');
    }
    // Successful, so render.
    res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books });
  });
}

// Handle Genre delete on POST
exports.genre_delete_post = (req, res) => {
  async.parallel({
    genre: function (callback) {
      Genre.findById(req.params.id).exec(callback);
    },
    genre_books: function (callback) {
      Book.find({ 'genre': req.params.id }).exec(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (results.genre_books.length > 0) {
      res.render('genre_delete', { title: 'Delete Genre', genre: results.genre, genre_books: results.genre_books });
      return;
    }
    else {
      Genre.findByIdAndRemove(req.body.id, function deleteGenre(err) {
        if (err) { return next(err); }
        res.redirect('/catalog/genres');
      });
    }
  });
}

// Display Genre update form on GET
exports.genre_update_get = (req, res) => {
  res.send('Under construction: Genre update GET')
}

// Handle Genre update on POST
exports.genre_update_post = (req, res) => {
  res.send('Under construction: Genre update POST')
}
