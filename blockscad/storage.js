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

BlocklyStorage.autosaveBlocks = function(xml_text) {
  if ('localStorage' in window) {

    // in standalone, the "url" scheme doesn't work.  Have to name the
    // items in localStorage directly.

    localStorage.xml = xml_text;
    localStorage.proj_name = $('#project-name').val();
  }
};
BlocklyStorage.standaloneRestoreBlocks = function() {
  if (localStorage.xml) {

    var xml = Blockly.Xml.textToDom(localStorage.xml);
    Blockly.Xml.domToWorkspace(Blockly.mainWorkspace, xml);
    var project_name = localStorage.proj_name;
    if (project_name != "undefined") {
      $('#project-name').val(project_name);
    }
    else $('#project-name').val('Untitled');
  }
}
/**
 * Backup code blocks to localStorage.
 * @private
 */
BlocklyStorage.backupBlocks_ = function() {
  // console.log("in backupBlocks");
  if ('localStorage' in window) {
    // clear out old stuff from localStorage
    localStorage.clear();
    var xml = Blockly.Xml.workspaceToDom(Blockscad.workspace);
    // Gets the current URL, not including the hash.
    var url = window.location.href.split('#')[0];
    url = url.split('?lang')[0];
    var url2 = url + "proj_name";
    var url3 = url + "current_project";
    var url4 = url + "current_project_key";
    var url5 = url + "needToSave";

    // do I have any stl files (converted to CSG commands) I want to save?
    // TO-DO: don't do this unless you find it in the xml you're saving.  
    var blocks = Blockscad.workspace.getAllBlocks();
    for (var i = 0; i < blocks.length; i++){
      if (blocks[i].type == 'stl_import') {
        var csg_key = blocks[i].getField('STL_CONTENTS').getText();
        if (csg_key.length > 0) {
          var url_csg = url + csg_key;
          var url_csg_center = url + csg_key + 'center';
          // can I zip up the text?
          // only save this if it isn't too big.
          if (Blockscad.csg_commands[csg_key].length < 3000000) {
            var compressed_data = Base64.toBase64(RawDeflate.deflate(Base64.utob(Blockscad.csg_commands[csg_key])));
            window.localStorage.setItem(url_csg, compressed_data);
            window.localStorage.setItem(url_csg_center, Blockscad.csg_center[csg_key]);
          }
        }
      }
    }

    window.localStorage.setItem(url, Blockly.Xml.domToText(xml));
    window.localStorage.setItem(url2, $('#project-name').val());
    window.localStorage.setItem(url3, Blockscad.Auth.currentProject);
    window.localStorage.setItem(url4, Blockscad.Auth.currentProjectKey);
    window.localStorage.setItem(url5, Blockscad.undo.needToSave);
  }
};

/**
 * Bind the localStorage backup function to the unload event.
 */
BlocklyStorage.backupOnUnload = function() {
  //console.log("in backupOnUnload");
  window.addEventListener('unload', BlocklyStorage.backupBlocks_, false);
};

/**
 * Restore code blocks from localStorage.
 */
BlocklyStorage.restoreBlocks = function() {
  var url = window.location.href.split('#')[0];
  url = url.split('?lang')[0];
  // console.log("url for restoring blocks is:",url);
  var url2 = url + "proj_name";
  var url3 = url + "current_project";
  var url4 = url + "current_project_key";
  var url5 = url + "needToSave";

  console.log(window.localStorage);
  if ('localStorage' in window && window.localStorage[url]) {
    var xml = Blockly.Xml.textToDom(window.localStorage[url]);
    Blockly.Xml.domToWorkspace(xml, Blockscad.workspace);

    var blocks = Blockscad.workspace.getAllBlocks();
    for (var i = 0; i < blocks.length; i++){
      if (blocks[i].type == 'stl_import') {
        var csg_key = blocks[i].getField('STL_CONTENTS').getText();
        var csg_filename = blocks[i].getField('STL_FILENAME').getText();
        var browse_button = blocks[i].getField('STL_BUTTON');
        if (csg_key.length > 0) {
          var url_csg = url + csg_key;
          var url_csg_center = url + csg_key + 'center';
          var csg_contents = window.localStorage[url_csg];
          var csg_center = window.localStorage[url_csg_center];
          if (csg_contents && csg_contents.length>0) {
            browse_button.setVisible(false);
            // inflate and assign to my variable.
            //console.log("csg contents compressed is:",csg_contents);
            console.log("csg contents compressed length is:",csg_contents.length);
            var decompressed = Base64.btou(RawDeflate.inflate(Base64.fromBase64(csg_contents)));
            console.log("decompressed lengeth is:",decompressed.length);
            Blockscad.csg_commands[csg_key] = decompressed;
            // I need to populate the filename->key variable too.  
            Blockscad.csg_filename[csg_key] = csg_filename + ":::";
            Blockscad.csg_center[csg_key] = csg_center;
            blocks[i].render();
          }
          else {
            // The xml thinks there should be stl data here, but I can't find it.  Clear the block.
            console.log("couldn't find the stl in localStorage");

            // set a warning message in the render pane

            $( '#error-message' ).html("Warning: Re-load your .STL files");
            blocks[i].getField('STL_CONTENTS').setText('');
            blocks[i].getField('STL_FILENAME').setText('');
            var cText = blocks[i].getCommentText();
            if (!cText.match(/^RELOAD/)) cText = 'RELOAD: ' + cText;
            blocks[i].setCommentText(cText);
            browse_button.setText('Reload');

            blocks[i].backlight();
            // if block is in a collapsed parent, highlight collapsed parent too
            var others = blocks[i].collapsedParents();
            if (others)
              for (var j=0; j < others.length; j++) 
                others[j].backlight(); 

            if (!blocks[i].isCollapsed())
              browse_button.setVisible(true);

            // Bubble up to re-collapse top collapsed block
            var parent = blocks[i];
            var collapsedParent = null;
            while (parent) {
              if (parent.isCollapsed()) {
                collapsedParent = parent;
              }
              parent = parent.getSurroundParent();
            }
            if (collapsedParent) {
              collapsedParent.setCollapsed(true,true);
            } 
            blocks[i].render();
            // If my block had a button field for browsing, I'd make it visible now.
            // Then I'd make the filename field invisible.
          }
        }
      }
    }

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
    var current_project_key = window.localStorage[url4];
    if (current_project_key != "undefined") {
      Blockscad.Auth.currentProjectKey = current_project_key;
    }
    var needToSave = Number(window.localStorage[url5]);
    if (needToSave != "undefined" && (needToSave == 1 || needToSave == 0)) {
      setTimeout(function() {
        Blockscad.undo.needToSave = needToSave;
      }, 300);
    }

  }
};
