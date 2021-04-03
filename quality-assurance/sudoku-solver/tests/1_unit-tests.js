const chai = require("chai");
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings.js");
const assert = chai.assert;

const Solver = require("../controllers/sudoku-solver.js");
let solver = new Solver();

suite("UnitTests", () => {
  test("Valid puzzle string of 81 characters", () => {
    let puzzle = puzzlesAndSolutions[3][0];
    assert.equal(solver.validate(puzzle), true);
  });

  test("Puzzle string with invalid characters", () => {
    let puzzle = puzzlesAndSolutions[3][0].replace("3", "A");
    assert.equal(solver.validate(puzzle), false);
  });

  test("Puzzle string that is not 81 characters in length", () => {
    let puzzle = puzzlesAndSolutions[3][0].slice(0, 30);
    assert.equal(solver.validate(puzzle), false);
  });

  test("Valid row placement", () => {
    let puzzle = puzzlesAndSolutions[3][0];
    assert.equal(solver.checkRowPlacement(puzzle, 5, 2, 2), true);
  });

  test("Invalid row placement", () => {
    let puzzle = puzzlesAndSolutions[3][0];
    assert.equal(solver.checkRowPlacement(puzzle, 5, 2, 4), false);
  });

  test("Valid column placement", () => {
    let puzzle = puzzlesAndSolutions[3][0];
    assert.equal(solver.checkColPlacement(puzzle, 8, 9, 6), true);
  });

  test("Invalid column placement", () => {
    let puzzle = puzzlesAndSolutions[3][0];
    assert.equal(solver.checkColPlacement(puzzle, 8, 9, 3), false);
  });

  test("Valid region placement", () => {
    let puzzle = puzzlesAndSolutions[3][0];
    assert.equal(solver.checkRegionPlacement(puzzle, 4, 6, 8), true);
  });

  test("Invalid region placement", () => {
    let puzzle = puzzlesAndSolutions[3][0];
    assert.equal(solver.checkRegionPlacement(puzzle, 4, 6, 9), false);
  });

  test("Valid puzzle string to solver", () => {
    let puzzle = puzzlesAndSolutions[2][0];
    assert.isDefined(solver.solve(puzzle));
  });

  test("Invalid puzzle string to solver", () => {
    let puzzle =
      "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";
    assert.isUndefined(solver.solve(puzzle));
  });

  test("Expected solution for an incomplete puzzle", () => {
    puzzlesAndSolutions.forEach((puzzle) => {
      assert.equal(solver.solve(puzzle[0]), puzzle[1]);
    });
  });
});
