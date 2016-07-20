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
 * @fileoverview Procedure blocks for Blockly.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.Blocks.procedures');

goog.require('Blockly.Blocks');


Blockly.Blocks['procedures_defnoreturn'] = {
  /**
   * Block for defining a procedure with no return value.
   * @this Blockly.Block
   */
  init: function() {
    this.category = 'PROCEDURE';        // for blocksCAD
    this.myType_ = ['CSG','CAG'];       // for blocksCAD
    this.backlightBlocks = [];            // for blocksCAD

    var nameField = new Blockly.FieldTextInput(
        Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE,
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_TITLE)
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFNORETURN_HELPURL);
    this.setColour(Blockscad.Toolbox.HEX_PROCEDURE);
    this.setTooltip(Blockly.Msg.PROCEDURES_DEFNORETURN_TOOLTIP);
    this.arguments_ = [];
    this.setStatements_(true, 'VariableSet');
    this.statementConnection_ = null;
  },
   /**
   * if this procedure has statements, use them to determine the 
   * type of this procedure, then update types of any callers..
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {      // for blocksCAD
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    if (this.myType_ == type)
      return;
    var callers = Blockly.Procedures.getCallers(this.getFieldValue('NAME'), this.workspace);
    var numBumped = [];
    var notBumped = [];

    // I need to find out what my caller stacks think their types are.
    if (callers.length) {
      for (var i = 0; i < callers.length; i++) {
        var areaType = Blockscad.findBlockType(callers[i],callers);
        //console.log("caller area type is",areaType);
        //console.log("caller category is", callers[i].category);
       // console.log("parent type is changing to",type);
        if (!goog.isArray(type) && areaType != 'EITHER' && areaType != type) {
          // call blocks are going to be kicked out.  
          //console.log("warning message!  call block id", callers[i].id, "will be kicked out");
          numBumped.push(callers[i]);
          callers[i].backlight();
          this.backlightBlocks.push(callers[i].id);
          // If the call block is in a collapsed stack, find the collapsed parent and expand them.
          var topBlock = callers[i].collapsedParents();
          if (topBlock)
            for (var j=0; j < topBlock.length; j++) 
              topBlock[j].setCollapsed(false); 
        }
        else notBumped.push(callers[i]);
      }
    }

    if (numBumped.length) {
      var text = '';
      // text += numBumped.length + " ";
      // took out the name so I wouldn't have to deal with renaming the proc.
      //text += this.getFieldValue('NAME') + " ";
      text += Blockscad.Msg.BLOCKS_BUMPED_OUT_DIMENSIONS.replace("%1", numBumped.length);
      this.setWarningText(text);
    }

    this.myType_ = type;

    // some of my callers don't need to be bumped.  I'll set their category to "BLAH"
    // temporarily (note this is NOT a valid category),
    // reset the types of the blocks around them, then set them to their new type.  
    // this should prevent them getting bumped out incorrectly.

    if (notBumped.length) {
      for (var j = 0; j < notBumped.length; j++) {
        notBumped[j].category = 'BLAH';
        notBumped[j].previousConnection.setCheck(['CSG','CAG']);
      }
      for (j = 0; j < notBumped.length; j++) {
        Blockscad.assignBlockTypes([notBumped[j]]);
      }
    }

    if (callers.length > 0) {
      for (var i = 0; i < callers.length; i++) {
        callers[i].previousConnection.setCheck(type);
        if (type == 'CSG')
          callers[i].category = 'PRIMITIVE_CSG'
        else if (type == 'CAG')
          callers[i].category = 'PRIMITIVE_CAG';
        else callers[i].category = 'UNKNOWN';
        // if the top block isn't the procedure definition (recursion!), then assign their types
        var topBlock = callers[i].getRootBlock();
        if (!(topBlock.category && topBlock.category == 'PROCEDURE'))
          Blockscad.assignBlockTypes([callers[i]]);
      }
    }
    // the system will be done now with unplugging all the blocks that need it.  
    // Time to fire a workspaceChanged() so our list of parentIDs will be current.
    if (numBumped.length)
      Blockscad.workspaceChanged();
  },        // end for blocksCAD
  // for BlocksCAD - check to see if my callers are still backlight?
  onchange: function() {
    var found_it = 0;
    // go through my backlight id list, see if I have any blocks on it that are not on 
    // the general backlight list (they must have been unhighlighted!)
    for (var i=0; i < this.backlightBlocks.length; i++) {
      found_it = 0;
      for (var j=0; j<Blockly.backlight.length; j++) {
        if (this.backlightBlocks[i] === Blockly.backlight[j]) {
          found_it = 1;
          break;
        }
      }
      if (!found_it) {  // this block needs to come off our list
        this.backlightBlocks.splice(i,1);
      }
    }
    if (!this.backlightBlocks.length) {
      this.setWarningText(null);
    } 
  },

  /**
   * Add or remove the statement block from this function definition.
   * @param {boolean} hasStatements True if a statement block is needed.
   * @this Blockly.Block
   */
  setStatements_: function(hasStatements) {
    if (this.hasStatements_ === hasStatements) {
      return;
    }
    if (hasStatements) {
      this.appendStatementInput('STACK')
          .appendField(Blockly.Msg.PROCEDURES_DEFNORETURN_DO);
      if (this.getInput('RETURN')) {
        this.moveInputBefore('STACK', 'RETURN');
      }
    } else {
      this.removeInput('STACK', true);
    }
    this.hasStatements_ = hasStatements;
  },
  /**
   * Update the display of parameters for this procedure definition block.
   * Display a warning if there are duplicately named parameters.
   * @private
   * @this Blockly.Block
   */
  updateParams_: function() {
    // Check for duplicated arguments.
    var badArg = false;
    var hash = {};
    for (var i = 0; i < this.arguments_.length; i++) {
      if (hash['arg_' + this.arguments_[i].toLowerCase()]) {
        badArg = true;
        break;
      }
      hash['arg_' + this.arguments_[i].toLowerCase()] = true;
    }
    if (badArg) {
      this.setWarningText(Blockly.Msg.PROCEDURES_DEF_DUPLICATE_WARNING);
    } else {
      this.setWarningText(null);
    }
    // Merge the arguments into a human-readable list.
    var paramString = '';
    if (this.arguments_.length) {
      paramString = Blockly.Msg.PROCEDURES_BEFORE_PARAMS +
          ' ' + this.arguments_.join(', ');
    }
    // The params field is deterministic based on the mutation,
    // no need to fire a change event.
    Blockly.Events.disable();
    try {
      this.setFieldValue(paramString, 'PARAMS');
    } finally {
      Blockly.Events.enable();
    }
  },
  /**
   * Create XML to represent the argument inputs.
   * @param {=boolean} opt_paramIds If true include the IDs of the parameter
   *     quarks.  Used by Blockly.Procedures.mutateCallers for reconnection.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function(opt_paramIds) {
    var container = document.createElement('mutation');
    if (opt_paramIds) {
      container.setAttribute('name', this.getFieldValue('NAME'));
    }
    for (var i = 0; i < this.arguments_.length; i++) {
      var parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      if (opt_paramIds && this.paramIds_) {
        parameter.setAttribute('paramId', this.paramIds_[i]);
      }
      container.appendChild(parameter);
    }

    // Save whether the statement input is visible.
    if (!this.hasStatements_) {
      container.setAttribute('statements', 'false');
    }
    return container;
  },
  /**
   * Parse XML to restore the argument inputs.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    this.arguments_ = [];
    for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        this.arguments_.push(childNode.getAttribute('name'));
      }
    }
    this.updateParams_();
    Blockly.Procedures.mutateCallers(this);

    // Show or hide the statement input.
    this.setStatements_(xmlElement.getAttribute('statements') !== 'false');
  },
  /**
   * Populate the mutator's dialog with this block's components.
   * @param {!Blockly.Workspace} workspace Mutator's workspace.
   * @return {!Blockly.Block} Root block in mutator.
   * @this Blockly.Block
   */
  decompose: function(workspace) {
    var containerBlock = workspace.newBlock('procedures_mutatorcontainer');
    containerBlock.initSvg();

    // Check/uncheck the allow statement box.
    // for blocksCAD - take out the if statements here so that we always don't show the 
    // statement checkbox in the mutator.  both statements required.  
    containerBlock.setFieldValue(this.hasStatements_ ? 'TRUE' : 'FALSE',
                                 'STATEMENTS');
    containerBlock.getInput('STATEMENT_INPUT').setVisible(false);


    // Parameter list.
    var connection = containerBlock.getInput('STACK').connection;
    for (var i = 0; i < this.arguments_.length; i++) {
      var paramBlock = workspace.newBlock('procedures_mutatorarg');
      paramBlock.initSvg();
      paramBlock.setFieldValue(this.arguments_[i], 'NAME');
      // Store the old location.
      paramBlock.oldLocation = i;
      connection.connect(paramBlock.previousConnection);
      connection = paramBlock.nextConnection;
    }
    // Initialize procedure's callers with blank IDs.
    Blockly.Procedures.mutateCallers(this);
    return containerBlock;
  },
  /**
   * Reconfigure this block based on the mutator dialog's components.
   * @param {!Blockly.Block} containerBlock Root block in mutator.
   * @this Blockly.Block
   */
  compose: function(containerBlock) {
    // Parameter list.
    this.arguments_ = [];
    this.paramIds_ = [];
    var paramBlock = containerBlock.getInputTargetBlock('STACK');
    while (paramBlock) {
      this.arguments_.push(paramBlock.getFieldValue('NAME'));
      this.paramIds_.push(paramBlock.id);
      paramBlock = paramBlock.nextConnection &&
          paramBlock.nextConnection.targetBlock();
    }
    this.updateParams_();
    Blockly.Procedures.mutateCallers(this);

    // Show/hide the statement input.
    var hasStatements = containerBlock.getFieldValue('STATEMENTS');
    if (hasStatements !== null) {
      hasStatements = hasStatements == 'TRUE';
      if (this.hasStatements_ != hasStatements) {
        if (hasStatements) {
          this.setStatements_(true);
          // Restore the stack, if one was saved.
          Blockly.Mutator.reconnect(this.statementConnection_, this, 'STACK');
          this.statementConnection_ = null;
        } else {
          // Save the stack, then disconnect it.
          var stackConnection = this.getInput('STACK').connection;
          this.statementConnection_ = stackConnection.targetConnection;
          if (this.statementConnection_) {
            var stackBlock = stackConnection.targetBlock();
            stackBlock.unplug();
            stackBlock.bumpNeighbours_();
          }
          this.setStatements_(false);
        }
      }
    }
  },
  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES NOT have a return value.
   * @this Blockly.Block
   */
  getProcedureDef: function() {
    return [this.getFieldValue('NAME'), this.arguments_, false];
  },
  /**
   * Return all variables referenced by this block.
   * @return {!Array.<string>} List of variable names.
   * @this Blockly.Block
   */
  getVars: function() {
    return this.arguments_;
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    var change = false;
    for (var i = 0; i < this.arguments_.length; i++) {
      if (Blockly.Names.equals(oldName, this.arguments_[i])) {
        this.arguments_[i] = newName;
        change = true;
      }
    }
    if (change) {
      this.updateParams_();
      // Update the mutator's variables if the mutator is open.
      if (this.mutator.isVisible()) {
        var blocks = this.mutator.workspace_.getAllBlocks();
        for (var i = 0, block; block = blocks[i]; i++) {
          if (block.type == 'procedures_mutatorarg' &&
              Blockly.Names.equals(oldName, block.getFieldValue('NAME'))) {
            block.setFieldValue(newName, 'NAME');
          }
        }
      }
    }
  },
  /**
   * Add custom menu options to this block's context menu.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    // Add option to create caller.
    var option = {enabled: true};
    var name = this.getFieldValue('NAME');
    option.text = Blockly.Msg.PROCEDURES_CREATE_DO.replace('%1', name);
    var xmlMutation = goog.dom.createDom('mutation');
    xmlMutation.setAttribute('name', name);
    for (var i = 0; i < this.arguments_.length; i++) {
      var xmlArg = goog.dom.createDom('arg');
      xmlArg.setAttribute('name', this.arguments_[i]);
      xmlMutation.appendChild(xmlArg);
    }
    var xmlBlock = goog.dom.createDom('block', null, xmlMutation);
    xmlBlock.setAttribute('type', this.callType_);
    option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
    options.push(option);

    // Add options to create getters for each parameter.
    if (!this.isCollapsed()) {
      for (var i = 0; i < this.arguments_.length; i++) {
        var option = {enabled: true};
        var name = this.arguments_[i];
        option.text = Blockly.Msg.VARIABLES_SET_CREATE_GET.replace('%1', name);
        var xmlField = goog.dom.createDom('field', null, name);
        xmlField.setAttribute('name', 'VAR');
        var xmlBlock = goog.dom.createDom('block', null, xmlField);
        xmlBlock.setAttribute('type', 'variables_get');
        option.callback = Blockly.ContextMenu.callbackFactory(this, xmlBlock);
        options.push(option);
      }
    }
    // for BlocksCAD, 
    var option = {enabled: true};
    var name = this.getFieldValue('NAME');
    option.text = Blockscad.Msg.HIGHLIGHT_INSTANCES.replace("%1", name);
    var workspace = this.workspace;
    option.callback = function() {
      var def = Blockly.Procedures.getDefinition(name, workspace);
      if (def) {
        var callers = Blockly.Procedures.getCallers(name, workspace);
        workspace.clearBacklight();
        Blockly.selected.unselect();
        for (var i = 0; callers && i < callers.length; i++) {
          callers[i] && callers[i].backlight();
          // if caller block is in a collapsed parent, highlight collapsed parent too
          var others = callers[i].collapsedParents();
          if (others)
            for (var j=0; j < others.length; j++) 
              others[j].backlight(); 
        }
      }
    };
    options.push(option); 
  },
  callType_: 'procedures_callnoreturn'
};

Blockly.Blocks['procedures_defreturn'] = {
  /**
   * Block for a blockSCAD function: no statements, a return value.
   * 
   * @this Blockly.Block
   */
  init: function() {
    this.category = 'PROCEDURE'; // for blockscad
    this.myType_ = null;       // for blocksCAD

    var nameField = new Blockly.FieldTextInput(
        Blockly.Msg.PROCEDURES_DEFRETURN_PROCEDURE,
        Blockly.Procedures.rename);
    nameField.setSpellcheck(false);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_TITLE)
        .appendField(nameField, 'NAME')
        .appendField('', 'PARAMS');
    this.appendValueInput('RETURN')
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
    this.setMutator(new Blockly.Mutator(['procedures_mutatorarg']));
    this.setColour(Blockscad.Toolbox.HEX_PROCEDURE);
    this.setTooltip(Blockly.Msg.PROCEDURES_DEFRETURN_TOOLTIP);
    this.setHelpUrl(Blockly.Msg.PROCEDURES_DEFRETURN_HELPURL);
    this.arguments_ = [];
    this.setStatements_(false);         // set false for blockscad - jayod
    this.statementConnection_ = null;
  },
    /**
   * if this procedure has statements, use them to determine the 
   * type of this procedure, then update types of any callers..
   * @this Blockly.Block
   */
  setType: function(type,drawMe) {      // for blocksCAD
    if (!this.workspace) {
      // Block has been deleted.
      return;
    }
    var ret = this.getInput('RETURN');
    // console.log("in setType for function. here is the input:",ret);
    if (ret.connection.targetConnection) {
      if (ret.connection.targetConnection.check_ == 'Number')
        this.myType_ = ret.connection.check_ = 'Number';
      else if (ret.connection.targetConnection.check_ == 'Boolean')
        this.myType_ = ret.connection.check_ = 'Boolean';
    }
    else this.myType_ = ret.connection.check_ = null;

    var callers = Blockly.Procedures.getCallers(this.getFieldValue('NAME'), this.workspace);
    var numBumped = [];
    var conType = null;

    // I need to find out what my caller stacks think their types are.
    if (callers.length) {
      for (var i = 0; i < callers.length; i++) {
        // console.log("callers.length is:",callers.length);
        // get caller's connection type here
        if (callers[i].outputConnection.targetConnection)
          conType = callers[i].outputConnection.targetConnection.check_;

        if (!goog.isArray(conType)) conType = [conType];
        // conType is an array.  
        // console.log("caller type is",conType);
        // console.log(this.myType_);
      if (this.myType_ && conType && conType.indexOf(this.myType_) == -1) {

          // call blocks are going to be kicked out.  
          console.log("warning message!  call block id", callers[i].id, "will be kicked out");
          // there is a bug here - if we add to the numBumped stack, then we get an infinite loop. ???
          // if (numBumped[numBumped.length] != callers[i]) 
          // numBumped.push(callers[i]);
          // If the call block is in a collapsed stack, find the collapsed parent and expand them.
          var topBlock = callers[i].collapsedParents();
          if (topBlock)
            for (var j=0; j < topBlock.length; j++)
              topBlock[j].setCollapsed(false);
        }
      }
    }
    if (numBumped.length) {
      // console.log("blah");
      var text = '';
      // text += numBumped.length + " ";
      // text += this.getFieldValue('NAME') + " ";
      text += Blockscad.Msg.BLOCKS_BUMPED_OUT_TYPES.replace("%1", numBumped.length + " " + this.getFieldValue('NAME'));

      this.setWarningText(text);
    }
    if (callers.length > 0) {
      for (var i = 0; i < callers.length; i++) {
        callers[i].outputConnection.setCheck(this.myType_); 
        if (this.myType_ == 'Number')
          callers[i].category = 'NUMBER'
        else if (this.myType_ == 'Boolean')
          callers[i].category = 'BOOLEAN';
        else callers[i].category = 'UNKNOWN';
        // console.log("tried to set caller type to ",this.myType_, callers[i]);
      }
    }
    // the system will be done now with unplugging all the blocks that need it.  
    // Time to fire a workspaceChanged() so our list of parentIDs will be current.
    if (numBumped.length)
      Blockscad.workspaceChanged();
  },    // end for blocksCAD 
  setStatements_: Blockly.Blocks['procedures_defnoreturn'].setStatements_,
  updateParams_: Blockly.Blocks['procedures_defnoreturn'].updateParams_,
  mutationToDom: Blockly.Blocks['procedures_defnoreturn'].mutationToDom,
  domToMutation: Blockly.Blocks['procedures_defnoreturn'].domToMutation,
  decompose: Blockly.Blocks['procedures_defnoreturn'].decompose,
  compose: Blockly.Blocks['procedures_defnoreturn'].compose,
  /**
   * Return the signature of this procedure definition.
   * @return {!Array} Tuple containing three elements:
   *     - the name of the defined procedure,
   *     - a list of all its arguments,
   *     - that it DOES have a return value.
   * @this Blockly.Block
   */
  getProcedureDef: function() {
    return [this.getFieldValue('NAME'), this.arguments_, true];
  },
  getVars: Blockly.Blocks['procedures_defnoreturn'].getVars,
  renameVar: Blockly.Blocks['procedures_defnoreturn'].renameVar,
  customContextMenu: Blockly.Blocks['procedures_defnoreturn'].customContextMenu,
  callType_: 'procedures_callreturn'
};

Blockly.Blocks['procedures_mutatorcontainer'] = {
  /**
   * Mutator block for procedure container.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockscad.Toolbox.HEX_PROCEDURE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TITLE);
    this.appendStatementInput('STACK');
    this.appendDummyInput('STATEMENT_INPUT')
        .appendField(Blockly.Msg.PROCEDURES_ALLOW_STATEMENTS)
        .appendField(new Blockly.FieldCheckbox('TRUE'), 'STATEMENTS');
    this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORCONTAINER_TOOLTIP);
    this.contextMenu = false;
  }
};

Blockly.Blocks['procedures_mutatorarg'] = {
  /**
   * Mutator block for procedure argument.
   * @this Blockly.Block
   */
  init: function() {
    this.setColour(Blockscad.Toolbox.HEX_PROCEDURE);
    this.appendDummyInput()
        .appendField(Blockly.Msg.PROCEDURES_MUTATORARG_TITLE)
        .appendField(new Blockly.FieldTextInput('x', this.validator_), 'NAME');
    this.setPreviousStatement(true);
    this.setNextStatement(true);
    this.setTooltip(Blockly.Msg.PROCEDURES_MUTATORARG_TOOLTIP);
    this.contextMenu = false;
  },
  /**
   * Obtain a valid name for the procedure.
   * Merge runs of whitespace.  Strip leading and trailing whitespace.
   * Beyond this, all names are legal.
   * @param {string} newVar User-supplied name.
   * @return {?string} Valid name, or null if a name was not specified.
   * @private
   * @this Blockly.Block
   */
  validator_: function(newVar) {
    newVar = newVar.replace(/[\s\xa0]+/g, ' ').replace(/^ | $/g, '');
    return newVar || null;
  }
};

Blockly.Blocks['procedures_callnoreturn'] = {
  /**
   * Block for calling a procedure with no return value.
   * @this Blockly.Block
   */
  init: function() {
    this.category = 'UNKNOWN';     // for blocksCAD
    this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLNORETURN_HELPURL);
    this.setColour(Blockscad.Toolbox.HEX_PROCEDURE);
    this.appendDummyInput('TOPROW')
        .appendField(this.id, 'NAME');
    this.setPreviousStatement(true);
    //this.setNextStatement(true);  // for Blockscad, we don't want this to have a next.  Breaks difference.
    // Tooltip is set in domToMutation.
    this.arguments_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
  },
  /**
   * on being added, this will be called to get the parent procedure type for BlocksCAD
   */
  getType: function() {     // for blockscad - jayod
    var parent = Blockly.Procedures.getDefinition(this.getFieldValue('NAME'),this.workspace);
    if (parent) {
      var myType = parent.myType_;
      if (myType) {
        this.previousConnection.setCheck(myType);
        //this.nextConnection.setCheck(myType);   // no more next connection
        if (myType == 'CSG')
          this.category = 'PRIMITIVE_CSG'
        else if (myType == 'CAG')
          this.category = 'PRIMITIVE_CAG';
        else this.category = 'UNKNOWN'; 
      }
    }
  },
  /**
   * Returns the name of the procedure this block calls.
   * @return {string} Procedure name.
   * @this Blockly.Block
   */
  getProcedureCall: function() {
    // The NAME field is guaranteed to exist, null will never be returned.
    return /** @type {string} */ (this.getFieldValue('NAME'));
  },
  /**
   * Notification that a procedure is renaming.
   * If the name matches this block's procedure, rename it.
   * @param {string} oldName Previous name of procedure.
   * @param {string} newName Renamed procedure.
   * @this Blockly.Block
   */
  renameProcedure: function(oldName, newName) {
    if (Blockly.Names.equals(oldName, this.getProcedureCall())) {
      this.setFieldValue(newName, 'NAME');
      this.setTooltip(
          (this.outputConnection ? Blockly.Msg.PROCEDURES_CALLRETURN_TOOLTIP :
           Blockly.Msg.PROCEDURES_CALLNORETURN_TOOLTIP)
          .replace('%1', newName));
    }
  },
  /**
   * Notification that the procedure's parameters have changed.
   * @param {!Array.<string>} paramNames New param names, e.g. ['x', 'y', 'z'].
   * @param {!Array.<string>} paramIds IDs of params (consistent for each
   *     parameter through the life of a mutator, regardless of param renaming),
   *     e.g. ['piua', 'f8b_', 'oi.o'].
   * @private
   * @this Blockly.Block
   */
  setProcedureParameters_: function(paramNames, paramIds) {
    // Data structures:
    // this.arguments = ['x', 'y']
    //     Existing param names.
    // this.quarkConnections_ {piua: null, f8b_: Blockly.Connection}
    //     Look-up of paramIds to connections plugged into the call block.
    // this.quarkIds_ = ['piua', 'f8b_']
    //     Existing param IDs.
    // Note that quarkConnections_ may include IDs that no longer exist, but
    // which might reappear if a param is reattached in the mutator.
    var defBlock = Blockly.Procedures.getDefinition(this.getProcedureCall(),
        this.workspace);
    var mutatorOpen = defBlock && defBlock.mutator &&
        defBlock.mutator.isVisible();
    if (!mutatorOpen) {
      this.quarkConnections_ = {};
      this.quarkIds_ = null;
    }
    if (!paramIds) {
      // Reset the quarks (a mutator is about to open).
      return;
    }
    if (goog.array.equals(this.arguments_, paramNames)) {
      // No change.
      this.quarkIds_ = paramIds;
      return;
    }
    if (paramIds.length != paramNames.length) {
      throw 'Error: paramNames and paramIds must be the same length.';
    }
    this.setCollapsed(false);
    if (!this.quarkIds_) {
      // Initialize tracking for this block.
      this.quarkConnections_ = {};
      if (paramNames.join('\n') == this.arguments_.join('\n')) {
        // No change to the parameters, allow quarkConnections_ to be
        // populated with the existing connections.
        this.quarkIds_ = paramIds;
      } else {
        this.quarkIds_ = [];
      }
    }
    // Switch off rendering while the block is rebuilt.
    var savedRendered = this.rendered;
    this.rendered = false;
    // Update the quarkConnections_ with existing connections.
    for (var i = 0; i < this.arguments_.length; i++) {
      var input = this.getInput('ARG' + i);
      if (input) {
        var connection = input.connection.targetConnection;
        this.quarkConnections_[this.quarkIds_[i]] = connection;
        if (mutatorOpen && connection &&
            paramIds.indexOf(this.quarkIds_[i]) == -1) {
          // This connection should no longer be attached to this block.
          connection.disconnect();
          connection.getSourceBlock().bumpNeighbours_();
        }
      }
    }
    // Rebuild the block's arguments.
    this.arguments_ = [].concat(paramNames);
    this.updateShape_();
    this.quarkIds_ = paramIds;
    // Reconnect any child blocks.
    if (this.quarkIds_) {
      for (var i = 0; i < this.arguments_.length; i++) {
        var quarkId = this.quarkIds_[i];
        if (quarkId in this.quarkConnections_) {
          var connection = this.quarkConnections_[quarkId];
          if (!Blockly.Mutator.reconnect(connection, this, 'ARG' + i)) {
            // Block no longer exists or has been attached elsewhere.
            delete this.quarkConnections_[quarkId];
          }
        }
      }
    }
    // Restore rendering and show the changes.
    this.rendered = savedRendered;
    if (this.rendered) {
      this.render();
    }
  },
  /**
   * Modify this block to have the correct number of arguments.
   * @private
   * @this Blockly.Block
   */
  updateShape_: function() {
    for (var i = 0; i < this.arguments_.length; i++) {
      var field = this.getField('ARGNAME' + i);
      if (field) {
        // Ensure argument name is up to date.
        // The argument name field is deterministic based on the mutation,
        // no need to fire a change event.
        Blockly.Events.disable();
        try {
          field.setValue(this.arguments_[i]);
        } finally {
          Blockly.Events.enable();
        }
      } else {
        // Add new input.
        field = new Blockly.FieldLabel(this.arguments_[i]);
        var input = this.appendValueInput('ARG' + i)
            .setAlign(Blockly.ALIGN_RIGHT)
            .appendField(field, 'ARGNAME' + i);
        input.init();
      }
    }
    // Remove deleted inputs.
    while (this.getInput('ARG' + i)) {
      this.removeInput('ARG' + i);
      i++;
    }
    // Add 'with:' if there are parameters, remove otherwise.
    var topRow = this.getInput('TOPROW');
    if (topRow) {
      if (this.arguments_.length) {
        if (!this.getField('WITH')) {
          topRow.appendField(Blockly.Msg.PROCEDURES_CALL_BEFORE_PARAMS, 'WITH');
          topRow.init();
        }
      } else {
        if (this.getField('WITH')) {
          topRow.removeField('WITH');
        }
      }
    }
  },
  /**
   * Create XML to represent the (non-editable) name and arguments.
   * @return {!Element} XML storage element.
   * @this Blockly.Block
   */
  mutationToDom: function() {
    var container = document.createElement('mutation');
    container.setAttribute('name', this.getProcedureCall());
    for (var i = 0; i < this.arguments_.length; i++) {
      var parameter = document.createElement('arg');
      parameter.setAttribute('name', this.arguments_[i]);
      container.appendChild(parameter);
    }
    return container;
  },
  /**
   * Parse XML to restore the (non-editable) name and parameters.
   * @param {!Element} xmlElement XML storage element.
   * @this Blockly.Block
   */
  domToMutation: function(xmlElement) {
    var name = xmlElement.getAttribute('name');
    this.renameProcedure(this.getProcedureCall(), name);
    var args = [];
    var paramIds = [];
    for (var i = 0, childNode; childNode = xmlElement.childNodes[i]; i++) {
      if (childNode.nodeName.toLowerCase() == 'arg') {
        args.push(childNode.getAttribute('name'));
        paramIds.push(childNode.getAttribute('paramId'));
      }
    }
    this.setProcedureParameters_(args, paramIds);
  },
  /**
   * Notification that a variable is renaming.
   * If the name matches one of this block's variables, rename it.
   * @param {string} oldName Previous name of variable.
   * @param {string} newName Renamed variable.
   * @this Blockly.Block
   */
  renameVar: function(oldName, newName) {
    for (var i = 0; i < this.arguments_.length; i++) {
      if (Blockly.Names.equals(oldName, this.arguments_[i])) {
        this.arguments_[i] = newName;
        this.getField('ARGNAME' + i).setValue(newName);
      }
    }
  },
  /**
   * Procedure calls cannot exist without the corresponding procedure
   * definition.  Enforce this link whenever an event is fired.
   * @this Blockly.Block
   */
  onchange: function(event) {
    if (!this.workspace || this.workspace.isFlyout) {
      // Block is deleted or is in a flyout.
      return;
    }
    if (event.type == Blockly.Events.CREATE &&
        event.ids.indexOf(this.id) != -1) {
      // Look for the case where a procedure call was created (usually through
      // paste) and there is no matching definition.  In this case, create
      // an empty definition block with the correct signature.
      var name = this.getProcedureCall();
      var def = Blockly.Procedures.getDefinition(name, this.workspace);
      if (def && (def.type != this.defType_ ||
          JSON.stringify(def.arguments_) != JSON.stringify(this.arguments_))) {
        // The signatures don't match.
        def = null;
      }
      if (!def) {
        Blockly.Events.setGroup(event.group);
        /**
         * Create matching definition block.
         * <xml>
         *   <block type="procedures_defreturn" x="10" y="20">
         *     <mutation name="test">
         *       <arg name="x"></arg>
         *     </mutation>
         *     <field name="NAME">test</field>
         *   </block>
         * </xml>
         */
        var xml = goog.dom.createDom('xml');
        var block = goog.dom.createDom('block');
        block.setAttribute('type', this.defType_);
        var xy = this.getRelativeToSurfaceXY();
        var x = xy.x + Blockly.SNAP_RADIUS * (this.RTL ? -1 : 1);
        var y = xy.y + Blockly.SNAP_RADIUS * 2;
        block.setAttribute('x', x);
        block.setAttribute('y', y);
        var mutation = this.mutationToDom();
        block.appendChild(mutation);
        var field = goog.dom.createDom('field');
        field.setAttribute('name', 'NAME');
        field.appendChild(document.createTextNode(this.getProcedureCall()));
        block.appendChild(field);
        xml.appendChild(block);
        Blockly.Xml.domToWorkspace(xml, this.workspace);
        Blockly.Events.setGroup(false);
      }
    } else if (event.type == Blockly.Events.DELETE) {
      // Look for the case where a procedure definition has been deleted,
      // leaving this block (a procedure call) orphaned.  In this case, delete
      // the orphan.
      var name = this.getProcedureCall();
      var def = Blockly.Procedures.getDefinition(name, this.workspace);
      if (!def) {
        Blockly.Events.setGroup(event.group);
        this.dispose(true, false);
        Blockly.Events.setGroup(false);
      }
    }
  },
  /**
   * Add menu option to find the definition block for this call.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    option.text = Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF;
    var name = this.getProcedureCall();
    var workspace = this.workspace;
    option.callback = function() {
      var def = Blockly.Procedures.getDefinition(name, workspace);
      workspace.clearBacklight();
      // def && def.backlight();
      def && def.select();
    };
    options.push(option);

    // for BlocksCAD, 
    var option = {enabled: true};
    var name = this.getProcedureCall();
    option.text = Blockscad.Msg.HIGHLIGHT_INSTANCES.replace("%1", name);

    var workspace = this.workspace;
    option.callback = function() {
      var def = Blockly.Procedures.getDefinition(name, workspace);
      if (def) {
        var callers = Blockly.Procedures.getCallers(name, workspace);
        workspace.clearBacklight();
        Blockly.selected.unselect();
        for (var i = 0; callers && i < callers.length; i++) {
          callers[i] && callers[i].backlight();
          // if caller block is in a collapsed parent, highlight collapsed parent too
          var others = callers[i].collapsedParents();
          if (others)
            for (var j=0; j < others.length; j++) 
              others[j].backlight(); 
        }
      }
    };
    options.push(option); 
  },
  defType_: 'procedures_defnoreturn'
};

Blockly.Blocks['procedures_callreturn'] = {
  /**
   * Block for calling a procedure with a return value.
   * @this Blockly.Block
   */
  init: function() {
    this.category = 'UNKNOWN';  // for blockscad - jayod
    this.setHelpUrl(Blockly.Msg.PROCEDURES_CALLRETURN_HELPURL);
    this.setColour(Blockscad.Toolbox.HEX_PROCEDURE);
    this.appendDummyInput('TOPROW')
        .appendField('', 'NAME');
    this.setOutput(true);
    // Tooltip is set in domToMutation.
    this.arguments_ = [];
    this.quarkConnections_ = {};
    this.quarkIds_ = null;
  },
   /**
   * on being added, this will be called to get the parent procedure type for BlocksCAD
   */
  getType: function() {  // for blockscad - jayod
    var parent = Blockly.Procedures.getDefinition(this.getFieldValue('NAME'),this.workspace);
    if (parent) {
      var myType = parent.myType_;
      if (myType) {
       this.outputConnection.setCheck(myType); 
        if (myType == 'Number')
          this.category = 'NUMBER'
        else if (myType == 'Boolean')
          this.category = 'BOOLEAN';
        else this.category = 'UNKNOWN'; 
      }
    }
  }, 
  getProcedureCall: Blockly.Blocks['procedures_callnoreturn'].getProcedureCall,
  renameProcedure: Blockly.Blocks['procedures_callnoreturn'].renameProcedure,
  setProcedureParameters_:
      Blockly.Blocks['procedures_callnoreturn'].setProcedureParameters_,
  updateShape_: Blockly.Blocks['procedures_callnoreturn'].updateShape_,
  mutationToDom: Blockly.Blocks['procedures_callnoreturn'].mutationToDom,
  domToMutation: Blockly.Blocks['procedures_callnoreturn'].domToMutation,
  renameVar: Blockly.Blocks['procedures_callnoreturn'].renameVar,
  onchange: Blockly.Blocks['procedures_callnoreturn'].onchange,
   /**
   * Add menu option to find the definition block for this call.
   * @param {!Array} options List of menu options to add to.
   * @this Blockly.Block
   */
  customContextMenu: function(options) {
    var option = {enabled: true};
    option.text = Blockly.Msg.PROCEDURES_HIGHLIGHT_DEF;
    var name = this.getProcedureCall();
    var workspace = this.workspace;
    option.callback = function() {
      var def = Blockly.Procedures.getDefinition(name, workspace);
      workspace.clearBacklight();
      def && def.backlight();
    };
    options.push(option);

    // for BlocksCAD, 
    var name = this.getProcedureCall();
    var option = {enabled: true};
    option.text = Blockscad.Msg.HIGHLIGHT_INSTANCES.replace("%1",name);

    var workspace = this.workspace;
    option.callback = function() {
      var def = Blockly.Procedures.getDefinition(name, workspace);
      if (def) {
        var callers = Blockly.Procedures.getCallers(name, workspace);
        workspace.clearBacklight();
        Blockly.selected.unselect();
        for (var i = 0; callers && i < callers.length; i++) {
          callers[i] && callers[i].backlight(); 
          // if caller block is in a collapsed parent, highlight collapsed parent too
          var others = callers[i].collapsedParents();
          if (others)
            for (var j=0; j < others.length; j++) 
              others[j].backlight(); 
        }
      }
    };
    options.push(option); 
  },
  defType_: 'procedures_defreturn'  
};

// Blockly.Blocks['procedures_ifreturn'] = {  // commented out for Blockscad
//   /**
//    * Block for conditionally returning a value from a procedure.
//    * @this Blockly.Block
//    */
//   init: function() {
//     this.setHelpUrl('http://c2.com/cgi/wiki?GuardClause');
//     this.setColour(290);
//     this.appendValueInput('CONDITION')
//         .setCheck('Boolean')
//         .appendField(Blockly.Msg.CONTROLS_IF_MSG_IF);
//     this.appendValueInput('VALUE')
//         .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//     this.setInputsInline(true);
//     this.setPreviousStatement(true);
//     this.setNextStatement(true);
//     this.setTooltip(Blockly.Msg.PROCEDURES_IFRETURN_TOOLTIP);
//     this.hasReturnValue_ = true;
//   },
//   /**
//    * Create XML to represent whether this block has a return value.
//    * @return {Element} XML storage element.
//    * @this Blockly.Block
//    */
//   mutationToDom: function() {
//     var container = document.createElement('mutation');
//     container.setAttribute('value', Number(this.hasReturnValue_));
//     return container;
//   },
//   /**
//    * Parse XML to restore whether this block has a return value.
//    * @param {!Element} xmlElement XML storage element.
//    * @this Blockly.Block
//    */
//   domToMutation: function(xmlElement) {
//     var value = xmlElement.getAttribute('value');
//     this.hasReturnValue_ = (value == 1);
//     if (!this.hasReturnValue_) {
//       this.removeInput('VALUE');
//       this.appendDummyInput('VALUE')
//         .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//     }
//   },
//   /**
//    * Called whenever anything on the workspace changes.
//    * Add warning if this flow block is not nested inside a loop.
//    * @this Blockly.Block
//    */
//   onchange: function() {
//     if (!this.workspace) {
//       // Block has been deleted.
//       return;
//     }
//     var legal = false;
//     // Is the block nested in a procedure?
//     var block = this;
//     do {
//       if (block.type == 'procedures_defnoreturn' ||
//           block.type == 'procedures_defreturn') {
//         legal = true;
//         break;
//       }
//       block = block.getSurroundParent();
//     } while (block);
//     if (legal) {
//       // If needed, toggle whether this block has a return value.
//       if (block.type == 'procedures_defnoreturn' && this.hasReturnValue_) {
//         this.removeInput('VALUE');
//         this.appendDummyInput('VALUE')
//           .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//         this.hasReturnValue_ = false;
//       } else if (block.type == 'procedures_defreturn' &&
//                  !this.hasReturnValue_) {
//         this.removeInput('VALUE');
//         this.appendValueInput('VALUE')
//           .appendField(Blockly.Msg.PROCEDURES_DEFRETURN_RETURN);
//         this.hasReturnValue_ = true;
//       }
//       this.setWarningText(null);
//     } else {
//       this.setWarningText(Blockly.Msg.PROCEDURES_IFRETURN_WARNING);
//     }
//   }
// };