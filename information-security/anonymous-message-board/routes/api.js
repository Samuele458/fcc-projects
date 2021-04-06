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
  replies: { type: [ObjectId], required: true, default: [] },
});

const Thread = mongoose.model("thread", threadSchema);

const replySchema = new Schema({
  text: { type: String, required: true },
  delete_password: { type: String, required: true },
  reported: { type: Boolean, required: true, default: false },
  created_on: { type: Date, required: true },
});

const Reply = mongoose.model("reply", replySchema);

module.exports = function (app) {
  app
    .route("/api/threads/:board")

    .post((req, res) => {
      let currentTimestamp = new Date().toISOString();

      const newThread = new Thread({
        board: req.body.board,
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
      console.log("Data query:", req.query);
      console.log("Data body:", req.body);
      console.log("Data params:", req.params);
      Thread.find({
        board: req.params.board,
      })
        .sort({ bumped_on: -1 })
        .select({
          __v: 0,
          board: 0,
          reported: 0,
          delete_password: 0,
        })
        .limit(10)
        .exec((err, data) => {
          if (err) return console.log(err);

          res.send(data);
        });
    });

  app.route("/api/replies/:board");
};
