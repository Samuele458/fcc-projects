function ConvertHandler() {
  this.getNum = function (input) {
    let matches = input.match(
      /^((((\d+\.\d+)|(\d+))(\/((\d+\.\d+)|(\d+))){0,1}){0,1})(?=[a-z]+)/gi
    );

    let result = undefined;

    if (matches != null) {
      result = eval(matches[0]);
      if (typeof result === "undefined") result = 1;
    }

    return result;
  };

  this.getUnit = function (input) {
    let unit;
    const units = ["gal", "l", "lbs", "kg", "mi", "km"];

    let matches = input.match(/[a-z]*$/gi);
    if (matches != null) {
      unit = matches[0].toLowerCase();
      if (units.indexOf(unit) === -1) {
        unit = undefined;
      }
      if (unit === "l") unit = "L";
    } else unit = undefined;
    return unit;
  };

  this.getReturnUnit = function (initUnit) {
    const units = [
      ["gal", "l"],
      ["lbs", "kg"],
      ["mi", "km"],
    ];

    let unit = initUnit.toLowerCase();

    for (let i = 0; i < units.length; ++i) {
      if (unit == units[i][0]) return units[i][1] === "l" ? "L" : units[i][1];
      if (unit == units[i][1]) return units[i][0] === "l" ? "L" : units[i][0];
    }
  };

  this.spellOutUnit = function (unit) {
    switch (unit.toLowerCase()) {
      case "km":
        return "kilometers";
      case "mi":
        return "miles";
      case "l":
        return "liters";
      case "kg":
        return "kilograms";
      case "lbs":
        return "pounds";
      case "gal":
        return "gallons";
    }
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;

    const round = (num) => {
      return Math.round((num + Number.EPSILON) * 100000) / 100000;
    };

    switch (initUnit.toLowerCase()) {
      case "gal":
        return round(initNum * galToL);
      case "l":
        return round((1 / galToL) * initNum);
      case "lbs":
        return round(initNum * lbsToKg);
      case "kg":
        return round((1 / lbsToKg) * initNum);
      case "mi":
        return round(initNum * miToKm);
      case "km":
        return round((1 / miToKm) * initNum);
    }
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    let result = `${initNum} ${this.spellOutUnit(
      initUnit
    )} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;

    return result;
  };
}

module.exports = ConvertHandler;
