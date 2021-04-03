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

  getRegex(locale) {
    if (locale === TO_AMERICAN) return /^\d{1,2}\.\d{1,2}$/;
    else if (locale === TO_BRITISH) return /^\d{1,2}\:\d{1,2}$/;
  }

  getDictionaries(locale) {
    let dictionaries = [];
    if (locale == TO_BRITISH) {
      dictionaries.push(americanToBritishSpelling);
      dictionaries.push(americanToBritishTitles);
      dictionaries.push(americanOnly);
    } else if (locale === TO_AMERICAN) {
      dictionaries.push(this.swap(americanToBritishSpelling));
      dictionaries.push(this.swap(americanToBritishTitles));
      dictionaries.push(britishOnly);
    }
  }

  translate(text, locale) {
    console.log(locale);

    let tokens = [];
    let translation = "";
    let dictionaries = [];
    let timeRegex;

    if (locale == "american-to-british") {
      dictionaries.push(americanToBritishSpelling);
      dictionaries.push(americanToBritishTitles);
      dictionaries.push(americanOnly);
      timeRegex = /^\d{1,2}\:\d{1,2}$/;
    } else if (locale === "british-to-american") {
      dictionaries.push(this.swap(americanToBritishSpelling));
      dictionaries.push(this.swap(americanToBritishTitles));
      dictionaries.push(britishOnly);
      timeRegex = /^\d{1,2}\.\d{1,2}$/;
    } else {
      return undefined;
    }

    console.log(dictionaries[1]);

    tokens = text.split(/\s|(?=[\.\,])/);

    tokens.forEach((token, i) => {
      console.log("Cheching: ", token);
      let found = false;
      if (timeRegex.test(token)) {
        //ks
      } else {
        dictionaries.forEach((dict) => {
          if (dict[token]) {
            translation += dict[token];
            found = true;
          }
        });
        if (!found) translation += token;
      }
      if (i < tokens.length - 1 && !/^\.|\,/.test(tokens[i + 1]))
        translation += " ";
    });

    console.log(`-${translation}-`);
    console.log(tokens);

    return translation;
  }
}

module.exports = Translator;
