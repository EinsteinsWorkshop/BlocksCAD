
// var bits = require("bit-twiddle");

var run_qhull = cwrap('run_qhull', 'pointer', ['pointer', 'number', 'number', 'pointer']);

var QHULL_POINT_BUFFER = _malloc(16 * 4096);
var QHULL_POINT_BUFFER_SIZE = 16* 4096;
var FACET_COUNT_POINTER = _malloc(4);

function executeQHull(points, options) {
  if(points.length === 0) {
    return [];
  }
  if(!options) {
    options = {};
  }
  
  //Reallocate buffers
  var dimension = points[0].length;
  var count = points.length;
  var size = dimension * count;
  if(size * 8 > QHULL_POINT_BUFFER_SIZE) {
    _free(QHULL_POINT_BUFFER);
    var v = size * 8;
    v--;
    v |= v >> 1;
    v |= v >> 2;
    v |= v >> 4;
    v |= v >> 8;
    v |= v >> 16;
    v++;
    QHULL_POINT_BUFFER_SIZE = 8 * v;
    // QHULL_POINT_BUFFER_SIZE = bits.nextPow(size * 8);
    QHULL_POINT_BUFFER = _malloc(QHULL_POINT_BUFFER_SIZE);
  }
  
  //Copy points into buffer
  var offset = QHULL_POINT_BUFFER >>> 3;
  for(var i=0; i<count; ++i) {
    var p = points[i];
    for(var j=0; j<dimension; ++j) {
      Module.HEAPF64[offset++] = p[j];
    }
  }
  
  //Call the library
  var facets = run_qhull(QHULL_POINT_BUFFER, count, dimension, FACET_COUNT_POINTER);
  
  //Unbox facets back into native JS
  var facet_count = Module.HEAP32[FACET_COUNT_POINTER>>2];
  var result = new Array(facet_count);
  var cur_ptr = facets>>2;
  for(var i=0; i<facet_count; ++i) {
    var c_facet = [];
    while(true) {
      var idx = Module.HEAP32[cur_ptr++];
      if(idx < 0) {
        break;
      }
      c_facet.push(idx);
    }
    result[i] = c_facet;
  }
  
  return result;
}

// module.exports = executeQHull;