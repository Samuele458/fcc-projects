const chai = require("chai");
const chaiHttp = require("chai-http");
const { puzzlesAndSolutions } = require("../controllers/puzzle-strings");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", () => {
  suite("Solve - ", () => {
    test("Valid puzzle string", (done) => {
      let puzzle = puzzlesAndSolutions[0][0];
      let solution = puzzlesAndSolutions[0][1];
      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end((err, res) => {
          assert.equal(res.body.solution, solution);
          done();
        });
    });

    test("Missing puzzle string", (done) => {
      chai
        .request(server)
        .post("/api/solve")
        .end((err, res) => {
          assert.equal(res.body.error, "Required field missing");
          done();
        });
    });

    test("Puzzle with invalid characters", (done) => {
      let puzzle = puzzlesAndSolutions[0][0].replace("3", "A");

      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end((err, res) => {
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Puzzle with invalid incorrect length", (done) => {
      //test with length > 81
      let puzzle = puzzlesAndSolutions[0][0] + ".4.32";

      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end((err, res) => {
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Puzzle that cannot be solved", (done) => {
      //incorrect sudoku
      let puzzle =
        "1.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..";

      chai
        .request(server)
        .post("/api/solve")
        .send({ puzzle: puzzle })
        .end((err, res) => {
          assert.equal(res.body.error, "Puzzle cannot be solved");
          done();
        });
    });
  });

  suite("Check - ", () => {
    test("Puzzle that cannot be solved", (done) => {
      //incorrect sudoku
      let puzzle = puzzlesAndSolutions[0][0];

      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzle, value: "4", coordinate: "C4" })
        .end((err, res) => {
          assert.equal(res.body.valid, true);
          done();
        });
    });

    test("Puzzle with single placement conflict", (done) => {
      //incorrect sudoku
      let puzzle = puzzlesAndSolutions[0][0];

      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzle, value: "6", coordinate: "C4" })
        .end((err, res) => {
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 1);
          done();
        });
    });

    test("Puzzle with multiple placement conflicts", (done) => {
      //incorrect sudoku
      let puzzle = puzzlesAndSolutions[0][0];

      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzle, value: "3", coordinate: "D4" })
        .end((err, res) => {
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 2);
          done();
        });
    });

    test("Puzzle with all placement conflicts", (done) => {
      //incorrect sudoku
      let puzzle = puzzlesAndSolutions[0][0];

      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzle, value: "3", coordinate: "F4" })
        .end((err, res) => {
          assert.equal(res.body.valid, false);
          assert.equal(res.body.conflict.length, 3);
          done();
        });
    });

    test("Puzzle missing required fields", (done) => {
      chai
        .request(server)
        .post("/api/check")
        //missing puzzle field
        .send({ value: "3", coordinate: "F4" })
        .end((err, res) => {
          assert.equal(res.body.error, "Required field(s) missing");

          done();
        });
    });

    test("Puzzle with invalid characters", (done) => {
      let puzzle = puzzlesAndSolutions[0][0].replace("3", "A");

      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzle, value: "3", coordinate: "F4" })
        .end((err, res) => {
          assert.equal(res.body.error, "Invalid characters in puzzle");
          done();
        });
    });

    test("Puzzle with invalid characters", (done) => {
      let puzzle = puzzlesAndSolutions[0][0] + ".3.45";

      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzle, value: "3", coordinate: "F4" })
        .end((err, res) => {
          assert.equal(
            res.body.error,
            "Expected puzzle to be 81 characters long"
          );
          done();
        });
    });

    test("Puzzle with invalid placement coordinate", (done) => {
      let puzzle = puzzlesAndSolutions[0][0];

      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzle, value: "3", coordinate: "FF" })
        .end((err, res) => {
          assert.equal(res.body.error, "Invalid coordinate");
          done();
        });
    });

    test("Puzzle with invalid value", (done) => {
      let puzzle = puzzlesAndSolutions[0][0];

      chai
        .request(server)
        .post("/api/check")
        .send({ puzzle: puzzle, value: "X", coordinate: "F4" })
        .end((err, res) => {
          assert.equal(res.body.error, "Invalid value");
          done();
        });
    });
  });
});
