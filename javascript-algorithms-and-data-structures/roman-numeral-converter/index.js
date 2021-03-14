/*
 *    Author: Samuele Girgenti
 *    Date: 14 / 03 / 2021
 */

//convert to roman number. Recursive approach
function convertToRoman(num) {
  const nums = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000];
  const rnums = [ "I", "IV", "V", 
                  "IX", "X", "XL",
                  "L", "XC", "C", 
                  "CD", "D", "CM", "M" ];
  let i = 0;

  //if num is zero return nothing
  if (num == 0) return "";

  //searching for the correct digit
  while (nums[i] <= num) {
    ++i;
  }

  if (num == nums[i - 1]) return rnums[i - 1];
  return rnums[i - 1] + convertToRoman(num - nums[i - 1]);
}

