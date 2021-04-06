"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;

const threadSchema = new Schema({
  board: { type: String, required: true },
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  created_on: { type: Date, required: true },
  bumped_on: { type: Date, required: true },
  reported: { type: Boolean, required: true, default: false },
  replies: {
    type: [{ type: ObjectId, ref: "reply" }],
    required: true,
    default: [],
  },
});

const replySchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, required: true, default: false },
  created_on: { type: Date, required: true },
  thread_id: { type: ObjectId, required: true },
});

const Reply = mongoose.model("reply", replySchema);
const Thread = mongoose.model("thread", threadSchema);

module.exports = function (app) {
  app
    .route("/api/threads/:board")

    .post((req, res) => {
      let currentTimestamp = new Date().toISOString();

      const newThread = new Thread({
        board: req.params.board,
        text: req.body.text,
        delete_password: req.body.delete_password,
        created_on: currentTimestamp,
        bumped_on: currentTimestamp,
      });

      newThread.save((err, threadData) => {
        res.redirect("/b/" + threadData.board);
      });
    })

    .get((req, res) => {
      Thread.find({
        board: req.params.board,
      })
        .lean()
        .sort({ bumped_on: -1 })
        .select({
          __v: 0,
          board: 0,
          reported: 0,
          delete_password: 0,
        })
        //.slice("replies", -3)
        .populate("replies", {
          delete_password: 0,
          __v: 0,
          thread_id: 0,
          reported: 0,
        })
        .limit(10)
        .exec((err, threads) => {
          if (err) return console.log(err);

          threads = threads.map((thread) => {
            thread.replycount = thread.replies.length;
            thread.replies = thread.replies.slice(-3);
            return thread;
          });

          res.send(threads);
        });
    })

    .put((req, res) => {
      Thread.findOneAndUpdate(
        {
          _id: req.body.report_id,
        },
        { reported: true },
        (err, data) => {
          if (err) return console.log(err);

          if (data == null) {
            res.send("unknown thread");
          } else {
            res.send("success");
          }
        }
      );
    })

    .delete((req, res) => {
      Thread.findOneAndDelete(
        {
          _id: req.body.thread_id,
          delete_password: req.body.delete_password,
        },
        (err, data) => {
          if (err) return console.log(err);

          if (data == null) {
            res.send("incorrect password");
          } else {
            Reply.deleteMany(
              { thread_id: req.body.thread_id },
              (err, removedData) => {
                if (err) return console.log(err);
                res.send("success");
              }
            );
          }
        }
      );
    });

  app
    .route("/api/replies/:board")
    .post((req, res) => {
      let currentTimestamp = new Date().toISOString();
      const newReply = new Reply({
        text: req.body.text,
        delete_password: req.body.delete_password,
        thread_id: req.body.thread_id,
        created_on: currentTimestamp,
      });

      newReply.save((err, replyData) => {
        if (err) return console.log(err);

        Thread.findOneAndUpdate(
          {
            _id: replyData.thread_id,
          },
          { $push: { replies: replyData._id }, bumped_on: currentTimestamp },
          { new: true }
        )
          .populate("replies", {
            delete_password: 0,
            __v: 0,
            thread_id: 0,
            reported: 0,
          })
          .exec((err, threadData) => {
            if (err) return console.log(err);
            res.redirect(`/b/${threadData.board}/${threadData._id}`);
          });
      });
    })
    .get((req, res) => {
      Thread.findOne({
        _id: mongoose.Types.ObjectId(req.query.thread_id),
      })
        .select({
          __v: 0,
          board: 0,
          reported: 0,
          delete_password: 0,
        })
        .populate("replies", {
          delete_password: 0,
          __v: 0,
          thread_id: 0,
          reported: 0,
        })
        .exec((err, threadData) => {
          if (err) return console.log(err);
          //res.redirect(`/b/${threadData.board}/${threadData._id}`);
          res.send(threadData);
        });
    })
    .put((req, res) => {
      Reply.findOneAndUpdate(
        {
          _id: req.body.reply_id,
        },
        { reported: true },
        (err, data) => {
          if (err) return console.log(err);

          if (data == null) {
            res.send("unknown reply_id");
          } else {
            res.send("success");
          }
        }
      );
    })
    .delete((req, res) => {
      Reply.findOneAndDelete(
        {
          _id: req.body.reply_id,
          delete_password: req.body.delete_password,
        },
        (err, data) => {
          if (err) return console.log(err);

          if (data == null) {
            res.send("incorrect password");
          } else {
            res.send("success");
          }
        }
      );
    });
};
