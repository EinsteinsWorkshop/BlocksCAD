/*
    Copyright (C) 2014-2015  H3XL, Inc

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

/**
 * @fileoverview English strings.
 * @author J. Yoder
 *
 * After modifying this file, either run "build.py" from the parent directory,
 * or run (from this directory):
 * js_to_json.py
 * to regenerate json/{en,qqq,synonyms}.json.
 *
 * To convert all of the json files to .js files, run:
 * create_messages.py json/*.json
 */
'use strict';

goog.provide('Blockscad.Msg.en');

// goog.require('Blockscad.Msg');

/// User Interface
/// Project Menu title
Blockscad.Msg.PROJECT_MENU = 'Project';
/// Menu title to create a new project
Blockscad.Msg.NEW = 'New';
/// Menu title to save xml block file to the local machine
Blockscad.Msg.SAVE_BLOCKS_LOCAL = 'Save Blocks to your Computer';
/// Menu title to load xml blocks from the local machine and put them in a new project
Blockscad.Msg.LOAD_BLOCKS_LOCAL = 'Load Blocks from your Computer';
/// Menu title to import xml blocks into the current project (keeping any current blocks)
Blockscad.Msg.IMPORT_BLOCKS_LOCAL = 'Import Blocks into Current Project';
/// Menu title to import an .stl file from the local machine into the current project
Blockscad.Msg.IMPORT_STL = 'Import STL file into Current Project';
/// Menu title to export Openscad code (.scad file) to the local machine
Blockscad.Msg.SAVE_SCAD_LOCAL = 'Save OpenSCAD code to your Computer';
/// Options Menu Title
Blockscad.Msg.OPTIONS_MENU = 'Options';
/// context menu - Make a copy of the selected block (and any blocks it contains).



