/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
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
 * @fileoverview Variable blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.variables');

goog.require('Blockly.Blocks');



Blockly.Blocks['variables_get'] = {
  /**
   * Block for variable getter.
   * @this Blockly.Block
   */
  init: function() {
    // this.initialized_type = 0;  // for blockscad - to keep onchange from churning
    this.setHelpUrl(Blockly.Msg.VARIABLES_GET_HELPURL);
    this.setColour(Blockscad.Toolbox.HEX_VARIABLE);
    this.appendDummyInput()
        .appendField(new Blockly.FieldVariable(
        Blockly.Msg.VARIABLES_DEFAULT_NAME), 'VAR');
    this.setOutput(true);
    this.setTooltip(Blockly.Msg.VARIABLES_GET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_GET_CREATE_SET;

    // get my "type" from my corresponding variables_set block
    var all_of_them = Blockly.Variables.getInstances(this.getFieldValue('VAR'), this.workspace);
    // console.log(all_of_them);
    var found_it = 0;
    for (var i = 0; i < all_of_them.length; i++) {
      if (all_of_them[i].type == 'variables_set') {
        this.outputConnection.setCheck(all_of_them[i].myType_);
        // console.log("vars_get " + this.id + " was initialized to " + all_of_them[i].myType_);
        found_it = 1;
        break;
      }
      if (all_of_them[i].type == 'controls_for' || all_of_them[i].type == 'controls_for_chainhull') {
        this.outputConnection.setCheck(null);
        found_it = 1;
      }
    }
    if (!found_it) {
      // this has no variables_set block... Could be from a procedure.
      // since I don't know it's type, set it to null.
      // console.log("is there a variable instance from a procedure here?");
      this.outputConnection.setCheck(null);
    }  

  },
  contextMenuType_: 'variables_set',
  // /**
  //  * Return all variables referenced by this block.
  //  * @return {!Array.<string>} List of variable names.
  //  * @this Blockly.Block
  //  */
  // getVars: function() {
  //   return [this.getFieldValue('VAR')];
  // },
  // /**
  //  * Notification that a variable is renaming.
  //  * If the name matches one of this block's variables, rename it.
  //  * @param {string} oldName Previous name of variable.
  //  * @param {string} newName Renamed variable.
  //  * @this Blockly.Block
  //  */
  // renameVar: function(oldName, newName) {
  //   if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
  //     this.setFieldValue(newName, 'VAR');
  //   }
  // },
  /**
   * onchange: happens on EVERY WORKSPACE CHANGE
   * because I need to type variables_get blocks before the user 
   * has a chance to try plugging them in
   * - could I do this code during init?  Would that make sense?
   */
  // onchange: function() {
  //   if (this.initialized_type == 0) {
  //     // console.log("initializing a new variables_get: id ", this.id);
  //     this.initialized_type = 1;

  //     // get my "type" from my corresponding variables_set block
  //     var all_of_them = Blockly.Variables.getInstances(this.getFieldValue('VAR'), this.workspace);
  //     var found_it = 0;
  //     for (var i = 0; i < all_of_them.length; i++) {
  //       if (all_of_them[i].type == 'variables_set') {
  //         this.outputConnection.setCheck(all_of_them[i].myType_);
  //         console.log("vars_get " + this.id + " was initialized to " + all_of_them[i].myType_);
  //         found_it = 1;
  //         break;
  //       }
  //       if (all_of_them[i].type == 'controls_for' || all_of_them[i].type == 'controls_for_chainhull') {
  //         this.outputConnection.setCheck(null);
  //         found_it = 1;
  //       }
  //     }
  //     if (!found_it) {
  //       // this has no variables_set block... Could be from a procedure.
  //       // since I don't know it's type, set it to null.
  //       // console.log("is there a variable instance from a procedure here?");
  //       this.outputConnection.setCheck(null);
  //     }      
  //   }
  // },
  /**
   * Add menu option to create getter/setter block for this setter/getter.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    var name = this.getFieldValue('VAR');
    option.text = this.contextMenuMsg_.replace('%1', name);
    var xmlField = goog.dom.createDom('field', null, name);
    xmlField.setAttribute('name', 'VAR');
    var xmlBlock = goog.dom.createDom('block', null, xmlField);
    xmlBlock.setAttribute('type', this.contextMenuType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);
  
    // for BlocksCAD, 
    var option = {enabled: true};
    option.text = Blockscad.Msg.HIGHLIGHT_INSTANCES.replace("%1", name);
    var workspace = this.workspace;
    var thisVar = this;
    option.callback = function() {
      var instances = Blockly.Variables.getInstances(name,workspace); 
      workspace.clearBacklight();
      thisVar.unselect();
      for (var i = 0; instances && i < instances.length; i++) {
        instances[i] && instances[i].backlight();
        // if caller block is in a collapsed parent, highlight collapsed parent too
        var others = instances[i].collapsedParents();
        if (others)
          for (var j=0; j < others.length; j++) 
            others[j].backlight(); 
      }
    };
    options.push(option);  
  }
};

Blockly.Blocks['variables_set'] = {
  /**
   * Block for variable setter.
   * @this Blockly.Block
   */
  init: function() {
    this.myType_ = null;       // for blocksCAD
    this.backlightBlocks = []; // for blocksCAD
    this.jsonInit({
      "message0": Blockly.Msg.VARIABLES_SET,
      "args0": [
        {
          "type": "field_variable",
          "name": "VAR",
          "variable": Blockly.Msg.VARIABLES_DEFAULT_NAME
        },
        {
          "type": "input_value",
          "name": "VALUE"
        }
      ],
      "inputsInline": true
    });
    this.setHelpUrl(Blockly.Msg.VARIABLES_SET_HELPURL);
    this.setColour(Blockscad.Toolbox.HEX_VARIABLE);
    this.setPreviousStatement(true,['VariableSet']);
    this.setNextStatement(true, ['VariableSet','CAG','CSG']);
    this.setTooltip(Blockly.Msg.VARIABLES_SET_TOOLTIP);
    this.contextMenuMsg_ = Blockly.Msg.VARIABLES_SET_CREATE_GET;
  },
  contextMenuType_: 'variables_get',
  // g
  //  * Return all variables referenced by this block.
  //  * @return {!Array.<string>} List of variable names.
  //  * @this Blockly.Block
   
  // getVars: function() {
  //   return [this.getFieldValue('VAR')];
  // },
   /**
   * if this variable is set to a value, set the associated variable blocks to 
   * the type of the value block.
   * @this Blockly.Block
   */
  // setType: function(type) {      // for blocksCAD
  //   console.log("in variable_set setType:  old:" + this.myType_ + "  and new:" + type);
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }
  //   if (this.myType_ == type) {
  //     console.log("type didn't actually change.  Returning without doing work.");
  //     return;
  //   }
  //   var oldtype = this.myType_;
  //   // var instances = this.getVars();
  //   var instances = Blockly.Variables.getInstances(this.getFieldValue('VAR'), this.workspace);
  //   var numBumped = [];
  //   var parentAccepts;

  //   // go through instances, pulling out the variables_get blocks.
  //   // if the variables have a parent block, they might need to get bumped 

  //   // console.log("firing events now - something should have been bumped");
  //   // lets get the group event
  //   var eventGroup = true;
  //   if (Blockscad.workspace.undoStack_.length) 
  //     eventGroup = Blockscad.workspace.undoStack_[Blockscad.workspace.undoStack_.length - 1].group;
  //   // console.log("event group is: ", eventGroup);
  //   Blockly.Events.setGroup(eventGroup);

  //   if (instances.length > 0) {
  //     for (var i = 0; i < instances.length; i++) {
  //       // console.log("found an instance: ", instances[i].id , " ", instances[i].type);
  //       if (instances[i].type != "variables_get")
  //         continue;
  //       var parent = instances[i].getParent();
  //       if (type != null) {
  //         // this is a variables_get block, so the parent is the block connected
  //         // to the output connection. let's handle any bumpage that occurs.
  //         if (parent) {
  //           // console.log("found instance with parent: ", parent.type);
  //           parentAccepts = instances[i].outputConnection.targetConnection.check_;
  //           if (parentAccepts != null)
  //             parentAccepts = parentAccepts[0];
  //           // console.log("types parent accepts: ",parentAccepts);
  //           // take care of bumps
  //           if (parentAccepts != null && parentAccepts != type[0]) {
  //             // I have a type mismatch with this variable.  it is going to be bumped.
  //             // console.log("block " + instances[i].id + " will be kicked out.");
  //             numBumped.push(instances[i]);
  //             // instances[i].backlight();
  //             // this.backlightBlocks.push(instances[i].id);
  //             // if the instance is in a collapsed stack, find collapsed parent and expand
  //             var topBlock = instances[i].collapsedParents();
  //             if (topBlock)
  //               for (var j = 0; j < topBlock.length; j++)
  //                 topBlock[j].setCollapsed(false);
  //           }

  //         }  // end if (parent)
  //       }  // end if type == null
  //       // actually set the type here
  //       // console.log("setting block :" + instances[i].id + " to type " + type);
  //       instances[i].outputConnection.setCheck(type);
  //       if (Blockly.Events.isEnabled() && numBumped.length) {
  //         Blockly.Events.fire(new Blockly.Events.Typing(instances[i], oldtype,type));
  //       }
  //       // what if a parent is a variables_set of a different variable?
  //       // then I want to call Blockscad.assignVarTypes for that parent.
  //       if (parent && parent.type == "variables_set") {
  //         // console.log("found a variables_set parent from inside variables code");
  //         console.log("setting var_set type in loopable area");
  //         this.myType_ = type;
  //         Blockscad.assignVarTypes(parent);
  //       }
  //     }  // end looping through instances
  //   }  // end if instances.length > 0


  //   Blockly.Events.setGroup(false);
  

  //   if (numBumped.length) {
  //     // I've already changed the types, so bumping should have happened.  Now do the 
  //     // backlighting and warning text.
  //     for (var i = 0; i < numBumped.length; i++) {
  //       numBumped[i].backlight();
  //       this.backlightBlocks.push(numBumped[i].id);
  //     }
  //     var text = '';
  //     // text += numBumped.length + " ";
  //     // took out the name so I wouldn't have to deal with renaming the proc.
  //     text += Blockscad.Msg.VARIABLES_BUMPED_ONE.replace("%1", numBumped.length) + '\n';
  //     text += Blockscad.Msg.VARIABLES_BUMPED_TWO.replace("%1",this.getFieldValue('VAR')).replace("%2", parentAccepts).replace("%3", type[0]);

  //     this.setWarningText(text);
  //   }
  //   else
  //     this.setWarningText(null);

  //   // set the variables_set type - important for stopping infinite typing loops
  //   console.log("setting variable set type");
  //   this.myType_ = type;

  // },        // end for blocksCAD
  setType: function(type) {      // for blocksCAD

    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    if (type != null && !goog.isArray(type)) {
      type = [type];
    }
    // console.log("in variable_set setType:  old:" + this.myType_ + "  and new:" + type);
    if (Blockscad.arraysEqual(type, this.myType_)) {
      // console.log("type didn't actually change.  Returning without doing work.");
      return;
    }
    var oldtype = this.myType_;

    // set the type of the setter.

    this.myType_ = type;

    var instances = Blockly.Variables.getInstances(this.getFieldValue('VAR'), this.workspace);
    var numBumped = [];
    var parentAccepts;

    // go through instances, pulling out the variables_get blocks.
    // if the variables have a parent block, they might need to get bumped 

    // Group the events during bumping so undo will work as a unit.
    var eventGroup = true;
    if (Blockscad.workspace.undoStack_.length) 
      eventGroup = Blockscad.workspace.undoStack_[Blockscad.workspace.undoStack_.length - 1].group;
    // console.log("event group is: ", eventGroup);
    Blockly.Events.setGroup(eventGroup);

    if (instances.length > 0) {
      for (var i = 0; i < instances.length; i++) {
        // console.log("found an instance: ", instances[i].id , " ", instances[i].type);
        if (instances[i].type != "variables_get")
          continue;
        var parent = instances[i].getParent();
        if (this.myType_ != null) {
          // this is a variables_get block, so the parent is the block connected
          // to the output connection. let's handle any bumpage that occurs.
          if (parent) {
            // console.log("found instance with parent: ", parent.type);
            parentAccepts = instances[i].outputConnection.targetConnection.check_;
            if (parentAccepts != null)
              parentAccepts = parentAccepts[0];
            // console.log("Test for bumping. types were: " + parentAccepts + " and " + type[0]);
            // take care of bumps
            if (parentAccepts != null && type != null && parentAccepts != type[0]) {
              // console.log("block " + instances[i].id + " will be kicked out.");
              numBumped.push(instances[i]);
              // if the instance is in a collapsed stack, find collapsed parent and expand
              var topBlock = instances[i].collapsedParents();
              if (topBlock)
                for (var j = 0; j < topBlock.length; j++)
                  topBlock[j].setCollapsed(false);
            }

          }  // end if (parent)
        }  // end if type == null

        // actually set the caller's type here
        // console.log("setting block :" + instances[i].id + " to type " + type);
        instances[i].outputConnection.setCheck(type);
        if (Blockly.Events.isEnabled() && numBumped.length) {
          Blockly.Events.fire(new Blockly.Events.Typing(instances[i], oldtype,type));
        }
        // console.log("trying to call hasParentOfType",callers[i]);
        // caller has a parent that is a setter - either a variable or a function definition.
        var setterParent = Blockscad.hasParentOfType(instances[i], "procedures_defreturn");
        if (!setterParent)
          setterParent = Blockscad.hasParentOfType(instances[i],"variables_set");
        setTimeout(function() {
          // console.log("this caller function is inside a setter.  Set its type to: ",type);
          if (setterParent) setterParent.setType(type);
        }, 0);
      }  // end looping through instances
    }  // end if instances.length > 0


    Blockly.Events.setGroup(false);
  

    if (numBumped.length) {
      // I've already changed the types, so bumping should have happened.  Now do the 
      // backlighting and warning text.
      for (var i = 0; i < numBumped.length; i++) {
        numBumped[i].backlight();
        this.backlightBlocks.push(numBumped[i].id);
      }
      var text = '';
      // text += numBumped.length + " ";
      // took out the name so I wouldn't have to deal with renaming the proc.
      text += Blockscad.Msg.VARIABLES_BUMPED_ONE.replace("%1", numBumped.length) + '\n';
      text += Blockscad.Msg.VARIABLES_BUMPED_TWO.replace("%1",this.getFieldValue('VAR')).replace("%2", parentAccepts).replace("%3", type);

      this.setWarningText(text);
    }
    else
      this.setWarningText(null);
  },        // end for blocksCAD
  // setType: function(type, drawMe) {
  //   if (!this.workspace) {
  //     // Block has been deleted.
  //     return;
  //   }

  //   // // compare to see if type matches this.myType_


  //   var oldtype = this.myType_;

  //   var ret = this.getInput('RETURN');
  //   // console.log("in setType for function. here is the input:",ret);
  //   if (ret.connection.targetConnection) {
  //     if (ret.connection.targetConnection.check_ == 'Number')
  //       type = 'Number';
  //     else if (ret.connection.targetConnection.check_ == 'Boolean')
  //       type = 'Boolean';
  //     else if (ret.connection.targetConnection.check_ == 'String')
  //       type = 'String';
  //     else 
  //       type = null;
  //   }
  //   else type = null;

  //   // console.log("starting func ST with oldtype:" + this.myType_ + " and newtype:" + type);

  //   if (this.myType_ == type) {
  //     console.log("in func ST.  returning because types didn't change.");
  //     return;
  //   }
  //   // set the function def's type to what is now connected to its output
  //   this.myType_ = type;

  //   var callers = Blockly.Procedures.getCallers(this.getFieldValue('NAME'), this.workspace);
  //   var numBumped = [];
  //   var conType = null;     // type of a caller's output connection
  //   var parentAccepts;

  //   // start grouping events in case some blocks are bumped out, so that undo will work easily.
  //   var eventGroup = true;
  //   if (Blockscad.workspace.undoStack_.length) 
  //     eventGroup = Blockscad.workspace.undoStack_[Blockscad.workspace.undoStack_.length - 1].group;
  //   // console.log("event group is: ", eventGroup);
  //   Blockly.Events.setGroup(eventGroup);

  //   // now, set my caller block's types
  //   if (callers.length) {
  //     for (var i = 0; i < callers.length; i++) {
  //       // the caller block only gets bumped if it has a parent.
  //       var parent = callers[i].getParent();
  //       // get caller's connection type here
  //       if (parent) {
  //         // console.log("found instance with parent: ", parent.type);
  //         parentAccepts = callers[i].outputConnection.targetConnection.check_;

  //         if (parentAccepts != null && goog.isArray(parentAccepts))
  //           parentAccepts = parentAccepts[0];

  //         var callerAccepts = callers[i].outputConnection.check_;

  //         // take care of bumps
  //         if (parentAccepts != null && this.myType_ != null && parentAccepts != this.myType_) {
  //           // I have a type mismatch with this variable.  it is going to be bumped.
  //           // console.log("warning message!  call block id", callers[i].id, "will be kicked out and backlit");
  //           numBumped.push(callers[i]);
  //           // instances[i].backlight();
  //           // this.backlightBlocks.push(instances[i].id);
  //           // if the instance is in a collapsed stack, find collapsed parent and expand
  //           var topBlock = callers[i].collapsedParents();
  //           if (topBlock)
  //             for (var j = 0; j < topBlock.length; j++)
  //               topBlock[j].setCollapsed(false);
  //         }

  //       }  // end if (parent)

  //       // change caller's type - this is the command that actually prompts Blockly to bump blocks out

  //       // console.log("Set the caller's output check to ", this.myType_);

  //       callers[i].outputConnection.setCheck(this.myType_);
  //       if (this.myType_ == 'Number')
  //         callers[i].category = 'NUMBER'
  //       else if (this.myType_ == 'Boolean')
  //         callers[i].category = 'BOOLEAN';
  //       else if (this.myType_ == 'String')
  //         callers[i].category == 'STRING';
  //       else callers[i].category = 'UNKNOWN';
  //       // console.log("tried to set caller type to ",this.myType_, callers[i]);
  //       // if it was a bumping change, fire a typing event
  //       if (Blockly.Events.isEnabled() && numBumped.length) {
  //         Blockly.Events.fire(new Blockly.Events.Typing(callers[i], oldtype,type));
  //       }

  //       // if caller is inside of another setter block, that setter's type needs to be changed.  Do so.
  //       // note that this can lead to an infinite loop if procedures are circularly defined - that is why
  //       // setType MUST exit immediately if it is called with the type not changing.

  //       // what if a parent is a variables_set of a different variable?
  //       // then I want to call Blockscad.assignVarTypes for that parent.

  //       // console.log("trying to call hasParentOfType",callers[i]);
  //       var setterParent = Blockscad.hasParentOfType(callers[i], "procedures_defreturn");
  //       if (!setterParent)
  //         setterParent = Blockscad.hasParentOfType(callers[i],"variables_set");
  //       if (setterParent) {
  //         setTimeout(function() {
  //           console.log("this caller function is inside a setter.  Set its type to: ",type);
  //           setterParent.setType(type);
  //         }, 0);
  //       }
  //     }
  //   } // end of going through all callers to set their types.

  //   // turn off event grouping
  //   Blockly.Events.setGroup(false);

  //   // handle backlighting and warning text - do this later so that 
  //   // the bumping process itself (which now selects and deselects the blocks) doesn't
  //   // just immediately turn the backlighting off.

  //   for (var k = 0; k < numBumped.length; k++) {
  //     numBumped[k].backlight();
  //     this.backlightBlocks.push(numBumped[k].id);
  //     // finally, set a warning message on the procedure definition that counts how many callers were bumped.
  //     var text = '';
  //     text += Blockscad.Msg.BLOCKS_BUMPED_OUT_TYPES.replace("%1", numBumped.length).replace("%2", parentAccepts).replace("%3",type);
  //     this.setWarningText(text);
  //   }
  // },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
//   renameVar: function(oldName, newName) {
//     if (Blockly.Names.equals(oldName, this.getFieldValue('VAR'))) {
//       this.setFieldValue(newName, 'VAR');
//     }
//   },
  customContextMenu: Blockly.Blocks['variables_get'].customContextMenu
};