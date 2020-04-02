var BookInstance = require('../models/bookinstance')
var Book = require('../models/book')
var async = require('async')
const { body, validationResult } = require('express-validator/check')
const { sanitizeBody } = require('express-validator/filter')

// Display list of all BookInstances
exports.bookinstance_list = (req, res, next) => {

  BookInstance.find()
    .populate('book')
    .exec((err, list_bookinstances) => {
      if (err) { return next(err); }
      res.render('bookinstance_list', { title: 'Book Instance List', bookinstance_list: list_bookinstances });
    });

};

// Display Detail page for specific BookInstance
exports.bookinstance_detail = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) { return next(err); }
      if (bookinstance == null) {
        var err = new Error('Book copy not found');
        err.status = 404;
        return next(err);
      }
      res.render('bookinstance_detail', { title: 'Copy: ' + bookinstance.book.title, bookinstance: bookinstance });
    })
}

// Display BookInstance Create Form on GET
exports.bookinstance_create_get = (req, res, next) => {
  Book.find({}, 'title')
    .exec((err, books) => {
      if (err) { return next(err); }
      res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books });
    });
}

// Handle BookInstance Create on POST
exports.bookinstance_create_post = [

  // Validate fields.
  body('book', 'Book must be specified').trim().isLength({ min: 1 }),
  body('imprint', 'Imprint must be specified').trim().isLength({ min: 1 }),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status').trim().escape(),
  sanitizeBody('due_back').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var bookinstance = new BookInstance(
      {
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back
      });

    if (!errors.isEmpty()) {
      Book.find({}, 'title')
        .exec((err, books) => {
          if (err) { return next(err); }
          res.render('bookinstance_form', { title: 'Create BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
        });
      return;
    }
    else {
      bookinstance.save((err) => {
        if (err) { return next(err); }
        res.redirect(bookinstance.url);
      });
    }
  }
];

// Display BookInstance Delete form on GET
exports.bookinstance_delete_get = (req, res, next) => {
  BookInstance.findById(req.params.id)
    .populate('book')
    .exec((err, bookinstance) => {
      if (err) { return next(err); }
      if (bookinstance == null) {
        res.redirect('/catalog/bookinstances');
      }
      res.render('bookinstance_delete', { title: 'Delete BookInstance', bookinstance: bookinstance });
    })
}

// Handle BookInstance Delete on POST
exports.bookinstance_delete_post = (req, res, next) => {
  BookInstance.findByIdAndRemove(req.body.id, function deleteBookInstance(err) {
    if (err) { return next(err); }
    res.redirect('/catalog/bookinstances');
  });
}

// Display BookInstance Update form on GET
exports.bookinstance_update_get = (req, res, next) => {
  async.parallel({
    bookinstance: function (callback) {
      BookInstance.findById(req.params.id).populate('book').exec(callback)
    },
    books: function (callback) {
      Book.find(callback)
    },

  }, function (err, results) {
    if (err) { return next(err); }
    if (results.bookinstance == null) {
      var err = new Error('Book copy not found');
      err.status = 404;
      return next(err);
    }
    res.render('bookinstance_form', { title: 'Update  BookInstance', book_list: results.books, selected_book: results.bookinstance.book._id, bookinstance: results.bookinstance });
  });
};

// Handle BookInstance Update on POST
exports.bookinstance_update_post = [
  // Validate fields.
  body('book', 'Book must be specified').isLength({ min: 1 }).trim(),
  body('imprint', 'Imprint must be specified').isLength({ min: 1 }).trim(),
  body('due_back', 'Invalid date').optional({ checkFalsy: true }).isISO8601(),

  // Sanitize fields.
  sanitizeBody('book').escape(),
  sanitizeBody('imprint').escape(),
  sanitizeBody('status').escape(),
  sanitizeBody('due_back').toDate(),

  (req, res, next) => {
    const errors = validationResult(req);

    var bookinstance = new BookInstance(
      {
        book: req.body.book,
        imprint: req.body.imprint,
        status: req.body.status,
        due_back: req.body.due_back,
        _id: req.params.id
      });

    if (!errors.isEmpty()) {
      Book.find({}, 'title')
        .exec(function (err, books) {
          if (err) { return next(err); }
          res.render('bookinstance_form', { title: 'Update BookInstance', book_list: books, selected_book: bookinstance.book._id, errors: errors.array(), bookinstance: bookinstance });
        });
      return;
    }
    else {
      BookInstance.findByIdAndUpdate(req.params.id, bookinstance, {}, function (err, thebookinstance) {
        if (err) { return next(err); }
        res.redirect(thebookinstance.url);
      });
    }
  }
];
