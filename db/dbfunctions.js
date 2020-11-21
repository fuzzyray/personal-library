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
const findOrCreateBook = (title, cb) => {
  cb(null, {msg: 'Not Implemented'});
};

const createComment = (comment, cb) => {
  cb(null, {msg: 'Not Implemented'});
};

// Read
const getBookByTitle = (title, cb) => {
  cb(null, {msg: 'Not Implemented'});
};

const queryCommentsByBookId = (bookId, cb) => {
  cb(null, {msg: 'Not Implemented'});
};

const getAllBooks = (cb) => {
  cb(null, {msg: 'Not Implemented'});
};
// Update

// Delete
const deleteBookById = (bookId, cb) => {
  cb(null, {msg: 'Not Implemented'});
};

const deleteAllBooks = (cb) => {
  cb(null, {msg: 'Not Implemented'});
};

exports.connect = connect;