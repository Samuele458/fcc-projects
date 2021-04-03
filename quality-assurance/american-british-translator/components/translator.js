const americanOnly = require("./american-only.js");
const americanToBritishSpelling = require("./american-to-british-spelling.js");
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require("./british-only.js");

const TO_BRITISH = "american-to-british";
const TO_AMERICAN = "british-to-american";

class Translator {
  swap(json) {
    var ret = {};
    for (var key in json) {
      ret[json[key]] = key;
    }
    return ret;
  }

  getTimeRegex(locale) {
    if (locale === TO_AMERICAN) return /^\d{1,2}\.\d{1,2}$/;
    else if (locale === TO_BRITISH) return /^\d{1,2}\:\d{1,2}$/;
  }

  getDictionaries(locale) {
    let dictionaries = [];
    if (locale === TO_BRITISH) {
      dictionaries.push(americanToBritishSpelling);
      dictionaries.push(americanToBritishTitles);
      dictionaries.push(americanOnly);
    } else if (locale === TO_AMERICAN) {
      dictionaries.push(this.swap(americanToBritishSpelling));
      dictionaries.push(this.swap(americanToBritishTitles));
      dictionaries.push(britishOnly);
    }
    return dictionaries;
  }

  getTimeSeparatorTo(locale) {
    if (locale === TO_AMERICAN) return ":";
    else if (locale === TO_BRITISH) return ".";
  }

  getTimeSeparatorFrom(locale) {
    if (locale === TO_AMERICAN) return ".";
    else if (locale === TO_BRITISH) return ":";
  }

  highlight(token) {
    return `<span class="highlight">${token}</span>`;
  }

  translate(text, locale) {
    let tokens = [];
    let translation = "";
    let dictionaries = this.getDictionaries(locale);
    let timeRegex = this.getTimeRegex(locale);

    tokens = text.split(/\s|(?=\.\s|\.$|\,)/);

    tokens.forEach((token, i) => {
      let found = false;
      if (timeRegex.test(token)) {
        let time = token.replace(
          this.getTimeSeparatorFrom(locale),
          this.getTimeSeparatorTo(locale)
        );
        translation += this.highlight(time);
      } else {
        dictionaries.forEach((dict) => {
          if (dict[token]) {
            translation += this.highlight(dict[token]);
            found = true;
          }
        });
        if (!found) translation += token;
      }
      if (i < tokens.length - 1 && !/^\.|\,/.test(tokens[i + 1]))
        translation += " ";
    });

    Object.keys(dictionaries[1]).forEach((title) => {
      let repStr = dictionaries[1][title];
      translation = translation.replace(
        new RegExp(title, "ig"),
        this.highlight(repStr[0].toUpperCase() + repStr.slice(1))
      );
    });

    if (translation === text) return "Everything looks good to me!";
    return translation;
  }
}

module.exports = Translator;
