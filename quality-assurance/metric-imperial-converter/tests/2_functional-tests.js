const chaiHttp = require("chai-http");
const chai = require("chai");
let assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

suite("Functional Tests", function () {
  test("Valid Input 10L", (done) => {
    chai
      .request(server)
      .get("/api/convert?input=10L")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.text,
          '{"initNum":10,"initUnit":"L","returnNum":2.64172,"returnUnit":"gal","string":"10 liters converts to 2.64172 gallons"}'
        );
        done();
      });
  });

  test("Invalid Input 32g", (done) => {
    chai
      .request(server)
      .get("/api/convert?input=32g")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "invalid unit");
        done();
      });
  });

  test("Invalid Input 3/7.2/4kg", (done) => {
    chai
      .request(server)
      .get("/api/convert?input=3%2F7.2%2F4kg")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "invalid number");
        done();
      });
  });

  test("Invalid Input 3/7.2/4kilomegagram", (done) => {
    chai
      .request(server)
      .get("/api/convert?input=3%2F7.2%2F4kilomegagram")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "invalid number and unit");
        done();
      });
  });

  test("Valid input: default number", (done) => {
    chai
      .request(server)
      .get("/api/convert?input=km")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(
          res.text,
          '{"initNum":1,"initUnit":"km","returnNum":0.62137,"returnUnit":"mi","string":"1 kilometers converts to 0.62137 miles"}'
        );
        done();
      });
  });
});
