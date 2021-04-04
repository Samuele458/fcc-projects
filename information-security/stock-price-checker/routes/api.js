"use strict";
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const https = require("https");

const stockSchema = new Schema({
  name: { type: String, required: true },
  likes: [String],
});

const Stock = mongoose.model("stock", stockSchema);

module.exports = function (app) {
  function getStock(name, callback) {
    const options = {
      hostname: "stock-price-checker-proxy.freecodecamp.rocks",
      port: 443,
      path: "/v1/stock/" + name + "/quote",
      method: "GET",
    };

    const stockReq = https.request(options, (res) => {
      console.log(`statusCode: ${res.statusCode}`);

      res.on("data", (d) => {
        //console.log(JSON.parse(d));
        callback(JSON.parse(d));
      });
    });

    stockReq.on("error", (error) => {
      console.error(error);
    });

    stockReq.end();
  }

  app.route("/api/stock-prices").get(function (req, res) {
    const { stock, like } = req.query;

    if (typeof stock === "undefined") {
      return res.json({ error: "missing stock field" });
    }

    if (typeof like === "undefined") {
    }

    getStock(stock, (stockData) => {
      //console.log(stockData);

      Stock.findOne({ name: stock }, (err, currentStockData) => {
        if (err) return console.log(err);

        console.log(currentStockData);
        if (currentStockData == null) {
          const newStock = new Stock({
            name: stock,
            likes:
              typeof like === "undefined" ? [] : [req.connection.remoteAddress],
          });

          newStock.save((err, newStockData) => {
            if (err) return console.log(err);
            console.log(req.connection.remoteAddress);
            res.json({
              stockdata: {
                stock: stockData.symbol,
                price: stockData.latestPrice,
                like: newStockData.likes.length,
              },
            });
          });
        } else {
          res.json({ ehehe: 3 });
        }
      });
    });

    console.log(req.query);
  });
};
