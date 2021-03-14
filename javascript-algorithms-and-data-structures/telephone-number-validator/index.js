/*
 *    Author: Samuele Girgenti
 *    Date: 14 / 03 / 2021
 */

//telephone number validator
function telephoneCheck(str) {

    let regex = /^1{0,1}\s*(\(\d{3}\)|\d{3})[\s-]*\d{3}[\s-]*\d{4}$/;
    return regex.test(str);
  
}
  
console.log(telephoneCheck("(555)555-5555"));
//result: true