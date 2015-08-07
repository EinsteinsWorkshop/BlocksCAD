var requirejs = require('requirejs');

requirejs.config({
    baseUrl: '../src',
    paths: {
        lib: '../lib'
    },
    nodeRequire: require
});

requirejs(["fs", "assert", "openscad-parser", "Globals", "openscad-parser-support", "lib/underscore"], 
    function(fs, assert, parser, Globals, parser_support) {

    var filedir = "primitive_solids/";

    function parse(s) {
        return parser.parse(s);
    }

    function check(testFileName) {
        var test = fs.readFileSync(filedir+testFileName+".scad", "utf8");
        var expected = fs.readFileSync(filedir+testFileName+".jscad", "utf8").replace(/\n/g,'');
        var actual = parse(test).lines.join('').replace(/\n/g,'');
        assert.equal(actual, expected, console.log(testFileName));
    }

    exports["test cube"] = function() {
        check("cubeEx1");
        check("cubeEx2");
    }

    exports["test sphere"] = function() {
        check("sphereEx1");
        check("sphereEx2");
    }


    exports["test cylinder"] = function() {
        check("cylinderEx1");
        check("cylinderEx2");
        check("cylinderEx3");
        check("cylinderEx5");
    }

    exports["test cylinder additional parameters"] = function() {
        check("cylinderEx4");
    }

    exports["test polyhedron"] = function() {
        check("polyhedronEx1");
        check("polyhedronEx2");
    }

    if(module === require.main) require("test").run(exports);

});