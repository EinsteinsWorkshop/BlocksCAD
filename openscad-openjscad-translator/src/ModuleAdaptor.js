define("ModuleAdaptor", ["Globals", "Context"], function(Globals, Context){

    function ModuleAdaptor(){};

    ModuleAdaptor.prototype.evaluate = function(parentContext, inst){
        inst.isSubmodule = true;
        console.log("moduleAdaptor with:", inst.name);
        return parentContext.evaluateModule(inst);
    };

    return ModuleAdaptor;

});