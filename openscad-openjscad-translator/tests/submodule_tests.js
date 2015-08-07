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

    var filedir = "submodule_tests/";

    function parse(s) {
        return parser.parse(s);
    }

    function check(testFileName) {
        var test = fs.readFileSync(filedir+testFileName+".scad", "utf8");
        var expected = fs.readFileSync(filedir+testFileName+".jscad", "utf8").replace(/\n/g,'');
        var actual = parse(test).lines.join('').replace(/\n/g,'');
        assert.equal(actual, expected, console.log(testFileName));
    }

	exports["test transformed submodule"] = function() {
	    check("transformedSubmoduleEx1");
	}


	exports["test transformed submodule with extra line"] = function() {
		check("transformedSubmoduleEx2");
	}

	exports["test transformed submodule with color mod"] = function() {
		check("transformedSubmoduleEx3");
	}

	exports["test nested submodules"] = function() {
		check("nestedSubmoduleEx1");
		check("nestedSubmoduleEx2");
	}


	if(module === require.main) require("test").run(exports);

});