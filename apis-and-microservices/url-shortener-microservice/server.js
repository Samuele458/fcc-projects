require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const dns = require('dns');
var url = require('url'); 

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

var bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// Basic Configuration
const port = process.env.PORT || 46679; 

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
  let url_sanitized = req.body.url;
  var q = url.parse(url_sanitized, true);
  const hostname = q.host;
  dns.lookup(hostname, {all:true}, (err) => {
    if(err||hostname===null) return res.json({ error: 'invalid url' });
    Url.find({
      url_name: url_sanitized
    },(err,data) => {
      if(err) return console.log(err);
      getNextId((id)=>{
        createNewUrl(url_sanitized,id,()=>{
          console.log("creato: ", data);
          res.json({
            original_url: url_sanitized,
            short_url: id
          })
        }); 
      });
    })
  })
})

app.get( "/api/shorturl/:id", (req,res) => {
  console.log(req.params)
  Url.find({
    url_id: parseInt(req.params.id)
  }, (err, data) => {
    if(err) return console.log(err);
    if( typeof data[0] === 'undefined' ) {
      res.send({
        error:	"No short URL found for the given input"
      })
    } else {
      res.writeHead(301,{Location: data[0].url_name});
      res.end();
    }
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
  
