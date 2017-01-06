define("ControlModules", ["Globals", "Context", "Range"], function(Globals, Context, Range){

	function ControlModule(factory){
        this.factory = factory;
    };
    
    function IfStatement(a){
        ControlModule.call(this, a);
    };

    IfStatement.prototype.evaluate = function(parentContext, inst){
        inst.argvalues = [];

        _.each(inst.argexpr, function(expr,index,list) {
            inst.argvalues.push(expr.evaluate(parentContext));
        });

        var context = Context.newContext(parentContext, [], [], inst);

        var childrenToEvaluate = (inst.argvalues.length > 0 && inst.argvalues[0])? inst.children : inst.else_children;

        var childModules = [];

        for (var i = 0; i < childrenToEvaluate.length; i++) {

            var childInst = childrenToEvaluate[i];

            childInst.argvalues = [];

            _.each(childInst.argexpr, function(expr,index,list) {
                childInst.argvalues.push(expr.evaluate(context));
            });

            var childAdaptor = this.factory.getAdaptor(childInst);

            childModules.push(childAdaptor.evaluate(context, childInst));
        };
        // if children can be pretty weird (deeply nested arrays).
        // I'm not going to check for bad children until I get a bug report with these.
        // remove children that have no shape
        for (var k = 0; k < childModules.length; k++) {
            // console.log("trying to remove if children that have no shape");
            // console.log("do I need to throw this child out?", childModules[k]);
            if (typeof(childModules[k]) == "string" && childModules[k].charAt(0) == '.') {
                // this should have started with a shape, not a '.'.  Take it out of the list
                childModules.splice(k,1);
            }
        }  

        if (_.isEmpty(childModules)){
            return undefined;
        } else {
            if (childModules.length > 1){
                return _.first(childModules)+".union([" + _.rest(childModules) + "])";
            } else {
                return childModules[0];
            }
        }
    };

    function ForLoopStatement(factory, args){
        // console.log("in ForLoopStatement");
        // console.log(this);
        // console.log(factory);
        // ControlModule.call(this, factory);
        this.factory = factory;
        this.csgOp = args.csgOp;
        this.evaluatedChildren = [];

        this.forEval = function(parentEvaluatedChildren, inst, recurs_length, call_argnames, call_argvalues, arg_context) {

            // console.log("*****In loop forEval function.");

            this.evaluatedChildren = parentEvaluatedChildren;
            // console.log("evaluated children are:", parentEvaluatedChildren);

            if (call_argnames.length > recurs_length) {
                // recurs_length always starts at 0.  Argnames seems to be an array with the loop variable.
                // for blockscad loops this array will always have length "1", and so code starts here.
                var it_name = call_argnames[recurs_length];
                var it_values = call_argvalues[recurs_length];
                // var context = new Context(arg_context);
                var context = arg_context;
                // console.log("created new context on loop create");
                // console.log("m  context:", context.vars);
                // if (context.parentContext)
                //     console.log("p  context:",context.parentContext.vars);

                // if (context.parentContext && context.parentContext.parentContext)
                //     console.log("pp context:",context.parentContext.parentContext.vars);

                if (it_values instanceof Range) {
                    var range = it_values;
                    if (range.end < range.begin) {
                        // if range.begin is bigger than range.end, swap the two values.
                        var t = range.begin;
                        range.begin = range.end;
                        range.end = t;
                    }
                    if (range.step > 0 && (range.begin-range.end)/range.step < 10000) {
                        // interesting. Loops are limited to 10000 steps.  Could I raise this?  Would it be a terrible idea?
                        for (var i = range.begin; i <= range.end; i += range.step) {
                            context.setVariable(it_name, i);
                            this.forEval(this.evaluatedChildren, inst, recurs_length+1, call_argnames, call_argvalues, context);
                        }
                    }
                }
                else if (_.isArray(it_values)) {
                    // console.log("----HELP!!!- I've got an array of values in my loop.  This shouldn't happen.");
                    for (var i = 0; i < it_values.length; i++) {
                        context.setVariable(it_name, it_values[i]);
                        this.forEval(this.evaluatedChildren, inst, recurs_length+1, call_argnames, call_argvalues, context);
                    }
                }
            } else if (recurs_length > 0) {     
                // this is one of my loop jobs.  the context should have the loop variable name and its value within the range.
                // var mycontext = new Context(arg_context);
                // console.log("in loop job, going over range");
                // console.log("m  context:", mycontext.vars);
                // if (mycontext.parentContext)
                //     console.log("p  context:",mycontext.parentContext.vars);

                // if (mycontext.parentContext && mycontext.parentContext.parentContext)
                //     console.log("pp context:",mycontext.parentContext.parentContext.vars);
                // if (mycontext.parentContext.parentContext && mycontext.parentContext.parentContext.parentContext)
                //     console.log("ppp context:",mycontext.parentContext.parentContext.parentContext.vars);            


                var evaluatedInstanceChildren = inst.evaluateChildren(arg_context);
                if (_.isArray(evaluatedInstanceChildren)){
                    this.evaluatedChildren = this.evaluatedChildren.concat(evaluatedInstanceChildren);
                } else {
                    this.evaluatedChildren.push(evaluatedInstanceChildren);
                }
            }
            if (_.isArray(this.evaluatedChildren)){
                // remove empty arrays (e.g. for loops containing only echo statements)
                this.evaluatedChildren = _.reject(this.evaluatedChildren, function(x){ return _.isEmpty(x); });
                // remove children that have no shape
                for (var k = 0; k < this.evaluatedChildren.length; k++) {
                    // console.log(this.evaluatedChildren[k]);
                    if (typeof(this.evaluatedChildren[k]) == "string" &&  this.evaluatedChildren[k].charAt(0) == '.') {
                        // this should have started with a shape, not a '.'.  Take it out of the list
                        this.evaluatedChildren.splice(k,1);
                    }
                }    



            }

            // console.log("here are loops evaluated children:", this.evaluatedChildren);

            // for (var i = 0; i < this.evaluatedChildren.length; i++) {
            //     console.log("i: " + i + ": " + this.evaluatedChildren[i] + "\n");
            // }
            // console.log("end of evaluated children");
            // Note: we union here so subsequent actions (e.g. translate) can be performed on the entire result of the for loop.
            if (_.isArray(this.evaluatedChildren) && this.evaluatedChildren.length > 1){
                // console.log("unioning more than one child in the loop");
                var unionedEvaluatedChildren = _.first(this.evaluatedChildren)+"."+this.csgOp+"([" + _.rest(this.evaluatedChildren) + "])";
                this.evaluatedChildren = [unionedEvaluatedChildren];
            }
            
            return this.evaluatedChildren;
        };
    };

    ForLoopStatement.prototype.evaluate = function(context, inst) {
        // console.log("in forloopstatement.prototype.evaluate. ");
        // console.log(context.parentContext.vars);
        // console.log(context.parentContext.parentContext.vars);

            var that = this;

            that.argvalues = [];

            _.each(this.argexpr, function(expr,index,list) {
                that.argvalues.push(expr.evaluate(context));
            });

            that.context = context;


        if (inst.context === undefined){
            inst.context = context;
        }

        var evaluatedThing = that.forEval([], inst, 0, inst.argnames, inst.argvalues, that.context);


            that.context = null;
            that.argvalues = [];        
        return evaluatedThing;
    };

    function Echo(a){
        ControlModule.call(this, a);
    };

    Echo.prototype.evaluate = function(parentContext, inst){
        var context = new Context(parentContext);
        var argvalues = [];
        
        _.each(inst.argexpr, function(expr,index,list) {
            argvalues.push(Globals.convertForStrFunction(expr.evaluate(context)));
        });

        // console.log("JY:1");
        // console.log(_.template("ECHO: <%=argvalues%>", {argvalues:argvalues}));
        // console.log("JY:2");

        return undefined;
    };


	return {
		Echo: Echo,
		ForLoopStatement: ForLoopStatement,
		IfStatement: IfStatement
	}

});