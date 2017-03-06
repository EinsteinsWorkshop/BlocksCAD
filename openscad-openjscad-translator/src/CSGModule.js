define("CSGModule", ["Globals", "Context"], function(Globals, Context){

	function CSGModule(factory, csgOperation){
        this.csgOperation = csgOperation;
        this.factory = factory;
    };

    CSGModule.prototype.evaluate = function(parentContext, inst){
        var context = new Context(parentContext);

        var childModules = []

        // console.log("in csgmodule.prototype.evaluate.  inst.children is:", inst.children);

        for (var i = 0; i < inst.children.length; i++) {
            // console.log("found child :" + i + ", " + inst.children[i].name);

            var childInst = inst.children[i];
            childInst.argvalues = [];
            _.each(childInst.argexpr, function(expr,index,list) {
                childInst.argvalues.push(expr.evaluate(context));
            });
            
            var childAdaptor = this.factory.getAdaptor(childInst);
            var evaluatedChild = childAdaptor.evaluate(parentContext, childInst);

            // in the difference block, if the first child doesn't have anything, then I don't want to perform an operation.
            // because nothing minus a bunch of stuff is still nothing.
            // test with an empty procedure in the top bay showed that it evaluates to "undefined".

            if (i == 0 && this.csgOperation == "subtract") {
                // console.log("first child in a difference evaluated to:", evaluatedChild);
                if (evaluatedChild == undefined)
                    return [];
            }
            if (evaluatedChild !== undefined){
                childModules.push(evaluatedChild);
            }
        };

        childModules = _.flatten(childModules);
        // console.log("in CSGModule.  child modules are:");
        // console.log(childModules.length);




        // remove children that have no shape
        for (var k = 0; k < childModules.length; k++) {
            // console.log("do I need to throw this child out?", this.evaluatedChildren[k]);
            if (typeof(childModules[k]) == "string" && childModules[k].charAt(0) == '.') {
                // this should have started with a shape, not a '.'.  Take it out of the list
                childModules.splice(k,1);
            }
        }  

        // group shouldn't actually do anything to save on the implicit union cost.
        if (this.csgOperation == "group") {
            // this.csgOperation = "union";
            return childModules;
        }

        // hull should act on a single non-convex shape
        // .hull() doesn't work well.  I need to say shape.hull(shape).
        if (this.csgOperation == 'hull' && childModules.length == 1) {
                return childModules[0] + ".hull(" + childModules[0] + ")";
        }
        else if (childModules.length <= 1){
            return childModules[0];
        } else {
            // console.log("lots of child modules to CSG operate on");
            return childModules[0] + "."+this.csgOperation+"([" + childModules.slice(1).join(',\n') + "])";
        }
    };

    return CSGModule;	
});