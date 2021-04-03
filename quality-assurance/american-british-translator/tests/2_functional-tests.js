const chai = require("chai");
const chaiHttp = require("chai-http");
const assert = chai.assert;
const server = require("../server.js");

chai.use(chaiHttp);

let Translator = require("../components/translator.js");

suite("Functional Tests", () => {
  test("POST Translation with text and locale fields", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "color.", locale: "american-to-british" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, "color.");
        assert.equal(
          res.body.translation,
          '<span class="highlight">colour</span>.'
        );
        done();
      });
  });

  test("POST Translation with invalid locale fieldd", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "color.", locale: "wrong_locale" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Invalid value for locale field");
        done();
      });
  });

  test("POST Translation with missing text field", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ locale: "british-to-american" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("POST Translation with missing locale field", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "color." })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "Required field(s) missing");
        done();
      });
  });

  test("POST Translation with empty text.", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "", locale: "american-to-british" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "No text to translate");

        done();
      });
  });

  test("POST Translation with text that need no translation", (done) => {
    chai
      .request(server)
      .post("/api/translate")
      .send({ text: "colour.", locale: "american-to-british" })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.text, "colour.");
        assert.equal(res.body.translation, "Everything looks good to me!");
        done();
      });
  });
});
