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
 * @fileoverview Checkbox field.  Checked or not checked.
 * @author fraser@google.com (Neil Fraser)
 */
'use strict';

goog.provide('Blockly.FieldCheckbox');

goog.require('Blockly.Field');

// how big should toggleable images be?
var sz = 27;

/**
 * Class for a checkbox field.
 * @param {string} state The initial state of the field ('TRUE' or 'FALSE').
 * @param {Function=} opt_changeHandler A function that is executed when a new
 *     option is selected.  Its sole argument is the new checkbox state.  If
 *     it returns a value, this becomes the new checkbox state, unless the
 *     value is null, in which case the change is aborted.
 * @extends {Blockly.Field}
 * @constructor
 */
Blockly.FieldCheckbox = function(state, opt_changeHandler,img1,img2) {
  Blockly.FieldCheckbox.superClass_.constructor.call(this, '');
  // do I have two images?
  if (img1 && img2) {
    this.img1 = img1;
    this.img2 = img2;
  }
  if (img1 && img2)
  this.size_ = new goog.math.Size(sz, sz);
  this.setChangeHandler(opt_changeHandler);
  // Set the initial state.
  this.state_ = (state == 'TRUE');
};
goog.inherits(Blockly.FieldCheckbox, Blockly.Field);

/**
 * Mouse cursor style when over the hotspot that initiates editability.
 */
Blockly.FieldCheckbox.prototype.CURSOR = 'default';

/**
 * Rectangular mask used by Firefox.
 * @type {Element}
 * @private
 */
Blockly.FieldCheckbox.prototype.rectElement_ = null;

/**
 * Install this checkbox on a block.
 * @param {!Blockly.Block} block The block containing this text.
 */
Blockly.FieldCheckbox.prototype.init = function(block) {
  if (this.sourceBlock_) {
    // Checkbox has already been initialized once.
    return;
  }

  if (!(this.img1 && this.img2)) {
    // The checkbox doesn't use the inherited text element.
    // Instead it uses a custom checkmark element that is either visible or not.
    Blockly.FieldCheckbox.superClass_.init.call(this, block);
    this.checkElement_ = Blockly.createSvgElement('text',
        {'class': 'blocklyText', 'x': -3}, this.fieldGroup_);
    var textNode = document.createTextNode('\u2713');
    this.checkElement_.appendChild(textNode);
    this.checkElement_.style.display = this.state_ ? 'block' : 'none';
  }
  else {
    // code from field_image and field prototype init
    // console.log("got some images");
    this.sourceBlock_ = block;
    // Build the DOM.
    this.fieldGroup_ = Blockly.createSvgElement('g', {}, null);
    // if (!this.visible_) {
    //   this.fieldGroup_.style.display = 'none';
    // }
    // this.fieldGroup_.style.display = 'inline';
    var offsetY = 1 - Blockly.BlockSvg.FIELD_HEIGHT;

    this.imageElement_ = Blockly.createSvgElement('image',
        {'height': sz + 'px',
         'width': sz + 'px',
         'y': offsetY}, this.fieldGroup_);
    this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
        'xlink:href', (this.state_)  ? this.img1 : this.img2);
    if (goog.userAgent.GECKO) {
      // Due to a Firefox bug which eats mouse events on image elements,
      // a transparent rectangle needs to be placed on top of the image.
      this.rectElement_ = Blockly.createSvgElement('rect',
          {'height': sz + 'px',
           'width': sz + 'px',
           'y': offsetY,
           'fill-opacity': 0}, this.fieldGroup_);
    }
    this.updateEditable();
    block.getSvgRoot().appendChild(this.fieldGroup_);
    this.mouseUpWrapper_ =
        Blockly.bindEvent_(this.fieldGroup_, 'mouseup', this, this.onMouseUp_);
    // Force a render.
    // this.updateTextNode_();

  }
    this.setValue(String(this.state_).toUpperCase());
};

/**
 * Return 'TRUE' if the checkbox is checked, 'FALSE' otherwise.
 * @return {string} Current state.
 */
Blockly.FieldCheckbox.prototype.getValue = function() {
  return String(this.state_).toUpperCase();
};

/**
 * Set the checkbox to be checked if strBool is 'TRUE', unchecks otherwise.
 * Can also toggle between two images if they exist.
 * @param {string} strBool New state.
 */
Blockly.FieldCheckbox.prototype.setValue = function(strBool) {
  var newState = (strBool == 'TRUE');
  // console.log("this.state_:",this.state_);
  // console.log("newState:",newState);

  if (this.state_ !== newState) {
    this.state_ = newState;
    // console.log("setting checkbox to:",this.state_);
    if (this.checkElement_) {
      this.checkElement_.style.display = newState ? 'block' : 'none';
    }
    else if (this.imageElement_) {
      this.imageElement_.setAttributeNS('http://www.w3.org/1999/xlink',
          'xlink:href', newState ? this.img1 : this.img2);
    }
    if (this.sourceBlock_ && this.sourceBlock_.rendered) {
      this.sourceBlock_.workspace.fireChangeEvent();
    }
  }
};

/**
 * Toggle the state of the checkbox.
 * @private
 */
Blockly.FieldCheckbox.prototype.showEditor_ = function() {
  var newState = !this.state_;
  if (this.sourceBlock_ && this.changeHandler_) {
    // Call any change handler, and allow it to override.
    var override = this.changeHandler_(newState);
    if (override !== undefined) {
      newState = override;
    }
  }
  if (newState !== null) {
    this.setValue(String(newState).toUpperCase());
  }
};
