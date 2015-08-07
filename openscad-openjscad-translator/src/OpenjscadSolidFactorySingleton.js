define("OpenjscadSolidFactorySingleton", ["OpenjscadSolidFactory"], function(OpenjscadSolidFactory){
    var factory = new OpenjscadSolidFactory();
	
	return {
        getInstance: function(){ 
            return factory; 
        }
    }
});