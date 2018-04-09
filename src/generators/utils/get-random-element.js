module.exports = function getRandomElement(arr) {
  let l = arr.length;
  let i = (Math.random() * l) | 0;
  return arr[i];
};
