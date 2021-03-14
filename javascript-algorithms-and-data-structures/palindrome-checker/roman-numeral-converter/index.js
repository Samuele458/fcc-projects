function convertToRoman(num) {
  const nums = [1, 4, 5, 9, 10, 39, 40];
  const rnums = ["I", "IV", "V", "IX", "X", "XXXIX", "XL"];

  let i = 0;
  let result;

  if (num == 0) return "";

  while (nums[i] <= num) {
    ++i;
  }

  if (num == nums[i - 1]) return rnums[i - 1] + " -";
  return rnums[i - 1] + convertToRoman(num - nums[i - 1]);
}

for (let i = 1; i < 47; ++i) console.log(i, convertToRoman(i));
