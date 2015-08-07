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

    var filedir = "transformations/";

    function parse(s) {
        return parser.parse(s);
    }

    function check(testFileName) {
        var test = fs.readFileSync(filedir+testFileName+".scad", "utf8");
        var expected = fs.readFileSync(filedir+testFileName+".jscad", "utf8").replace(/\n/g,'');
        var actual = parse(test).lines.join('').replace(/\n/g,'');
        assert.equal(actual, expected, console.log(testFileName));
    }

    exports["test scale"] = function() {
        check("scaleEx1");
        check("scaleEx2");
    }

    exports["test rotate"] = function() {
        check("rotateEx1");
        check("rotateEx2");
    }

    exports["test translate"] = function() {
        check("translateEx1");
    }

    exports["test mirror"] = function() {
        check("mirrorEx1");
    }

    exports["test multmatrix"] = function() {
        check("multmatrixEx1");
        check("multmatrixEx2");
    }

    exports["test color"] = function() {
        check("colorEx1");
        check("colorEx1");
    }

    exports["test minkowski"] = function() {
        // todo
        assert.ok(false);
    }

    exports["test hull"] = function() {
        // todo
        assert.ok(false);
    }

    if(module === require.main) require("test").run(exports);

});