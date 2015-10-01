var qhull = require("../qhull.js");

var points = [
  [0, 0], [10, 0], [0, 10], [10, 10], [5, 5]
];
console.log(points);
console.log(qhull(points))

var points = [
  [0, 0, 0], [10, 0, 10], [0, 10, 5], [10, 10, 3], [5, 5, 16],
  [0, 5, 1], [0, 6, 2]
];
console.log(points);
console.log(qhull(points));

