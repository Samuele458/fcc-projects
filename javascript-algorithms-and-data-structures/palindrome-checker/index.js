/*
 *    Author: Samuele Girgenti
 *    Date: 14 / 03 / 2021
 */

//check palindrome
function palindrome(str) {
  //sanitizing the string.
  let holdStr = str
    .toLowerCase()
    .split(/[^A-Za-z0-9]+/)
    .join("");

  //checking if string is palindrome
  for (let i = 0; i < holdStr.length / 2; ++i) {
    if (holdStr[i] != holdStr[holdStr.length - 1 - i]) return false; //string is not palindrome
  }

  //string is palindrome
  return true;
}

palindrome("0_0 (: /-* :) 0-0");
