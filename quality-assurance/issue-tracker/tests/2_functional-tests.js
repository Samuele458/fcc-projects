const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const { request } = require("chai");

chai.use(chaiHttp);

let issue_id;

suite("Functional Tests", function () {
  test("Issue with every field", (done) => {
    chai
      .request(server)
      .post("/api/issues/test_project")
      .send({
        issue_title: "title",
        issue_text: "text",
        open: true,
        assigned_to: "test",
        status_text: "status",
        created_by: "test",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "title");
        assert.equal(res.body.issue_text, "text");
        assert.equal(res.body.open, true);
        assert.equal(res.body.assigned_to, "test");
        assert.equal(res.body.status_text, "status");
        assert.equal(res.body.created_by, "test");
        issue_id = res.body._id;
        done();
      });
  });

  test("Issue with required fields", (done) => {
    chai
      .request(server)
      .post("/api/issues/test_project2")
      .send({
        issue_title: "title2",
        issue_text: "text2",
        created_by: "test",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.issue_title, "title2");
        assert.equal(res.body.issue_text, "text2");
        assert.equal(res.body.created_by, "test");

        done();
      });
  });

  test("Issue with missing required field", (done) => {
    chai
      .request(server)
      .post("/api/issues/test_project3")
      .send({
        issue_text: "text",
        created_by: "test",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "required field(s) missing");

        done();
      });
  });

  test("GET request to a project", (done) => {
    chai
      .request(server)
      .get("/api/issues/test_project")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body[0].issue_title, "title");

        done();
      });
  });

  test("GET request to a project, with one filter", (done) => {
    chai
      .request(server)
      .get("/api/issues/test_project2")
      .send({
        issue_title: "title2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body[0].issue_text, "text2");

        done();
      });
  });

  test("GET request to a project, with multiple filters", (done) => {
    chai
      .request(server)
      .get("/api/issues/test_project2")
      .send({
        issue_title: "title2",
        issue_text: "text2",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body[0].created_by, "test");

        done();
      });
  });

  test("Update one field", (done) => {
    chai
      .request(server)
      .put("/api/issues/test_project")
      .send({
        _id: issue_id,
        issue_title: "title_updated",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");

        done();
      });
  });

  test("Update multiple fields", (done) => {
    chai
      .request(server)
      .put("/api/issues/test_project")
      .send({
        _id: issue_id,
        issue_title: "title_updated_again",
        issue_text: "text_updated",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully updated");

        done();
      });
  });

  test("Update with missing id", (done) => {
    chai
      .request(server)
      .put("/api/issues/test_project")
      .send({
        issue_title: "title_updated_again",
        issue_text: "text_updated",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");

        done();
      });
  });

  test("Update with missing fields", (done) => {
    chai
      .request(server)
      .put("/api/issues/test_project")
      .send({
        _id: issue_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "no update field(s) sent");

        done();
      });
  });

  test("Update with wrong _id", (done) => {
    chai
      .request(server)
      .put("/api/issues/test_project")
      .send({
        _id: "random_wrong_id",
        issue_title: "new_title",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not update");

        done();
      });
  });

  test("Delete with wrong _id", (done) => {
    chai
      .request(server)
      .delete("/api/issues/test_project")
      .send({
        _id: "random_wrong_id",
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "could not delete");

        done();
      });
  });

  test("Delete with missing _id", (done) => {
    chai
      .request(server)
      .delete("/api/issues/test_project")
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.error, "missing _id");

        done();
      });
  });

  test("Delete with _id", (done) => {
    chai
      .request(server)
      .delete("/api/issues/test_project")
      .send({
        _id: issue_id,
      })
      .end((err, res) => {
        assert.equal(res.status, 200);
        assert.equal(res.body.result, "successfully deleted");

        done();
      });
  });
});
