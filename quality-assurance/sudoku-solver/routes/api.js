"use strict";

const SudokuSolver = require("../controllers/sudoku-solver.js");

module.exports = function (app) {
  let solver = new SudokuSolver();

  app.route("/api/check").post((req, res) => {
    let checks = [
      solver.checkRowPlacement,
      solver.checkColPlacement,
      solver.checkRegionPlacement,
    ];

    const names = ["row", "column", "region"];

    checks = checks.map((checkFun) => {
      return checkFun(
        req.body.puzzle,
        parseInt(req.body.coordinate[1]),
        req.body.coordinate[0].charCodeAt() - 64,
        parseInt(req.body.value)
      );
    });

    let conflict = names.filter((name, i) => {
      return !checks[i];
    });

    let isValid = true;

    checks.forEach((e) => {
      if (!e) isValid = false;
    });

    let returnObj = {
      valid: isValid,
    };

    if (conflict.length > 0) {
      returnObj.conflict = conflict;
    }

    res.json(returnObj);
  });

  app.route("/api/solve").post((req, res) => {
    console.log("solve");
  });
};
