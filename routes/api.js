/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const createOrFindBook = require('../db/dbfunctions').createOrFindBook;
const getAllBooks = require('../db/dbfunctions').getAllBooks;
const getBookByBookId = require('../db/dbfunctions').getBookByBookId;
const getCommentCountByBookId = require(
  '../db/dbfunctions').getCommentCountByBookId;
const getCommentsByBookId = require('../db/dbfunctions').getCommentsByBookId;
const deleteAllBooks = require('../db/dbfunctions').deleteAllBooks;
const createComment = require('../db/dbfunctions').createComment;
const deleteBookById = require('../db/dbfunctions').deleteBookById;

const getBookCommentCount = (bookId) => {
  return new Promise((resolve, reject) => {
    getCommentCountByBookId(bookId, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

const createBookResult = async (data) => {
  const result = [];
  for (let i = 0; i < data.length; i++) {
    const commentCount = await getBookCommentCount(data[i]._id);
    result.push({
      '_id': data[i]._id,
      'title': data[i].title,
      'commentcount': commentCount,
    });
  }
  return result;
};

module.exports = function(app) {

  app.route('/api/books')
    //response will be array of book objects
    //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    .get(function(req, res) {
      getAllBooks((err, data) => {
        if (err) {
          console.error(err);
          res.status(400).send(err._message);
        } else {
          const result = createBookResult(data)
            .then(result => {
              res.json(result);
            })
            .catch(err => {
              console.error(err);
              res.status(400).send(err._message);
            });
        }
      });
    })

    .post(function(req, res) {
      //response will contain new book object including atleast _id and title
      const title = req.body.title;
      if (!!title) {
        createOrFindBook(title, (err, data) => {
          if (err) {
            console.error(err);
            res.status(400).send(err._message);
          } else {
            res.json(
              {
                _id: data._id,
                title: data.title,
              });
          }
        });
      } else {
        res.send('missing required field title');
      }
    })

    .delete(function(req, res) {
      //if successful response will be 'complete delete successful'
      deleteAllBooks((err, data) => {
        if (err) {
          console.error(err);
          res.status(400).send(err._message);
        } else {
          res.send('complete delete successful');
        }
      });
    });

  app.route('/api/books/:id')
    //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    .get(function(req, res) {
      const bookId = req.params.id;
      getBookByBookId(bookId, (err, data) => {
        if (err) {
          console.error(err);
          res.status(400).send(err._message);
        } else if (!data) {
          res.send('no book exists');
        } else {
          getCommentsByBookId(data._id, (err, commentData) => {
            if (err) {
              console.error(err);
              res.status(400).send(err._message);
            } else {
              const comments = commentData.map(d => d.comment);
              res.json({
                _id: data._id,
                title: data.title,
                comments: comments,
              });
            }
          });
        }
      });
    })

    .post(function(req, res) {
      //json res format same as .get
      const bookId = req.params.id;
      const comment = req.body.comment;
      if (!!comment) {
        getBookByBookId(bookId, (err, bookData) => {
          if (err) {
            console.error(err);
            res.status(400).send(err._message);
          } else if (!bookData) {
            res.send('no book exists');
          } else {
            createComment(bookData._id, comment, (err, data) => {
              if (err) {
                console.error(err);
                res.status(400).send(err._message);
              } else {
                getCommentsByBookId(bookData._id, (err, commentData) => {
                  if (err) {
                    console.error(err);
                    res.status(400).send(err._message);
                  } else {
                    const comments = commentData.map(d => d.comment);
                    res.json({
                      _id: bookData._id,
                      title: bookData.title,
                      comments: comments,
                    });
                  }
                });
              }
            });
          }
        });
      } else {
        res.send('missing required field comment');
      }
    })

    .delete(function(req, res) {
      //if successful response will be 'delete successful'
      const bookId = req.params.id;
      deleteBookById(bookId, (err, data) => {
        if (err) {
          console.error(err);
          res.status(400).send(err._message);
        } else if (!data) {
          res.send('no book exists');
        } else {
          res.send('delete successful');
        }
      });
    });
};
