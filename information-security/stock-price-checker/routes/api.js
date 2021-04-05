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
      let data = [];

      const stockReq = https.get(
        "https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/" +
          name +
          "/quote",
        (res) => {
          res.on("data", (d) => {
            data.push(d);
          });

          res.on("error", (error) => {
            reject(error);
          });

          res.on("end", () => {
            let response = Buffer.concat(data).toString();

            if (response == '"Invalid symbol"') resolve({});
            else {
              let dataObj = JSON.parse(response);

              resolve({ stock: dataObj.symbol, price: dataObj.latestPrice });
            }
          });
        }
      );
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
      let { stock, like } = req.query;

      if (typeof stock === "undefined") {
        return res.json({ error: "missing stock field" });
      }

      if (typeof like === "undefined") {
        like = false;
      }

      if (Array.isArray(stock)) {
        let stockData = [await getStock(stock[0]), await getStock(stock[1])];

        let stocksFound = [
          await Stock.findOne({ name: stock[0] }).exec(),
          await Stock.findOne({ name: stock[1] }).exec(),
        ];

        for (let i = 0; i < 2; ++i) {
          if (stocksFound[i] == null) {
            stockData[i].likes = like ? 1 : 0;

            const newStock = new Stock({
              name: stock[i],
              likes: like ? [req.connection.remoteAddress] : [],
            });

            newStock.save((err, newStockData) => {
              if (err) return console.log(err);
            });
          } else {
            let likes = stocksFound[i].likes;

            if (like && likes.indexOf(req.connection.remoteAddress) == -1) {
              stockData[i].likes = stocksFound[i].likes.length + 1;

              Stock.findOneAndUpdate(
                { name: stock[i] },
                { $push: { likes: req.connection.remoteAddress } },
                { new: true },
                (err, updatedStockData) => {
                  if (err) return console.log(err);
                }
              );
            } else stockData[i].likes = stocksFound[i].likes.length;
          }
        }

        stockData[0].rel_likes = stockData[0].likes - stockData[1].likes;
        stockData[1].rel_likes = stockData[1].likes - stockData[0].likes;
        delete stockData[0].likes;
        delete stockData[1].likes;
        res.json({ stockData: stockData });
      } else {
        stock = stock.toUpperCase();

        let stockData = await getStock(stock);

        Stock.findOne({ name: stock }, (err, stockFound) => {
          if (err) return console.log(err);

          if (stockFound != null) {
            if (
              like &&
              stockFound.likes.indexOf(req.connection.remoteAddress) == -1
            ) {
              Stock.findOneAndUpdate(
                { name: stock },
                { $push: { likes: req.connection.remoteAddress } },
                { new: true },
                (err, updatedStockData) => {
                  if (err) return console.log(err);

                  stockData.likes = updatedStockData.likes.length;
                  res.json({
                    stockData: stockData,
                  });
                }
              );
            } else {
              stockData.likes = stockFound.likes.length;
              res.json({
                stockData: stockData,
              });
            }
          } else {
            const newStock = new Stock({
              name: stock,
              likes: like ? [req.connection.remoteAddress] : [],
            });

            newStock.save((err, newStockData) => {
              if (err) return console.log(err);

              stockData.likes = newStockData.likes.length;
              res.json({
                stockData: stockData,
              });
            });
          }
        });
      }
    })();
  });
};
