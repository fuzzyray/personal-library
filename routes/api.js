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
const getCommentCountByBookId = require(
  '../db/dbfunctions').getCommentCountByBookId;
const deleteAllBooks = require('../db/dbfunctions').deleteAllBooks;

const getBookComments = (bookId) => {
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
    const commentCount = await getBookComments(data[i]._id);
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
    .get(function(req, res) {
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function(req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get
    })

    .delete(function(req, res) {
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
    });

};
