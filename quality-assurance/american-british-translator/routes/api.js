"use strict";

const { text } = require("body-parser");
const Translator = require("../components/translator.js");

module.exports = function (app) {
  const translator = new Translator();

  app.route("/api/translate").post((req, res) => {
    const { text, locale } = req.body;

    if (typeof text === "undefined" || typeof locale === "undefined") {
      return res.json({ error: "Required field(s) missing" });
    }

    if (text.length === 0) {
      return res.json({ error: "No text to translate" });
    }

    if (locale !== "british-to-american" && locale !== "american-to-british") {
      return res.json({ error: "Invalid value for locale field" });
    }

    res.json({ text: text, translation: translator.translate(text, locale) });
  });
};
