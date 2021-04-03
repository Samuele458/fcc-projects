"use strict";

const { text } = require("body-parser");
const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const { text, locale } = req.body;
    res.json({ text: text, translation: translator.translate(text, locale) });
  });
};
