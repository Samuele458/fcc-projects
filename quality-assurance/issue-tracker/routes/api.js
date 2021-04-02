"use strict";

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const issueSchema = new Schema({
  issue_title: { type: String, required: true },
  issue_text: { type: String, required: true },
  project: { type: String, required: true },
  open: { type: Boolean, default: true },
  assigned_to: { type: String, default: "" },
  status_text: { type: String, default: "" },
  created_by: { type: String, required: true },
  created_on: { type: Date, default: "" },
  updated_on: { type: Date, default: "" },
});

const Issue = mongoose.model("issue", issueSchema);

module.exports = function (app) {
  app
    .route("/api/issues/:project")

    .get(function (req, res) {
      let project = req.params.project;

      let filters = {
        project: project,
      };

      let fields = Object.keys(issueSchema.obj);
      fields.push("_id");
      fields.forEach((e) => {
        if (req.query[e]) filters[e] = req.query[e];
      });

      Issue.find(filters)
        .select({
          project: 0,
          __v: 0,
        })
        .exec((err, data) => {
          if (err) return console.log(err);
          return res.json(data);
        });
    })

    .post(function (req, res) {
      let project = req.params.project;
      let timestamp = new Date().toISOString();

      if (
        typeof req.body.issue_text === "undefined" ||
        typeof req.body.issue_title === "undefined" ||
        typeof req.body.created_by === "undefined"
      )
        return res.send({ error: "required field(s) missing" });

      let issue = new Issue({
        project: project,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        assigned_to: req.body.assigned_to,
        status_text: req.body.status_text,
        created_on: timestamp,
        updated_on: timestamp,
      });

      issue.save((err, data) => {
        if (err) return console.log(err);
        res.send(data);
      });
    })

    .put(function (req, res) {
      let project = req.params.project;

      if (typeof req.body._id === "undefined") {
        return res.send({ error: "missing _id" });
      }

      if (Object.keys(req.body).length == 1) {
        return res.send({
          error: "no update field(s) sent",
          _id: req.body._id,
        });
      }

      let updateObj = JSON.parse(JSON.stringify(req.body));
      delete updateObj._id;
      updateObj.updated_on = new Date().toISOString();
      Issue.findOneAndUpdate(
        {
          _id: req.body._id,
          project: project,
        },
        updateObj,
        { useFindAndModify: false },
        (err, data) => {
          if (data == null || err)
            return res.json({ error: "could not update", _id: req.body._id });
          return res.json({
            result: "successfully updated",
            _id: req.body._id,
          });
        }
      );
    })

    .delete(function (req, res) {
      let project = req.params.project;

      if (typeof req.body._id === "undefined") {
        return res.send({ error: "missing _id" });
      }
      Issue.findByIdAndRemove(
        req.body._id,
        { useFindAndModify: false },
        (err, data) => {
          if (err || data == null)
            return res.send({ error: "could not delete", _id: req.body._id });
          else
            return res.send({
              result: "successfully deleted",
              _id: req.body._id,
            });
        }
      );
    });
};
