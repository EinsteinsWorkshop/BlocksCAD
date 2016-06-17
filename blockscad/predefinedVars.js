/**
@license
Copyright 2015 Hendrik Diel

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

@fileoverview
this file enables predefined variables. You can add a variables by calling
addPredefinedVar(name) and remove by calling removePredefinedVar(name).
@author
diel.hendrik@gmail.com (Hendrik Diel)
*/
(function(){
  Blockly.Variables.predefinedVars = [];
  Blockly.Variables.addPredefinedVar = function(name){
    Blockly.Variables.predefinedVars.push(name);
  };
  
  Blockly.Variables.removePredefinedVar = function(name){
    var index = array.indexOf(name);
    if (index > -1) {
      Blockly.Variables.predefinedVars.splice(index, 1);
    }
  };
  
  var old = Blockly.Variables.allVariables;
  Blockly.Variables.allVariables = function(root) {
    var vars = old.call(this, root);
    Blockly.Variables.predefinedVars.forEach(function(x){
      if(vars.indexOf(x) < 0)
      vars.push(x);
    });
    return vars;
  };
})();
