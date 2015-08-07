# openscad-openjscad-translator

Node module that translates OpenSCAD syntax (http://www.openscad.org/) into OpenJsCAD syntax (http://joostn.github.com/OpenJsCad/).

See: https://npmjs.org/package/openscad-openjscad-translator

## Install

	npm install openscad-openjscad-translator

## Usage

### Node

    var parser = require('openscad-openjscad-translator')
    var fs = require("fs");
    
    var openSCADText = fs.readFileSync("test.scad", "UTF8");
    var openJSCADResult = parser.parse(openSCADText);
    
    console.log(openJSCADResult);

### Web

    ...
    <script type="text/javascript" src="../lib/underscore.js"></script>
    <script type="text/javascript" src="../lib/jquery.js"></script>

    <script src="../dist/web-built.js"></script>

    <script type="text/javascript">
    $(function(){
      console.log(openscadOpenJscadParser.parse($('#txt').text()));
    })
    </script>
    ...

Include ```lib/underscore.js``` and ```dist/web-built.js``` and the **openscadOpenJscadParser** object will be available.  This has two attributes:
* **parse** - a function which accepts OpenSCAD text and returns OpenJsCAD text.
* **parser** - a Jison parser object which can be used for more advanced parsing (e.g. the **parse** method returns the text and the context object, allowing for processing of *use* statements.)

## Build

### Web

    node tools/r.js -o build-web.js

Creates a optimised script (with Almond AMD loader) in the ```dist``` folder.


## Develop

### Jison

    ./jison-build.sh

Compiles the Jison lexer/parser to an AMD module in the ```src``` folder called ```openscad-parser.js```.