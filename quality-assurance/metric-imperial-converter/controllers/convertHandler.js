function ConvertHandler() {
  this.getNum = function (input) {
    let result = eval(
      input.match(/^(((\d+\.\d+)|(\d+))(\/((\d+\.\d+)|(\d+))){0,1}){0,1}/gi)[0]
    );

    if (typeof result === "undefined") result = 1;

    return result;
  };

  this.getUnit = function (input) {
    let result;

    result = input.match(/[a-z]*$/gi)[0];

    return result;
  };

  this.getReturnUnit = function (initUnit) {
    let result;

    const units = [
      ["gal", "L"],
      ["lbs", "kg"],
      ["mi", "km"],
    ];

    for (let i = 0; i < units.length; ++i) {
      if (initUnit == units[i][0]) return units[i][1];
      if (initUnit == units[i][1]) return units[i][0];
    }

    return result;
  };

  this.spellOutUnit = function (unit) {
    let result;

    return result;
  };

  this.convert = function (initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    let result;

    return result;
  };

  this.getString = function (initNum, initUnit, returnNum, returnUnit) {
    let result;

    return result;
  };
}

module.exports = ConvertHandler;
