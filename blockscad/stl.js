/*
    Copyright (C) 2014-2015  H3XL, Inc

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

function importSTL(stl,fn) {
  var isAscii = true;

  for (var i = 0; i < stl.length; i++) {
    if (stl[i].charCodeAt(0) == 0) {
      isAscii = false;
      break;
    }
  }

  console.log("STL file is ascii: ",isAscii);

  var stuff;
  if(isAscii) {
    stuff = importAsciiSTL(stl,fn);
  } else {
    stuff = importBinarySTL(stl,fn);
  }
  return stuff;
}

function importBinarySTL(stl,fn) {
    //fn = filename
    //http://en.wikipedia.org/wiki/STL_(file_format)#Binary_STL
    var vertices = [];
    var br = new BinaryReader(stl);
    
    br.seek(80); //skip the header

    var totalTriangles = br.readUInt32(); // total num of triangles in the stl
    // I want to get a "center" for the stl that I can put in a comment
    // for wayward stls.
    var minV = [10000,10000,10000];
    var maxV = [-10000,-10000,-10000];

    for (var tr = 0; tr < totalTriangles; tr++) {



    /*
        UINT8[80] – Header
        UINT32 – Number of triangles

        foreach triangle
        REAL32[3] – Normal vector
        REAL32[3] – Vertex 1
        REAL32[3] – Vertex 2
        REAL32[3] – Vertex 3
        UINT16 – Attribute byte count
        end */

    // -- read the normal vector, throw it away.
    br.readFloat();
    br.readFloat();
    br.readFloat();

    // -- The next three floats are the vertices, so save them
    var v1 = []; v1.push(br.readFloat()); v1.push(br.readFloat()); v1.push(br.readFloat());
    var v2 = []; v2.push(br.readFloat()); v2.push(br.readFloat()); v2.push(br.readFloat());
    var v3 = []; v3.push(br.readFloat()); v3.push(br.readFloat()); v3.push(br.readFloat());

    // check to see if any of the vertices were Not A Number
    var bad = 0;
    for(var i=0; i<3; i++) {
      if(isNaN(v1[i])) bad++;
      if(isNaN(v2[i])) bad++;
      if(isNaN(v3[i])) bad++;
    }
    if(bad > 0) {
      console.log("this many bad vertices: ",bad);
    }

    // read the attribute byte count.
    br.readUInt16();

    // if this was a good triangle, push the vertices onto the stack.
    if (!bad) {
      // got some vertices
      vertices.push(v1);
      vertices.push(v2);
      vertices.push(v3);

      // save max/min values for centering purposes
      for (var i=0; i<3; i++) {
        minV[i] = Math.min(minV[i],v1[i]);
        minV[i] = Math.min(minV[i],v2[i]);
        minV[i] = Math.min(minV[i],v3[i]);
        maxV[i] = Math.max(maxV[i],v1[i]);
        maxV[i] = Math.max(maxV[i],v2[i]);
        maxV[i] = Math.max(maxV[i],v3[i]);
      }
    }
  }

  if (bad) 
    console.log('WARNING: import errors: expect some missing or bad triangles\n');

  var center = [Math.round(maxV[0] - (maxV[0]-minV[0])/2),Math.round(maxV[1] - (maxV[1]-minV[1])/2),Math.round(maxV[2] - (maxV[2]-minV[2])/2)]

  // convert vertices to csg.js compatible code
  var src = vt2csg(vertices);
  return [src,center];
}

function importAsciiSTL(stl,fn) {
  var src = "";

  var vertices = [];
  var bad = 0;
  var j = 0;

  // I want to get a "center" for the stl that I can put in a comment
  // for wayward stls.
  var minV = [10000,10000,10000];
  var maxV = [-10000,-10000,-10000];
      
  var res = stl.split('\n');
  //console.log(res);
  //console.log("result length:",res.length);
  for (var i=0; i < res.length; i++) {
    // line by line we'll hunt down the vertices
    if (res[i].match(/facet/)) continue;
    if (res[i].match(/endloop/)) continue;
    if (res[i].match(/outer/)) {
      // get ready for the next triangle
      j = 0;
      bad = 0;
      var vdata = [];
      vdata[0] = [];
      vdata[1] = [];
      vdata[2] = [];
      continue;
    }
    if (res[i].match(/vertex/)) {
      // trim whitespace from the beginning and end of the line
      res[i] = res[i].replace(/^\s+|\s+$/g,'');
      var things = res[i].split(' ');
      vdata[j].push(parseFloat(things[1]));
      vdata[j].push(parseFloat(things[2]));
      vdata[j].push(parseFloat(things[3]));

      if(isNaN(vdata[j][0])) bad++;
      if(isNaN(vdata[j][1])) bad++;
      if(isNaN(vdata[j][2])) bad++;

      if(bad > 0) {
        console.log("this many bad vertices: ",bad);
        console.log("things are:",things);
      }
      // did I just finish the third vertex, and thus a triangle?
      // if this was a good triangle, push the vertices onto the stack.
      if (!bad && (++j == 3)) {
        vertices.push(vdata[0]);
        vertices.push(vdata[1]);
        vertices.push(vdata[2]);

                // save max/min values for centering purposes
        for (var k=0; k<3; k++) {
          minV[k] = Math.min(minV[k],vdata[0][k]);
          minV[k] = Math.min(minV[k],vdata[1][k]);
          minV[k] = Math.min(minV[k],vdata[2][k]);
          maxV[k] = Math.max(maxV[k],vdata[0][k]);
          maxV[k] = Math.max(maxV[k],vdata[1][k]);
          maxV[k] = Math.max(maxV[k],vdata[2][k]);
        }
      }
      continue;
    }
  }
  var center = [Math.round(maxV[0] - (maxV[0]-minV[0])/2),Math.round(maxV[1] - (maxV[1]-minV[1])/2),Math.round(maxV[2] - (maxV[2]-minV[2])/2)]
  src += vt2csg(vertices);
  return [src,center];
}

function vt2csg(v) {     //vertices and triangles
  var src = '';
  src += "CSG.fromPolygons([";
  for (var p=0; p<v.length/3; p++) {
    // each new polygon adds three vertex vectors
    src += "new CSG.Polygon([";
    for (var i=0;i<3;i++) {
      src += "new CSG.Vertex(new CSG.Vector3D([";
      src += v[p*3 + i] + ']))' ;
      if (i < 2) src += ',';
    }
    src += '])';
    if (p < (v.length/3)-1) src += ',';
  }
  src += '])';
  return src;
}

// BinaryReader
// Refactored by Vjeux <vjeuxx@gmail.com>
// http://blog.vjeux.com/2010/javascript/javascript-binary-reader.html

// Original
//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/classes/binary-parser [rev. #1]

var BinaryReader = function (data) {
 this._buffer = data;
 this._pos = 0;
};

BinaryReader.prototype = {

 /* Public */

 readInt8:   function (){ return this._decodeInt(8, true); },
 readUInt8:  function (){ return this._decodeInt(8, false); },
 readInt16:  function (){ return this._decodeInt(16, true); },
 readUInt16: function (){ return this._decodeInt(16, false); },
 readInt32:  function (){ return this._decodeInt(32, true); },
 readUInt32: function (){ return this._decodeInt(32, false); },

 readFloat:  function (){ return this._decodeFloat(23, 8); },
 readDouble: function (){ return this._decodeFloat(52, 11); },

 readChar:   function () { return this.readString(1); },
 readString: function (length) {
  this._checkSize(length * 8);
  var result = this._buffer.substr(this._pos, length);
  this._pos += length;
  return result;
},

seek: function (pos) {
  this._pos = pos;
  this._checkSize(0);
},

getPosition: function () {
  return this._pos;
},

getSize: function () {
  return this._buffer.length;
},


/* Private */

_decodeFloat: function(precisionBits, exponentBits){
  var length = precisionBits + exponentBits + 1;
  var size = length >> 3;
  this._checkSize(length);

  var bias = Math.pow(2, exponentBits - 1) - 1;
  var signal = this._readBits(precisionBits + exponentBits, 1, size);
  var exponent = this._readBits(precisionBits, exponentBits, size);
  var significand = 0;
  var divisor = 2;
      var curByte = 0; //length + (-precisionBits >> 3) - 1;
      do {
       var byteValue = this._readByte(++curByte, size);
       var startBit = precisionBits % 8 || 8;
       var mask = 1 << startBit;
       while (mask >>= 1) {
        if (byteValue & mask) {
         significand += 1 / divisor;
       }
       divisor *= 2;
     }
   } while (precisionBits -= startBit);

   this._pos += size;

   return exponent == (bias << 1) + 1 ? significand ? NaN : signal ? -Infinity : +Infinity
   : (1 + signal * -2) * (exponent || significand ? !exponent ? Math.pow(2, -bias + 1) * significand
     : Math.pow(2, exponent - bias) * (1 + significand) : 0);
 },

 _decodeInt: function(bits, signed){
  var x = this._readBits(0, bits, bits / 8), max = Math.pow(2, bits);
  var result = signed && x >= max / 2 ? x - max : x;

  this._pos += bits / 8;
  return result;
},

   //shl fix: Henri Torgemane ~1996 (compressed by Jonas Raoni)
   _shl: function (a, b){
    for (++b; --b; a = ((a %= 0x7fffffff + 1) & 0x40000000) == 0x40000000 ? a * 2 : (a - 0x40000000) * 2 + 0x7fffffff + 1){};
      return a;
  },

  _readByte: function (i, size) {
    return this._buffer.charCodeAt(this._pos + size - i - 1) & 0xff;
  },

  _readBits: function (start, length, size) {
    var offsetLeft = (start + length) % 8;
    var offsetRight = start % 8;
    var curByte = size - (start >> 3) - 1;
    var lastByte = size + (-(start + length) >> 3);
    var diff = curByte - lastByte;

    var sum = (this._readByte(curByte, size) >> offsetRight) & ((1 << (diff ? 8 - offsetRight : length)) - 1);

    if (diff && offsetLeft) {
     sum += (this._readByte(lastByte++, size) & ((1 << offsetLeft) - 1)) << (diff-- << 3) - offsetRight; 
   }

   while (diff) {
     sum += this._shl(this._readByte(lastByte++, size), (diff-- << 3) - offsetRight);
   }

   return sum;
 },

 _checkSize: function (neededBits) {
  if (!(this._pos + Math.ceil(neededBits / 8) < this._buffer.length)) {
         //throw new Error("Index out of bound");
       }
     }
   };
