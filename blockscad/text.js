
// Copyright (C) 2014-2015  H3XL, Inc

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.


// file overview
// Code related to loading and rendering text for BlocksCAD

'use strict';

// create Blockscad namespace
var Blockscad = Blockscad || {};

// Hold pre-loaded font object created by opentype.js
Blockscad.fonts = {};


// List and location of fonts to load into BlocksCAD
Blockscad.fontList = ['/fonts/liberation/LiberationSerif-Bold.ttf',
                      '/fonts/Roboto/Roboto-Bold.ttf',
                      '/fonts/nimbus/nimbus-sans-l_bold.ttf',
                      '/fonts/AverageMono/AverageMonoSimp.ttf',
                      '/fonts/Open_Sans/OpenSans-ExtraBold.ttf',
                      '/fonts/Chewy/Chewy.ttf',
                      '/fonts/bangers/bangers.ttf'];

// display names for fonts, used in font block (also used to key fonts object)
Blockscad.fontName = ['Liberation Serif',
                      'Roboto',
                      'Nimbus Sans',
                      'Average Mono',
                      'Open Sans',
                      'Chewy',
                      'Bangers']; 


// pre-load all fonts in Blockscad.fontList
// calls the loadFont() function because of asynchronous font load
Blockscad.loadFonts = function() {
  for (var i = 0; i < Blockscad.fontList.length; i++) {
    Blockscad.loadFont(i);
  }
}
Blockscad.loadFont = function(index) {
  opentype.load(Blockscad.fontList[index], function(err, font) {
    if (err) {
      console.log('Could not load font: ', font + ":" + err);
    } else {
      Blockscad.fonts[Blockscad.fontName[index]] = font;
      return font; // if I do this, can I use this in synchronous code?
    }
  });
}

Blockscad.loadFontThenRender = function(i,code) {
  try {
    opentype.load(Blockscad.fontList[Blockscad.loadTheseFonts[i]], function(err, font) {
      if (err) {
        console.log('Could not load font: ', font + ":" + err);
      } else {
        Blockscad.fonts[Blockscad.fontName[Blockscad.loadTheseFonts[i]]] = font; // save the loaded fonts
        Blockscad.numloaded++;
        if (Blockscad.numloaded == Blockscad.loadTheseFonts.length) Blockscad.renderCode(code);       
      }
    });    
  }
  catch(err) {
    console.log("network error loading font");
  }
}


// pathToPoints() takes a Path object created by opentype.js
// resolution is a number used for the number of points used
// to approximate a curve in the font path
// returns an array of points and an array of paths
// NOTE: web svg coordinates have flipped Y coordinates
// (increasing positive as you move down)
// so all Y coordinates are multiplied by -1
Blockscad.pathToPoints = function(path,resolution) {

  var points = [];
  var paths = []
  var new_path = [];
  var fn = 2;   // default resolution in case resolution is not >= 2

  if (resolution > 2) fn = resolution; 

  if (fn > 10) fn = 10;  // cap the resolution for performance

  // console.log(path.commands);

  if (path && path.commands && path.commands.length > 0) {
    // hopefully got a legal path
    var point_index = 0;  
    var prev = [];  // save the previous point for curves
    for (var i = 0; i < path.commands.length; i++) {
      switch(path.commands[i].type) {
        case 'M':
          // save, then clear, the last path
          if (new_path.length>2) {
            paths.push(new_path);
          }
          new_path = [];
          // load up the new point
          points.push([path.commands[i].x, -1 * path.commands[i].y])
          new_path.push(point_index++);
          prev = [path.commands[i].x, -1 * path.commands[i].y];
          break;
        case 'L':
          // load up the new point
          points.push([path.commands[i].x, -1 * path.commands[i].y])
          new_path.push(point_index++);
          prev = [path.commands[i].x, -1 * path.commands[i].y];
          break;
        case 'C':

          // Cubic Bezier curve
          // uses two control points c1(x1,y1) and c2(x2,y2)
          // the previous point prev[x,y], and current point to[x,y]
          var to = [path.commands[i].x, -1 * path.commands[i].y]; 
          var c1 = [path.commands[i].x1, -1 * path.commands[i].y1];
          var c2 = [path.commands[i].x2, -1 * path.commands[i].y2];

          // approximate the curve with fn points
          for (var k=1;k<=fn;k++) {
            var a = k / fn;
            var nx = prev[0] * Math.pow(1-a,3) + 
                     c1[0] * 3 * Math.pow(1-a,2) * a +
                     c2[0] * 3 * Math.pow(1-a,1) * a * a +
                     to[0] * Math.pow(a,3); 
            var nx = prev[1] * Math.pow(1-a,3) + 
                     c1[1] * 3 * Math.pow(1-a,2) * a +
                     c2[1] * 3 * Math.pow(1-a,1) * a * a +
                     to[1] * Math.pow(a,3); 
            // load up this new point
            points.push([nx,ny]);
            new_path.push(point_index++);
          }

          prev = to;
          break;
        case 'Q':
          // Quadratic Bezier curve
          // uses one control point c1[x1,y1]
          // the previous point prev[x,y], and current point to[x,y]
          var to = [path.commands[i].x, -1 * path.commands[i].y]; 
          var c1 = [path.commands[i].x1, -1 * path.commands[i].y1];
          for (var k=1;k<=fn;k++) {
            var a = k / fn; 
            var nx = prev[0] * Math.pow(1-a,2) + 
                     c1[0] * 2 * Math.pow(1-a,1) * a +
                     to[0] * Math.pow(a,2); 
            var ny = prev[1] * Math.pow(1-a,2) + 
                     c1[1] * 2 * Math.pow(1-a,1) * a +
                     to[1] * Math.pow(a,2); 
            // load up this new point
            points.push([nx,ny]);
            new_path.push(point_index++);
          }

          prev = to;
          break;
        case 'Z':
          // log the old path
          if (new_path.length>2) {
            paths.push(new_path);
            new_path = [];
          }
          break;
      }  // end switch commands
    }
  }
  // else console.log("no path found");
  // fix case with a Path with just an MZ
  if (points.length < 3) points = [];
  return [points,paths];

}

Blockscad.whichFonts = function(code) {
  var loadThisIndex = [];
  for (var i = 0; i < Blockscad.fontList.length; i++) {
    if (code.indexOf(Blockscad.fontName[i]) > -1)
      if (!Blockscad.fonts[Blockscad.fontName[i]])
        loadThisIndex.push(i);
  }
  return loadThisIndex;
}