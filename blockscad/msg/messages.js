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

// User Interface
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
Blockscad.Msg.IMPORT_STL_MENU = 'Import STL file into Current Project';
/// Menu title to export Openscad code (.scad file) to the local machine
Blockscad.Msg.SAVE_SCAD_LOCAL = 'Save OpenSCAD code to your Computer';
/// Options Menu Title
Blockscad.Msg.OPTIONS_MENU = 'Options';
/// Menu option Simple Toolbox, a toolbox with only the most-used blocks
Blockscad.Msg.SIMPLE_TOOLBOX = 'Simple Toolbox';
/// Menu option Advanced Toolbox, a toolbox with all blocks available (this is the default)
Blockscad.Msg.ADVANCED_TOOLBOX = 'Advanced Toolbox';
/// Menu option Block Color Scheme, allowing the user to switch the colors of the block categories
Blockscad.Msg.BLOCK_COLORS = 'Block Color Scheme';
/// Menu option for original color scheme for blocks - the "classic" or default option
Blockscad.Msg.CLASSIC_COLORS = 'Classic';
/// Menu option for pale color scheme for blocks
Blockscad.Msg.PALE_COLORS = 'Pale';
/// Help Menu Title
Blockscad.Msg.HELP_MENU = 'Help';
/// Menu link to tool documentation
Blockscad.Msg.DOCUMENTATION = 'Documentation';
/// Menu title for About page
Blockscad.Msg.ABOUT = 'About';
/// Examples Menu Title
Blockscad.Msg.EXAMPLES_MENU = 'Examples';
/// Project Name input area - text to indicate where the user can give a name to their project
Blockscad.Msg.PROJECT_NAME = 'Project Name';
/// Project name default value - the name given to every new project to indicate that it doesn't have a title yet
Blockscad.Msg.PROJECT_NAME_DEFAULT = 'Untitled';
/// Blocks Tab text - tab text for switching to the view of the block form of the program
Blockscad.Msg.BLOCKS_TAB = 'Blocks';
/// Code Tab text - tab text for switching to the text view of the program code
Blockscad.Msg.CODE_TAB = 'Code';

// Render Window Text
/// Render button text
Blockscad.Msg.RENDER_BUTTON = 'Render';
/// Abort button text - button used to cancel rendering
Blockscad.Msg.ABORT_BUTTON = 'Abort!';
/// Generate STL button text
Blockscad.Msg.GENERATE_STL = 'Generate STL';
/// Rendering in progress informational text
Blockscad.Msg.RENDERING = 'Rendering';
// need to add in error messages
// switch the reset view to pictures?

// text found on Blocks
// Shapes (2D and 3D)
/// Sphere Block - block that produces a sphere 
Blockscad.Msg.SPHERE = 'sphere';
/// Radius - the distance from the center of a circle or sphere to its edge
Blockscad.Msg.RADIUS = 'radius';
/// Centered - property of a shape which makes it centered at the origin (where X, Y, Z axes intersect)
Blockscad.Msg.CENTERED = 'centered';
/// Not Centered - property of a shape which is not centered along one or more axes
Blockscad.Msg.NOT_CENTERED = 'not centered';
/// Cube block - block that produces a cube 
Blockscad.Msg.CUBE = 'cube';
/// Cylinder block - block that produces a cylinder or cone
Blockscad.Msg.CYLINDER = 'cylinder';
/// Torus block - block that produces a torus
Blockscad.Msg.TORUS = 'torus';
/// Circle block - block that produces a 2D circle
Blockscad.Msg.CIRCLE = 'circle';
/// Square block - block that produces a 2D square
Blockscad.Msg.SQUARE = 'square';
// Transformations
/// Translate - move a shape around in space
Blockscad.Msg.TRANSLATE = 'translate';
/// Rotate - rotate a shape in space
Blockscad.Msg.ROTATE = 'rotate';
/// Mirror - mirror or reflect a shape across a plane
Blockscad.Msg.MIRROR = 'mirror';
/// Scale - scale the size of a shape up or down
Blockscad.Msg.SCALE = 'scale';
/// Color - change the color of a shape
Blockscad.Msg.COLOR = 'color';
/// Sides - change the smoothness, or resolution, of a shape by changing how many sides are used to approximate a curve
Blockscad.Msg.SIDES = 'sides';
/// Taper - taper a shape along an axis
Blockscad.Msg.TAPER = 'taper';
/// Linear Extrude - extrude a 2D shape upwards to form a 3D shape
Blockscad.Msg.LINEAR_EXTRUDE = 'linear extrude';
/// Rotate Extrude - extrue a 2D shape around in a ring to form a torus
Blockscad.Msg.ROTATE_EXTRUDE = 'rotate extrude';
/// Height - a parameter of a shape to control how high or tall it is
Blockscad.Msg.HEIGHT = 'height';
/// Faces - a torus parameter to control how many segments are used to approximate the curve of the cross-section
Blockscad.Msg.FACES = 'faces';
/// Across - for mirroring a shape "across" a plane
Blockscad.Msg.ACROSS = 'across';
/// Along - for tapering a shape "along" an axis
Blockscad.Msg.ALONG = 'along';
/// Axis - line of rotation in 3D space
Blockscad.Msg.AXIS = 'axis';
/// Advanced rotation: applies a rotation around a vector specified by the user.  Needs to differentiate the block from the basic rotation block.
Blockscad.Msg.ROTATE_ADVANCED = 'fancy rotate';
/// Advanced mirror: applies a reflection across a plane whose normal vector is specified by the user.  Needs to differentiate the block from the basic mirror block.
Blockscad.Msg.MIRROR_ADVANCED = 'fancy mirror';
/// Around: for rotation "around" a specified axis
Blockscad.Msg.AROUND = 'around';
/// RGB - a color model with the parameters red, green, blue
Blockscad.Msg.RGB_COLOR_MODEL = 'RGB';
/// HSV - a color model with the parameters hue, saturation, and value.
Blockscad.Msg.HSV_COLOR_MODEL = 'HSV';
/// Hue: the first parameter in the HSV (hue, saturation, value) color scheme
Blockscad.Msg.COLOR_HUE = 'hue';
/// Saturation: the second parameter in the HSV (hue, saturation, value) color scheme
Blockscad.Msg.COLOR_SATURATION = 'saturation';
/// Value: the third parameter in the HSV (hue, saturation, value) color scheme
Blockscad.Msg.COLOR_VALUE = 'value';
/// Twist: as a shape is rotated upward, it can be gradually "twist"ed (turned, rotated) ending up with a partial corkscrew or helix type of shape.
Blockscad.Msg.TWIST = 'twist';
/// STL Import: this is a block that, when clicked, allows the user to upload an STL file (a 3D shape) from their local computer into their project.
Blockscad.Msg.IMPORT_STL = 'STL import';
/// Browse: button that, when pressed, allows the user to pick out the file they want to upload from all the choices in a directory.
Blockscad.Msg.BROWSE = 'browse';
/// Text: general term for letters, numbers, and other symbols available on a keyboard 
Blockscad.Msg.TEXT = 'text'; 
/// Font size: word to indicate how large or small the letters should be printed
Blockscad.Msg.FONT_SIZE = 'size';
/// Font: the style that the letters are written in
Blockscad.Msg.FONT_NAME = 'font';
/// Thickness: when letters are printed on the XY plane, "thickness" is how high the letter model is in the Z direction. 
Blockscad.Msg.TEXT_THICKNESS = 'thickness';
/// Default Text:  the default text in a text block.  A conversational greeting word is a good choice.  In English this is "hello".
Blockscad.Msg.TEXT_DEFAULT_VALUE = 'hello';
/// Convex Hull: this block computes the convex hull of the set of points of all the shapes given to it.  The effect is to wrap the objects together into a single convex object (with no parts that dip inward). This is a mathematical term.  
Blockscad.Msg.CONVEX_HULL = 'hull';
/// Difference: takes one object and subtracts away another. This is a term from set theory in mathematics.
Blockscad.Msg.DIFFERENCE = 'difference';
/// Union: groups objects into a single object.  This is a term from set theory in mathematics.
Blockscad.Msg.UNION = 'union';
/// Intersection: returns the overlapping parts of two or more objects.  This is a term from set theory in mathematics.
Blockscad.Msg.INTERSECTION = 'intersection';
/// Plus: a word used when adding numbers together:  A 'plus' B  is A + B
Blockscad.Msg.PLUS = 'plus';
/// Minus: the word used when subtracting numbers:  A 'minus' B  is  A - B
Blockscad.Msg.MINUS = 'minus';
/// With: preposition to indicate that two things are together:  combine A 'with' B
Blockscad.Msg.WITH = 'with';

// Block category labels
/// 3D Shapes:  these blocks model three dimensional shapes like spheres, cubes, and cylinders
Blockscad.Msg.CATEGORY_3D_SHAPES = '3D Shapes';
/// 2D Shapes:  these blocks model flat shapes like circles and spheres
Blockscad.Msg.CATEGORY_2D_SHAPES = '2D Shapes';
/// Transforms: These blocks apply mathematical transformations to their child shapes, such as moving them, rotating them, scaling them, etc.
Blockscad.Msg.CATEGORY_TRANSFORMATIONS = 'Transforms';
/// Set Operations: These blocks combine multiple child shapes with mathematical set theory operations like union, difference, and intersection.
Blockscad.Msg.CATEGORY_SET_OPERATIONS = 'Set Ops';
/// Math: these blocks are used to make mathematical calculations
Blockscad.Msg.CATEGORY_MATH = 'Math';
/// Logic: these blocks perform logical operations that return true/false values like (if A > B),  or (if C is true then do something), or (does A equal B?)
Blockscad.Msg.CATEGORY_LOGIC = 'Logic';
/// Loops: loops are a programming concept that allow actions to be repeated a number of times (specified by the programmer)
Blockscad.Msg.CATEGORY_LOOPS = 'Loops';
/// Text: these blocks allow the modeling of text as a 3D or 2D mesh
Blockscad.Msg.CATEGORY_TEXT = 'Text';
/// Variables: variables are used to store data in memory (in computer programming).
Blockscad.Msg.CATEGORY_VARIBLES = 'Variables';
/// Procedures: Blocks for defining [https://en.wikipedia.org/wiki/Procedure_(computer_science) functions].  OpenSCAD refers to their functions/procedures as "modules", so that is the choice in English.
Blockscad.Msg.CATEGORY_PROCEDURES = 'Modules';


