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
  function stockPromise(name) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: "stock-price-checker-proxy.freecodecamp.rocks",
        port: 443,
        path: "/v1/stock/" + name + "/quote",
        method: "GET",
      };

      let data;

      const stockReq = https.request(options, (res) => {
        console.log(`statusCode: ${res.statusCode}`);

        res.on("data", (d) => {
          //console.log(JSON.parse(d));
          data = typeof d === "undefined" ? d : JSON.parse(d);
        });
      });

      stockReq.on("error", (error) => {
        reject(error);
      });

      console.log("here");

      stockReq.end();

      resolve(data);
    });
  }

  async function getStock(name) {
    try {
      return await stockPromise(name);
    } catch (e) {
      console.error(e);
    }
  }

  app.route("/api/stock-prices").get(function (req, res) {
    (async function () {
      const { stock, like } = req.query;

      if (typeof stock === "undefined") {
        return res.json({ error: "missing stock field" });
      }

      if (typeof like === "undefined") {
        like = false;
      }

      //cerco lo stock in mongodb
      // se non lo trovo lo creo
      // se lo trovo lo modifico

      Stock.findOne({ name: stock }, (err, stockFound) => {
        if (err) return console.log(err);

        if (stockFound != null) {
          console.log("trovato");
        } else {
          console.log("non trovato");
        }
      });

      res.send("sds");
      console.log("Query:", req.query);
    })();

    /*

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
          if (typeof like !== "undefined") {
            Stock.findOneAndUpdate(
              { name: stock },
              { likes: req.connection.remoteAddress },
              { new: true },
              (err, newStockData) => {
                if (err) return console.log(err);

                res.json({
                  stockdata: {
                    stock: stockData.symbol,
                    price: stockData.latestPrice,
                    like: newStockData.likes.length,
                  },
                });
              }
            );
          } else {
            res.json({
              stockdata: {
                stock: stockData.symbol,
                price: stockData.latestPrice,
                like: currentStockData.likes.length,
              },
            });
          }
        }
      });
    });*/
  });
};
