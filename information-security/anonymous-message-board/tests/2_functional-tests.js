const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");

chai.use(chaiHttp);

let thread_id;
suite("Functional Tests", function () {
  test("POST - creating new thread", (done) => {
    chai
      .request(server)
      .post("/api/threads/test-board")
      .send({
        text: "text",
        delete_password: "pw",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);

        done();
      });
  });

  test("GET - fetch threads from board page", (done) => {
    chai
      .request(server)
      .get("/api/threads/test-board")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body);

        thread_id = res.body[0]._id;
        done();
      });
  });

  test("PUT - Reporting a thread", (done) => {
    chai
      .request(server)
      .put("/api/threads/test-board")
      .send({
        report_id: thread_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "success");

        done();
      });
  });

  //----

  test("POST - Add a reply to a thread", (done) => {
    chai
      .request(server)
      .post("/api/replies/test-board")
      .send({
        thread_id: thread_id,
        delete_password: "pw",
        text: "reply",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        done();
      });
  });

  let reply_id;
  test("GET - view replies of a thread", (done) => {
    chai
      .request(server)
      .get("/api/replies/test-board")
      .query({
        thread_id: thread_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.isArray(res.body.replies);
        assert.equal(res.body.replies[0].text, "reply");
        reply_id = res.body.replies[0]._id;

        done();
      });
  });

  test("PUT - Reporting a reply", (done) => {
    chai
      .request(server)
      .put("/api/replies/test-board")
      .send({
        reply_id: reply_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "success");

        done();
      });
  });

  test("DELETE - delete reply with incorrect password", (done) => {
    chai
      .request(server)
      .delete("/api/replies/test-board")
      .send({
        delete_password: "incorrect_pw",
        reply_id: reply_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "incorrect password");

        done();
      });
  });

  test("DELETE - delete reply with correct password", (done) => {
    chai
      .request(server)
      .delete("/api/replies/test-board")
      .send({
        delete_password: "pw",
        reply_id: reply_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "success");

        done();
      });
  });

  //--

  test("DELETE - delete thread with incorrect password", (done) => {
    chai
      .request(server)
      .delete("/api/threads/test-board")
      .send({
        delete_password: "incorrect_pw",
        thread_id: thread_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "incorrect password");

        done();
      });
  });

  test("DELETE - delete thread with correct password", (done) => {
    chai
      .request(server)
      .delete("/api/threads/test-board")
      .send({
        delete_password: "pw",
        thread_id: thread_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.text, "success");

        done();
      });
  });
});
