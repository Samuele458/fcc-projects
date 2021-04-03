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

    if (
      typeof req.body.value === "undefined" ||
      typeof req.body.coordinate === "undefined" ||
      typeof req.body.puzzle === "undefined"
    ) {
      return res.json({ error: "Required field(s) missing" });
    }

    if (isNaN(req.body.value)) {
      return res.json({ error: "Invalid value" });
    }

    if (
      req.body.coordinate.length != 2 ||
      !isNaN(req.body.coordinate[0]) ||
      isNaN(req.body.coordinate[1])
    ) {
      return res.json({ error: "Invalid coordinate" });
    }

    let value = parseInt(req.body.value);
    let row = parseInt(req.body.coordinate[1]);
    let col = req.body.coordinate[0].charCodeAt() - 64;
    let puzzle = req.body.puzzle;

    if (!solver.validate(puzzle)) {
      if (!/^[\.0-9]+$/.test(puzzle)) {
        return res.json({ error: "Invalid characters in puzzle" });
      } else if (puzzle.length != 81) {
        return res.json({ error: "Expected puzzle to be 81 characters long" });
      }
    }

    if (puzzle[(col - 1) * 9 + row - 1] == value) {
      puzzle = solver.setNumber(puzzle, (col - 1) * 9 + row - 1, ".");
    }
    checks = checks.map((checkFun) => {
      return checkFun(puzzle, row, col, value);
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
    let puzzle = req.body.puzzle;
    console.log(req.body.puzzle);
    if (typeof req.body.puzzle === "undefined") {
      return res.json({ error: "Required field missing" });
    }

    if (!solver.validate(puzzle)) {
      if (!/^[\.0-9]+$/.test(puzzle)) {
        res.json({ error: "Invalid characters in puzzle" });
      } else if (puzzle.length != 81) {
        res.json({ error: "Expected puzzle to be 81 characters long" });
      }
    } else {
      let solution = solver.solve(req.body.puzzle);
      if (typeof solution === "undefined") {
        return res.json({ error: "Puzzle cannot be solved" });
      } else {
        res.send({ solution: solution });
      }
    }
  });
};
