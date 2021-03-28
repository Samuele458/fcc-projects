/*
 *  Author:   Samuele Girgenti
 *  Date:     28 / 03 / 2021
 */

require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dateformat = require("dateformat");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());
app.use(express.static("public"));
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("user", userSchema);

const exerciseSchema = new Schema({
  userId: {
    type: ObjectId,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Exercise = mongoose.model("exercise", exerciseSchema);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});

app.post("/api/exercise/new-user", (req, res) => {
  const user = new User({
    username: req.body.username,
  });
  user.save((err, data) => {
    if (err) return console.log(err);
    let dataObj = data.toObject();
    delete dataObj.__v;
    res.json(dataObj);
  });
});

app.get("/api/exercise/users", (req, res) => {
  User.find({}, (err, data) => {
    if (err) return console.log(err);
    res.send(data);
  });
});

app.post("/api/exercise/add", (req, res) => {
  User.find(
    {
      _id: req.body.userId,
    },
    (err, userData) => {
      if (err) return console.log(err);
      const exerciseDate = req.body.date || new Date();
      const exercise = new Exercise({
        userId: req.body.userId,
        description: req.body.description,
        duration: req.body.duration,
        date: exerciseDate,
      });
      exercise.save((err, exerciseData) => {
        if (err) return console.log(err);
        let data = userData[0].toObject();
        delete data.__v;
        data.description = exerciseData.description;
        data.duration = exerciseData.duration;
        data.date = dateformat(exerciseData.date, "ddd mmm dd yyyy");
        res.json(data);
      });
    }
  );
});

app.get("/api/exercise/log", (req, res) => {
  User.find(
    {
      _id: req.query.userId,
    },
    (err, userData) => {
      if (err) return console.log(err);

      let dataLimit = req.query.limit || "0";
      dataLimit = parseInt(dataLimit);

      Exercise.find({
        userId: userData[0]._id,
        date: {
          $gte: req.query.from || "1900-01-01",
          $lte: req.query.to || "2030-01-01",
        },
      })
        .select({
          _id: 0,
          __v: 0,
        })
        .limit(dataLimit)
        .exec((err, exerciseData) => {
          if (err) return console.log(err);

          let data = userData[0].toObject();
          delete data.__v;
          data.count = exerciseData.length;
          data.log = exerciseData.map((elem) => {
            let elemObj = elem.toObject();
            elemObj.date = dateformat(elem.date, "ddd mmm dd yyyy");
            return elemObj;
          });

          res.json(data);
        });
    }
  );
});
