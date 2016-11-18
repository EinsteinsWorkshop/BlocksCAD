/**
 * @license
 * Visual Blocks Language
 *
 * Copyright 2012 Google Inc.
 * https://blockly.googlecode.com/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Generating OpenSCAD for variable blocks.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.OpenSCAD.variables');

goog.require('Blockly.OpenSCAD');

Blockscad = Blockscad || {};


Blockly.OpenSCAD['variables_get'] = function(block) {
  // Variable getter.
  var code = Blockly.OpenSCAD.variableDB_.getName(block.getFieldValue('VAR'),
      Blockly.Variables.NAME_TYPE);
  var commented_code = '//' + code;
  if (block.getParent())
    return [code, Blockly.OpenSCAD.ORDER_ATOMIC];
  else return [commented_code, Blockly.OpenSCAD.ORDER_ATOMIC];
};

Blockly.OpenSCAD['variables_set'] = function(block) {
  // Variable setter.
  var argument0 = Blockly.OpenSCAD.valueToCode(block, 'VALUE',
      Blockly.OpenSCAD.ORDER_ASSIGNMENT) || '0';
  var varName = Blockly.OpenSCAD.variableDB_.getName(
      block.getFieldValue('VAR'), Blockly.Variables.NAME_TYPE);

  // if the parent stack has a block that isn't a variables_set or a module definition, 
  // then this is a hacked variable that needs to act like an assign.
  // it will be detected by its parent and will be encoded there.

  // this isn't right.  I need to check to the nearest scope.  if the first scope I hit is a transform or set-op,
  // instead of a module definition or nothing, then I want to kick out of this code.

  if (Blockscad.doVariableHack(block))
      return '';
 

  // this is a regular variable, just hanging out.  Code it.
  return varName + ' = ' + argument0 + ';\n';
};

