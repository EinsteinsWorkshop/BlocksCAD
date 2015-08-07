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

    var filedir = "conditional_and_iterator_functions/";

    function parse(s) {
        return parser.parse(s);
    }

    function check(testFileName) {
        var test = fs.readFileSync(filedir+testFileName+".scad", "utf8");
        var expected = fs.readFileSync(filedir+testFileName+".jscad", "utf8").replace(/\n/g,'');
        var actual = parse(test).lines.join('').replace(/\n/g,'');
        assert.equal(actual, expected);
    }

    exports["test for loop"] = function() {
        check("forLoopEx1");
        check("forLoopEx2a");
        check("forLoopEx2b");
        check("forLoopEx3");
        check("forLoopEx4");
    }

    exports["test intersection_for loop"] = function() {
        check("intersectionForLoopEx1");
        check("intersectionForLoopEx2");
    }

    exports["test if statement"] = function() {
        check("ifStatementEx1");
    }


    exports["test assign statement"] = function() {
        assert.fail("todo ");
    }

    if(module === require.main) require("test").run(exports);
});