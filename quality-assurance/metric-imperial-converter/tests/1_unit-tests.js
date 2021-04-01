const chai = require("chai");
let assert = chai.assert;
const ConvertHandler = require("../controllers/convertHandler.js");

let convertHandler = new ConvertHandler();

suite("Unit Tests", function () {
  test("Whole number", function () {
    assert.equal(12, convertHandler.getNum("12L"));
  });

  test("Decimal number", function () {
    assert.equal(3.2, convertHandler.getNum("3.2L"));
  });

  test("Fractional number", function () {
    assert.equal(2, convertHandler.getNum("4/2L"));
  });

  test("Fractional number with decimal", function () {
    assert.equal(2.2, convertHandler.getNum("4.4/2L"));
  });

  test("Double fraction", function () {
    assert.isUndefined(convertHandler.getNum("3/2/3L"));
  });

  test("Default number", function () {
    assert.equal(1, convertHandler.getNum("km"));
  });

  test("Input units", function () {
    assert.equal("km", convertHandler.getUnit("3km"));
    assert.equal("gal", convertHandler.getUnit("3gal"));
    assert.equal("L", convertHandler.getUnit("3L"));
    assert.equal("lbs", convertHandler.getUnit("3lbs"));
    assert.equal("kg", convertHandler.getUnit("3kg"));
    assert.equal("mi", convertHandler.getUnit("3mi"));
  });

  test("Invalid unit", function () {
    assert.isUndefined(convertHandler.getUnit("3N"));
  });

  test("Return unit", function () {
    assert.equal("mi", convertHandler.getReturnUnit("km"));
    assert.equal("L", convertHandler.getReturnUnit("gal"));
    assert.equal("gal", convertHandler.getReturnUnit("L"));
    assert.equal("kg", convertHandler.getReturnUnit("lbs"));
    assert.equal("lbs", convertHandler.getReturnUnit("kg"));
    assert.equal("km", convertHandler.getReturnUnit("mi"));
  });

  test("Spelled-out units", function () {
    assert.equal("kilometers", convertHandler.spellOutUnit("km"));
    assert.equal("gallons", convertHandler.spellOutUnit("gal"));
    assert.equal("liters", convertHandler.spellOutUnit("L"));
    assert.equal("pounds", convertHandler.spellOutUnit("lbs"));
    assert.equal("kilograms", convertHandler.spellOutUnit("kg"));
    assert.equal("miles", convertHandler.spellOutUnit("mi"));
  });

  test("gal to L", function () {
    assert.equal(11.35623, convertHandler.convert(3, "gal"));
  });

  test("L to gal", function () {
    assert.equal(0.79252, convertHandler.convert(3, "L"));
  });

  test("km to mi", function () {
    assert.equal(1.86412, convertHandler.convert(3, "km"));
  });

  test("mi to km", function () {
    assert.equal(4.82802, convertHandler.convert(3, "mi"));
  });

  test("kg to lbs", function () {
    assert.equal(6.61387, convertHandler.convert(3, "kg"));
  });

  test("lbs to kg", function () {
    assert.equal(1.36078, convertHandler.convert(3, "lbs"));
  });
});
