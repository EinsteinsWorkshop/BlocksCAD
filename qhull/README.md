qhull.js
========
A JavaScript port of [qhull](http://www.qhull.org/).

Installation
============
Via [npm](http://npmjs.org):

    npm install qhull-js

Example
=======
Here is an example showing how to compute the convex hull of a set of points:

    console.log(require("qhull-js")([[0, 0], [10, 0], [0, 10], [10, 10], [5, 5]]));

Prints:

    [ [ 1, 0 ], [ 2, 0 ], [ 3, 1 ], [ 3, 2 ] ]

`require("qhull-js")(points)`
--------------------------
This function computes the n-dimensional convex hull of a collection of points.

* `points` is an array of length n-arrays of points

Returns the convex hull of `points` represented by an array of facets each encoded as indices into `points`.

Notes
=====
Currently, the library weighs in at around 3MB unminified.  Patches welcome!

Credits
=======
QHull is (c)1993-2013 C.B. Barber  (See COPYING.txt)

JavaScript port by Mikola Lysenko, 2013