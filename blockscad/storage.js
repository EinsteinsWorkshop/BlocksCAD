/**
 * @fileoverview Loading and saving blocks with localStorage and cloud storage.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

// Create a namespace.
var BlocklyStorage = BlocklyStorage || {};
var Blockscad = Blockscad || {};
Blockscad.Auth = Blockscad.Auth || {};
var Blockly = Blockly || {};
Blockly.Xml = Blockly.Xml || {};

/**
 * Backup code blocks to localStorage.
 * @private
 */
BlocklyStorage.backupBlocks_ = function() {
  console.log("in backupBlocks");
  if ('localStorage' in window) {
    var xml = Blockly.Xml.workspaceToDom(Blockly.getMainWorkspace());
    // Gets the current URL, not including the hash.
    var url = window.location.href.split('#')[0];
    var url2 = url + "proj_name";
    var url3 = url + "current_project";
    var project_name = $('#project-name').val();

    var current_project = Blockscad.Auth.currentProject; 

    window.localStorage.setItem(url, Blockly.Xml.domToText(xml));
    window.localStorage.setItem(url2, project_name);
    window.localStorage.setItem(url3, current_project);
  }
};

/**
 * Bind the localStorage backup function to the unload event.
 */
BlocklyStorage.backupOnUnload = function() {
  console.log("in backupOnUnload");
  window.addEventListener('unload', BlocklyStorage.backupBlocks_, false);
};

/**
 * Restore code blocks from localStorage.
 */
BlocklyStorage.restoreBlocks = function() {
  var url = window.location.href.split('#')[0];
  var url2 = url + "proj_name";
  var url3 = url + "current_project";
  if ('localStorage' in window && window.localStorage[url]) {
    var xml = Blockly.Xml.textToDom(window.localStorage[url]);
    Blockly.Xml.domToWorkspace(Blockly.getMainWorkspace(), xml);
    var project_name = window.localStorage[url2];
    if (project_name != "undefined") {
      $('#project-name').val(project_name);
    }
    else $('#project-name').val('Untitled');
    var current_project = window.localStorage[url3];
    if (current_project != "undefined") {
      Blockscad.Auth.currentProject = current_project;
    }
    else Blockscad.Auth.currentProject = '';
  }
};
