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
 * @fileoverview Non-editable text field.  Used for titles, labels, etc.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldLabel');

goog.require('Blockly.Field');
goog.require('Blockly.Tooltip');
goog.require('goog.dom');
goog.require('goog.math.Size');

var Blockscad = Blockscad || {};


/**
 * Class for a non-editable field.
 * @param {string} text The initial content of the field.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldLabel = function(text) {
  this.sourceBlock_ = null;
  this.size_ = new goog.math.Size(0, 25);
  this.setText(text);
};
goog.inherits(Blockly.FieldLabel, Blockly.Field);

/**
 * Editable fields are saved by the XML renderer, non-editable fields are not.
 */
Blockly.FieldLabel.prototype.EDITABLE = false;

/**
 * Install this text on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
Blockly.FieldLabel.prototype.init = function(block) {
  if (this.sourceBlock_) {
    // Text has already been initialized once.
    return;
  }
  this.sourceBlock_ = block;

  // Build the DOM.
  this.textElement_ = Blockly.createSvgElement('text',
      {'class': 'blocklyText'}, null);
  if (!this.visible_) {
    this.textElement_.style.display = 'none';
  }
  block.getSvgRoot().appendChild(this.textElement_);

  // Configure the field to be transparent with respect to tooltips.
  this.textElement_.tooltip = this.sourceBlock_;
  Blockly.Tooltip.bindMouseEvents(this.textElement_);
  // Force a render.
  this.updateTextNode_();
};

/**
 * Dispose of all DOM objects belonging to this text.
 */
Blockly.FieldLabel.prototype.dispose = function() {
  goog.dom.removeNode(this.textElement_);
  this.textElement_ = null;
};

/**
 * Gets the group element for this field.
 * Used for measuring the size and for positioning.
 * @return {!Element} The group element.
 */
Blockly.FieldLabel.prototype.getSvgRoot = function() {
  return /** @type {!Element} */ (this.textElement_);
};

/**
 * Change the tooltip text for this field.
 * @param {string|!Element} newTip Text for tooltip or a parent element to
 *     link to for its tooltip.
 */
Blockly.FieldLabel.prototype.setTooltip = function(newTip) {
  this.textElement_.tooltip = newTip;
};

// lets try adding in a button, which will be a text element that when you click on it, 
// the "editor" is to do the file choose menu.
goog.provide('Blockly.FieldButton');

goog.require('Blockly.Field');
goog.require('Blockly.Msg');
goog.require('goog.asserts');
goog.require('goog.dom');
goog.require('goog.userAgent');


/**
 * Class for an editable text field.
 * @param {string} text The initial content of the field.
 * @param {Function=} opt_changeHandler An optional function that is called
 *     to validate any constraints on what the user entered.  Takes the new
 *     text as an argument and returns either the accepted text, a replacement
 *     text, or null to abort the change.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldButton = function(text, opt_changeHandler) {
  Blockly.FieldButton.superClass_.constructor.call(this, text);
  this.setChangeHandler(opt_changeHandler);
};
goog.inherits(Blockly.FieldButton, Blockly.Field);

/**
 * Mouse cursor style when over the hotspot that initiates the editor.
 */
Blockly.FieldButton.prototype.CURSOR = 'default';
/**
 * Editable fields are saved by the XML renderer, non-editable fields are not.
 */
Blockly.FieldButton.prototype.EDITABLE = true;

/**
 * Close the input widget if this input is being deleted.
 */
Blockly.FieldButton.prototype.dispose = function() {
  Blockly.WidgetDiv.hideIfOwner(this);
  Blockly.FieldButton.superClass_.dispose.call(this);
};

/**
 * Set the text in this field.
 * @param {?string} text New text.
 * @override
 */
Blockly.FieldButton.prototype.setText = function(text) {
  if (text === null) {
    // No change if null.
    return;
  }
  if (this.sourceBlock_ && this.changeHandler_) {
    var validated = this.changeHandler_(text);
    // If the new text is invalid, validation returns null.
    // In this case we still want to display the illegal result.
    if (validated !== null && validated !== undefined) {
      text = validated;
    }
  }
  Blockly.Field.prototype.setText.call(this, text);
};


/**
 * Show the inline free-text editor on top of the text.
 * @param {boolean=} opt_quietInput True if editor should be created without
 *     focus.  Defaults to false.
 * @private
 */
Blockly.FieldButton.prototype.showEditor_ = function(opt_quietInput) {
  console.log("editor activated");
  Blockscad.currentInterestingBlock = this.sourceBlock_;
  $('#importStl').click();
};




/**
 * Close the editor, save the results, and dispose of the editable
 * text field's elements.
 * @return {!Function} Closure to call on destruction of the WidgetDiv.
 * @private
 */
Blockly.FieldButton.prototype.widgetDispose_ = function() {
  var thisField = this;
  return function() {
    var htmlInput = Blockly.FieldButton.htmlInput_;
    // Save the edit (if it validates).
    var text = htmlInput.value;
    if (thisField.sourceBlock_ && thisField.changeHandler_) {
      var text1 = thisField.changeHandler_(text);
      if (text1 === null) {
        // Invalid edit.
        text = htmlInput.defaultValue;
      } else if (text1 !== undefined) {
        // Change handler has changed the text.
        text = text1;
      }
    }
    thisField.setText(text);
    thisField.sourceBlock_.rendered && thisField.sourceBlock_.render();
    Blockly.unbindEvent_(htmlInput.onKeyDownWrapper_);
    Blockly.unbindEvent_(htmlInput.onKeyUpWrapper_);
    Blockly.unbindEvent_(htmlInput.onKeyPressWrapper_);
    Blockly.unbindEvent_(htmlInput.onWorkspaceChangeWrapper_);
    Blockly.FieldButton.htmlInput_ = null;
    // Delete the width property.
    Blockly.WidgetDiv.DIV.style.width = 'auto';
  };
};

