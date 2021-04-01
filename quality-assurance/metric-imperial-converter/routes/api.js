"use strict";

const expect = require("chai").expect;
const ConvertHandler = require("../controllers/convertHandler.js");

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.route("/api/convert").get((req, res) => {
    let initUnit = convertHandler.getUnit(req.query.input);
    let initNum = convertHandler.getNum(req.query.input);

    if (typeof initUnit === "undefined" && typeof initNum === "undefined") {
      return res.send("invalid number and unit");
    }
    if (typeof initUnit === "undefined") {
      return res.send("invalid unit");
    }

    if (typeof initNum === "undefined") {
      return res.send("invalid number");
    }
    let returnUnit = convertHandler.getReturnUnit(initUnit);
    let returnNum = convertHandler.convert(initNum, initUnit);

    res.json({
      initNum: initNum,
      initUnit: initUnit,
      returnNum: returnNum,
      returnUnit: returnUnit,
      string: convertHandler.getString(
        initNum,
        initUnit,
        returnNum,
        returnUnit
      ),
    });
  });
};
