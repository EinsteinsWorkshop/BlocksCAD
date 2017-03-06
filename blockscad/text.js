
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
Blockscad.fontList = ['/fonts/Roboto/Roboto-Bold.ttf',
                      '/fonts/liberation/LiberationSerif-Bold.ttf',
                      '/fonts/nimbus/nimbus-sans-l_bold.ttf',
                      '/fonts/AverageMono/AverageMonoSimp.ttf',
                      '/fonts/Open_Sans/OpenSans-ExtraBold.ttf',
                      '/fonts/stardos-stencil/StardosStencil-Bold.ttf',
                      '/fonts/Chewy/Chewy.ttf',
                      '/fonts/bangers/Bangers.ttf'];

// display names for fonts, used in font block (also used to key fonts object)
Blockscad.fontName = ['Roboto',
                      'Liberation Serif',
                      'Nimbus Sans',
                      'Average Mono',
                      'Open Sans',
                      'Stardos Stencil',
                      'Chewy',
                      'Bangers']; 


// pre-load all fonts in Blockscad.fontList
// calls the loadFont() function because of asynchronous font load
Blockscad.loadFonts = function() {
  for (var i = 0; i < Blockscad.fontList.length; i++) {
    Blockscad.loadFont(i);
  }
};
Blockscad.loadFont = function(index) {
  opentype.load(Blockscad.fontList[index], function(err, font) {
    if (err) {
      console.log('Could not load font: ', font + ":" + err);
    } else {
      Blockscad.fonts[Blockscad.fontName[index]] = font;
      return font; // if I do this, can I use this in synchronous code?
    }
  });
};


Blockscad.loadFontThenRender = function(i,code) {
  try {
    var name = Blockscad.fontName[Blockscad.loadTheseFonts[i]];
    var url = Blockscad.fontList[Blockscad.loadTheseFonts[i]];

    var request = new XMLHttpRequest();
    request.open('get', url, true);
    request.responseType = 'arraybuffer';
    request.onload = function() {
        if (request.status !== 200) {
            throw new Error('failed to load font in loadRawFont:' + url + request.statusText);
        }
        Blockscad.fonts[Blockscad.fontName[Blockscad.loadTheseFonts[i]]] = request.response; // save the loaded fonts
        Blockscad.numloaded++;
        if (Blockscad.numloaded == Blockscad.loadTheseFonts.length) Blockscad.renderCode(code);  
    };

    request.send();

    // opentype.load(Blockscad.fontList[Blockscad.loadTheseFonts[i]], function(err, font) {
    //   if (err) {
    //     console.log('Could not load font: ', font + ":" + err);
    //     // I'm not going to be rendering because of a lack of font.
    //     // need an error message in the render pane and set the render button active and "render"y.
    //     $( '#error-message' ).html("Error: Failed to load font: " + name);
    //     $( '#error-message' ).addClass("has-error");
    //     $('#renderButton').html('Render'); 
    //     $('#renderButton').prop('disabled', false);
    //   } else {
    //     Blockscad.fonts[Blockscad.fontName[Blockscad.loadTheseFonts[i]]] = font; // save the loaded fonts
    //     Blockscad.numloaded++;
    //     if (Blockscad.numloaded == Blockscad.loadTheseFonts.length) Blockscad.renderCode(code);       
    //   }
    // });    
  }
  catch(err) {
    console.log("network error loading font in loadFontThenRender with: ", err);
  }
};




Blockscad.whichFonts = function(code) {
  var loadThisIndex = [];
  for (var i = 0; i < Blockscad.fontList.length; i++) {
    if (code.indexOf(Blockscad.fontName[i]) > -1)
      if (!Blockscad.fonts[Blockscad.fontName[i]])
        loadThisIndex.push(i);
  }
  return loadThisIndex;
};