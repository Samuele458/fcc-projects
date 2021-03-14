function convertToRoman(num) {
  const nums = [1, 4, 5, 9, 10, 40, 50, 90, 100, 400, 500, 900, 1000];
  const rnums = [ "I", "IV", "V", 
                  "IX", "X", "XL",
                  "L", "XC", "C", 
                  "CD", "D", "CM", "M" ];

  let i = 0;
  let result;

  if (num == 0) return "";

  while (nums[i] <= num) {
    ++i;
  }

  if (num == nums[i - 1]) return rnums[i - 1];
  return rnums[i - 1] + convertToRoman(num - nums[i - 1]);
}

//for (let i = 220; i < 239; ++i) console.log(i, convertToRoman(i));
