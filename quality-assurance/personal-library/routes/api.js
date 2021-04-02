/*
 *
 *
 *       Complete the API routing below
 *
 *
 */

"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: { type: String, required: true },
  comments: [String],
});

const Book = mongoose.model("book", bookSchema);

module.exports = function (app) {
  app
    .route("/api/books")
    .get(function (req, res) {
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({})
        .select({
          __v: 0,
        })
        .lean()
        .exec((err, data) => {
          if (err) return console.log(err);
          data.map((e) => {
            e.commentcount = e.comments.length;
            delete e.comments;
            return e;
          });
          res.json(data);
        });
    })

    .post(function (req, res) {
      let title = req.body.title;

      if (!title) {
        return res.send("missing required field title");
      }

      const book = new Book({
        title: title,
        comments: [],
      });

      book.save((err, data) => {
        if (err) return console.log(err);
        res.json(data);
      });
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {
      //if successful response will be 'complete delete successful'
      Book.remove({}, (err, data) => {
        if (err) return console.log(err);
        res.send("complete delete successful");
      });
    });

  app
    .route("/api/books/:id")
    .get(function (req, res) {
      let bookid = req.params.id;

      Book.findById(bookid, (err, data) => {
        if (err || !data) res.send("no book exists");
        else res.send(data);
      });
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;

      if (typeof comment === "undefined") {
        return res.send("missing required field comment");
      }

      Book.findByIdAndUpdate(
        bookid,
        { $push: { comments: comment } },
        { new: true },
        (err, data) => {
          if (err || !data) res.send("no book exists");
          else res.send(data);
        }
      );
      //json res format same as .get
    })

    .delete(function (req, res) {
      let bookid = req.params.id;

      Book.findByIdAndRemove(bookid, (err, data) => {
        if (err || !data) res.send("no book exists");
        else res.send("delete successful");
      });
      //if successful response will be 'delete successful'
    });
};
