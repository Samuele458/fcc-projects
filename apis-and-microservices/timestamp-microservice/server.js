var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});

app.get("/api/timestamp/:date?", (req, res) => {
  
  let date = new Date();

  if( typeof req.params.date !== 'undefined' ) {
    if(/^[0-9]+$/.test(req.params.date)) {
      date = new Date(parseInt(req.params.date))
    } else {
      date = new Date(req.params.date);
    }
  }

  if( isNaN(date.getTime()) ) {
    res.json({
      error: "Invalid date"
    })
  } else {
    
    res.json({
      unix: date.getTime(),
      utc: date.toGMTString()
    });
  }
})
