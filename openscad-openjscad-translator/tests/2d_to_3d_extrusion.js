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

    var filedir = "2d_to_3d_extrusion/";

    function parse(s) {
        return parser.parse(s);
    }

    function check(testFileName) {
        var test = fs.readFileSync(filedir+testFileName+".scad", "utf8");
        var expected = fs.readFileSync(filedir+testFileName+".jscad", "utf8").replace(/\n/g,'');
        var actual = parse(test).lines.join('').replace(/\n/g,'');
        assert.equal(actual, expected);
    }

    exports["test Linear Extrude"] = function() {
        check("linearExtrudeEx1");
        check("linearExtrudeEx2");
        check("linearExtrudeEx3");
        check("linearExtrudeEx4");
        check("linearExtrudeEx5");
        check("linearExtrudeEx6");
        check("linearExtrudeEx7");
    }

    if(module === require.main) require("test").run(exports);

});