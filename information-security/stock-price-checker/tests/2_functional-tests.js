const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let hold_like;

suite("Functional Tests", function () {
  test("GET one stock request", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        done();
      });
  });

  test("GET one stock request with like", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG&like=true")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        hold_like = res.body.stockData.likes;
        done();
      });
  });

  test("GET one stock request with like again", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices?stock=GOOG&like=true")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, "GOOG");
        assert.equal(res.body.stockData.likes, hold_like);
        done();
      });
  });

  test("GET two stock request", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({
        stock: ["goog", "msft"],
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData[0].stock, "GOOG");
        assert.equal(res.body.stockData[1].stock, "MSFT");
        console.log(res.body);
        done();
      });
  });

  test("GET two stock request with like", (done) => {
    chai
      .request(server)
      .get("/api/stock-prices")
      .query({
        stock: ["goog", "msft"],
        like: true,
      })
      .end((err, res) => {
        console.log(res.body);
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData[0].stock, "GOOG");
        assert.equal(res.body.stockData[1].stock, "MSFT");
        assert.isNumber(res.body.stockData[0].rel_likes);
        assert.isNumber(res.body.stockData[1].rel_likes);

        done();
      });
  });
});
