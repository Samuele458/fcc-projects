require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dns = require('dns');

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

const Schema = mongoose.Schema;

const urlSchema = new Schema({
  url_name: { type: String, required: true },
  url_id: Number
})

const Url = mongoose.model("url",urlSchema);

const getNextId = ( done ) => {
  Url.find({})
    .select({ "url_id": 1 })
    .sort({ "url_id": -1 })
    .limit(1)
    .exec((err,data) => {
      if(err) return console.log(err);
      if( typeof data[0] === 'undefined' ) done(0)
      else done(data[0].url_id+1);
  })
}

const createNewUrl = ( url, id, done ) => {
  let newurl = new Url({
    url_name: url,
    url_id: id
  })

  console.log("url: ", url, "id: ", id)
  
  newurl.save((err,data) => {
    if(err) return console.log(err);
    done(data);
  })
}

app.post( "/api/shorturl/new", (req,res) => {
  dns.lookup(req.body.url, {all:true}, (err) => {
    if(err) return console.log(err);
    Url.find({
      url_name: req.body.url
    },(err,data) => {
      if(err) return console.log(err);
      getNextId((id)=>{
        createNewUrl(req.body.url,id,()=>{
          console.log("creato: ", data);
          res.json({
            original_url: req.body.url,
            short_url: id
          })
        });
      });
    })
  })
})


/*
  let newurl = new Url({
    url_name: req.body.url,
    uel_id: 5
  })
  newurl.save()
    .then(doc => {
      console.log(doc);
    })
    .catch(err => {
      console.log(err);
  });
  */
  
