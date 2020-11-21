const mongoose = require('mongoose');

// Connect to Mongo
const connect = (dbURI) => {
  mongoose.connect(dbURI,
    {useNewUrlParser: true, useUnifiedTopology: true});
};

// Schema/Model
const BookSchema = mongoose.Schema({
  title: {type: String, required: true},
});

const Book = mongoose.model('Book', BookSchema);

const CommentSchema = new mongoose.Schema({
  book: {type: mongoose.Types.ObjectId, ref: 'Book', required: true},
  comment: {type: String, required: true},
});

const Comment = mongoose.model('Comment', CommentSchema);

// Create
const createOrFindBook = (title, cb) => {
  const newBook = new Book({title: title});
  Book.find({title: title}, (err, bookData) => {
    if (err) {
      cb(err, null);
    } else if (Array.isArray(bookData) && bookData.length) {
      cb(null, bookData[0]);
    } else {
      newBook.save((err, data) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, data);
        }
      });
    }
  });
};

const createComment = (bookId, comment, cb) => {
  getBookByBookId(bookId, (err, book) => {
    if (err) {
      cb(err, null);
    } else {
      const newComment = new Comment({book: book._id, comment: comment});
      newComment.save((err, data) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, data);
        }
      });
    }
  });
};

// Read
const getBookByBookId = (bookId, cb) => {
  Book.find({_id: bookId}, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data[0]);
    }
  });
};

const getCommentCountByBookId = (bookId, cb) => {
  Comment.countDocuments({book: bookId}, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
};

const getCommentsByBookId = (bookId, cb) => {
  Comment.find({book: bookId}, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      cb(null, data);
    }
  });
};

const getAllBooks = (cb) => {
  Book.find()
    .sort({title: 'ascending'})
    .exec((err, data) => {
      if (err) {
        cb(err, null);
      } else {
        cb(null, data);
      }
    });
};

// Update
const updateBookById = (bookId, cb) => {
  cb(null, {msg: 'Not Implemented'});
};

const updateCommentById = (commentId, cb) => {
  cb(null, {msg: 'Not Implemented'});
};

// Delete
const deleteBookById = (bookId, cb) => {
  Book.findByIdAndRemove(bookId, {useFindAndModify: false}, (err, book) => {
    if (err) {
      cb(err, null);
    } else {
      Comment.deleteMany({book: book._id}, (err, data) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, data);
        }
      });
    }
  });
};

const deleteAllBooks = (cb) => {
  Comment.deleteMany({}, (err, data) => {
    if (err) {
      cb(err, null);
    } else {
      Book.deleteMany({}, (err, data) => {
        if (err) {
          cb(err, null);
        } else {
          cb(null, data.deletedCount);
        }
      });
    }
  });
};

exports.connect = connect;
exports.createOrFindBook = createOrFindBook;
exports.getAllBooks = getAllBooks;
exports.getCommentsByBookId = getCommentsByBookId;
exports.getCommentCountByBookId = getCommentCountByBookId;
exports.deleteAllBooks = deleteAllBooks;
exports.getBookByBookId = getBookByBookId;
exports.createComment = createComment;
exports.deleteBookById = deleteBookById;