define("ModuleInstantiation", ["Globals", "OpenjscadSolidFactorySingleton"], function(Globals, OpenjscadSolidFactorySingleton){

	function ModuleInstantiation() {
        this.name;
        this.argnames = [];
        this.argvalues = [];
        this.argexpr = [];
        this.children = [];
        this.isSubmodule = false;
        this.context;
    };

    ModuleInstantiation.prototype.evaluate = function(context) {

        var evaluatedModule;

        // console.log("in moduleInstantiation.prototype.evaluate for", this.name);
        // console.log("m  context:", context.vars);
        // if (context.parentContext)
        //     console.log("p  context:",context.parentContext.vars);

        // if (context.parentContext && context.parentContext.parentContext)
        //     console.log("pp context:",context.parentContext.parentContext.vars);
        // NOTE: not sure how we should handle this in javascript ... is it necessary?
        //if (this.context === null) {
        //    console.log("WARNING: Ignoring recursive module instantiation of ", this.name);
        //} else {
            var that = this;

            this.argvalues = [];

            _.each(this.argexpr, function(expr,index,list) {
                that.argvalues.push(expr.evaluate(context));
            });

            that.context = context;

            evaluatedModule = context.evaluateModule(that, OpenjscadSolidFactorySingleton.getInstance());

            that.context = null;
            that.argvalues = [];

        //}
        return evaluatedModule;
    };

    ModuleInstantiation.prototype.evaluateChildren = function(context) {

        var childModules = []

        for (var i = 0; i < this.children.length; i++) {
            var childInst = this.children[i];
            
            var evaluatedChild = childInst.evaluate(context);
            if (evaluatedChild !== undefined){
                childModules.push(evaluatedChild);
            }
        };
        
        return childModules;
    };

	return ModuleInstantiation;
});