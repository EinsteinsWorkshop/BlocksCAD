define("ImportModule", ["Globals", "Context", "StlDecoder"], function(Globals, Context, StlDecoder){

	function Import(factory){
		this.factory = factory;
    };

    Import.prototype.evaluate = function(parentContext, inst){
        
        // JY - I couldn't figure out how to get the importCache to work.
        // also, I don't want to decode the stl more than once, and this gets called on every render.
        // so, when the stl is imported in BlocksCAD, I do the decoding there and store the 
        // result in a variable.  Here I should just have to retrieve the contents of that
        // variable and send it along.

        var context = new Context(parentContext);

        var argnames = ["file", "filename", "convexity"];
        var argexpr = [];

        context.args(argnames, argexpr, inst.argnames, inst.argvalues);
        
        var filename = Context.contextVariableLookup(context, "file", null)||Context.contextVariableLookup(context, "filename", null);
        var csg = "";

        //var convexity = Context.contextVariableLookup(context, "convexity", 5);

        //var importCache = Context.contextVariableLookup(context, "importCache", {});

        //var fileContents = importCache[filename];

        // once I have the filename, I need to figure out what it's "key" name is.
        for (var key in Blockscad.csg_filename) {
            var result = Blockscad.csg_filename[key].split(":::");
            for (var i = 0; i < result.length;i++) {
                if (result[i] == filename) {
                    csg = Blockscad.csg_commands[key];
                    break;
                }
            }
        }

        if (csg.length > 0)
            return csg;



        // if (fileContents !== undefined){

        //     var stlDecoder = new StlDecoder(atob(fileContents));
        //     stlDecoder.decode();
        //     return stlDecoder.getCSGString();
        // }

        return undefined;
    };

    return Import;

});