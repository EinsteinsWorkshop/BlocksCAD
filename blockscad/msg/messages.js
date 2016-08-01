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
 * After modifying this file, either run (from this directory):
 * js_to_json.py
 * to regenerate json/{en,qqq,synonyms}.json.
 *
 * To convert all of the json files to .js files, run:
 * create_messages.py json/*.json
 */
'use strict';

goog.provide('Blockscad.Msg.en');

// User Interface
/// Project Menu title
Blockscad.Msg.PROJECT_MENU = 'Project';
/// Menu title to bring up a list of saved projects the user has created
Blockscad.Msg.MY_PROJECTS = 'My projects';
/// Menu title to create a new project
Blockscad.Msg.NEW = 'New';
/// Menu title to save xml block file to the local machine
Blockscad.Msg.SAVE_BLOCKS_LOCAL = 'Save Blocks to your Computer';
/// Menu title to save xml blocks to cloud account as a copy (not overwrite the current project, but save as a new project)
Blockscad.Msg.SAVE_BLOCKS_AS_COPY = 'Save as a Copy';
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
/// Menu option for original color scheme for blocks - the 'classic' or default option
Blockscad.Msg.CLASSIC_COLORS = 'Classic';
/// Menu option for pale color scheme for blocks
Blockscad.Msg.PALE_COLORS = 'Pale';
/// Help Menu Title
Blockscad.Msg.HELP_MENU = 'Help';
/// Menu link to tool documentation
Blockscad.Msg.DOCUMENTATION_LINK = 'Documentation';
/// Menu title for About page
Blockscad.Msg.ABOUT_LINK = 'About';
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

/// Save button
Blockscad.Msg.SAVE_BUTTON = 'Save';
/// Message to the user showing that a save is in progress
Blockscad.Msg.SAVE_IN_PROGRESS = 'Saving...';
/// Message to the user showing that a save completed without error
Blockscad.Msg.SAVE_COMPLETE = 'Saved!';
/// Message showing that a save failed
Blockscad.Msg.SAVE_FAILED = 'Save Failed.';
/// message prompting user to enter a name for their project.
Blockscad.Msg.SAVE_FAILED_PROJECT_NAME = 'Please give your project a name, then try again.';
/// Button to register/sign up for a Blockscad account
Blockscad.Msg.REGISTER_BUTTON = 'Register';
/// message to indicate that the system is processing the registration request
Blockscad.Msg.REGISTER_IN_PROGRESS = 'Registering...';
/// Registration pop-up window title that indicates that a new account is being created
Blockscad.Msg.REGISTER_NEW_USER = 'Register New User';
/// username: Registration/Login windows to indicate the user should type in their username, their account identifier
Blockscad.Msg.USERNAME_FIELD = 'Username';
/// password: label for where the user types in their password
Blockscad.Msg.PASSWORD_FIELD = 'Password';
/// retype password: in registration , the user must enter their password twice.  This label is for the second time they type it in.
Blockscad.Msg.PASSWORD_RETYPE_FIELD = 'Retype Password';
/// email: in registration, user must enter their email address. 
Blockscad.Msg.EMAIL_FIELD = 'Email';
/// forgot password?: link for a user to click to get help recovering their password
Blockscad.Msg.PASSWORD_FORGOT_FIELD = 'Forgot Password?';
/// password reset email sent: inform the user that an email has been sent to their email address with instructions on how to reset their password.
Blockscad.Msg.PASSWORD_RESET_EMAIL_SENT = 'Password Reset Email has been Sent';
/// text explaning next steps after password recovery email has been sent to the user.
Blockscad.Msg.PASSWORD_RESET_EMAIL_INSTRUCTIONS = 'We"ve sent an email to the address associated with your account with a link to reset your password. If you don"t see it, check your spam folder';
/// Button to sign in or log in to an already created Blockscad account
Blockscad.Msg.LOGIN_BUTTON = 'Sign in';
/// message to indicate that the system is processing the login request
Blockscad.Msg.LOGIN_IN_PROGRESS = 'Signing in...';
/// Button to log out of an account
Blockscad.Msg.LOGOUT_BUTTON = 'Logout';
/// link to change user's password
Blockscad.Msg.CHANGE_PASSWORD = 'Change Password';
/// instructions to change user's password:  inform the user that when they have finished changing their password, they will need to log in again.
Blockscad.Msg.CHANGE_PASSWORD_INSTRUCTIONS = 'After changing your password, BlocksCAD will prompt you to login again.';
/// old password: when changing password, user must enter their old (current) password
Blockscad.Msg.OLD_PASSWORD = 'Old Password';
/// new password: when changing password, user must type in the new password they want 
Blockscad.Msg.NEW_PASSWORD = 'New Password';
/// confirm new password: when changing password, user must re-type the new password they want to confirm that they didn't mistype it
Blockscad.Msg.CONFIRM_NEW_PASSWORD = 'Confirm New Password';
/// link to change the email attached to a user's account
Blockscad.Msg.CHANGE_EMAIL = 'Change Email';
/// current email: list the current email attached to a user's account
Blockscad.Msg.CHANGE_EMAIL_CURRENT = 'Current Email';
/// new email: user must type in the new email address they want associated with their account
Blockscad.Msg.CHANGE_EMAIL_NEW = 'New Email';
/// link to delete a users account
Blockscad.Msg.DELETE_ACCOUNT = 'Delete My Account';
/// message asking if the user is sure they want to delete their account
Blockscad.Msg.DELETE_ACCOUNT_CONFIRM = 'Are you sure you want to delete your BlocksCAD account?';
/// instructions for deleting an account. inform the user that the account will be deleted in 48 hours.
Blockscad.Msg.DELETE_ACCOUNT_INSTRUCTIONS_ONE = 'In about 48 hours your account will be permanently deleted.';
/// instructions for deleting an account. inform the user that they can prevent account deletion by logging in within the next two days.
Blockscad.Msg.DELETE_ACCOUNT_INSTRUCTIONS_TWO = 'If you change your mind, just sign in to your account within the next 48 hours.';
/// ask user to confirm account deletion by entering their password
Blockscad.Msg.DELETE_ACCOUNT_CONFIRM_PASSWORD = 'Enter password to confirm';
/// button which deletes the account and signs the user out.
Blockscad.Msg.DELETE_ACCOUNT_BUTTON = 'Delete Account and Sign Out';
/// reactivate account title - if the user logs into their account to prevent deletion, inform them that "Your account will not be deleted"
Blockscad.Msg.REACTIVATE_ACCOUNT_TITLE = 'Your account will not be deleted';
/// reactivate account explanation: explain to the user that their account will not be deleted, and if they hadn't requested deletion, they should change their password.
Blockscad.Msg.REACTIVATE_ACCOUNT_EXPLAINED = 'Your account has been reactivated - it is no longer scheduled to be deleted.  If you didn"t send a delete account request, you should change your password to make sure your account is secure.';
/// reactivate button: this button closes the reactivation dialog.  It doesn't do anything.
Blockscad.Msg.REACTIVATE_BUTTON = 'Okay';
/// message asking if the user is sure they want to delete a project. the text *Project_name* will be replaced with the actual name of the project being deleted. Please do not change the text "*Project_name*", though you may move it around in the phrase as needed.
Blockscad.Msg.DELETE_PROJECT_CONFIRM = 'Are you sure you want to delete *Project_name*?';
/// yes: for confirmation dialogs ("are you sure you want to do xxxxxxx"), this button indicates YES, they want to perform that action.
Blockscad.Msg.CONFIRM_DIALOG_YES = 'Sure';
/// no: for confirmation dialogs ("are you sure you want to do xxxxxxx"), this button indicates NO, they DO NOT want to perform that action, and instead want to cancel the operation.
Blockscad.Msg.CONFIRM_DIALOG_NO = 'Cancel';
/// save prompt: ask the user if they want to save their project
Blockscad.Msg.SAVE_PROMPT = 'Do you want to save your project?';
/// save prompt button SAVE: button the user presses to indicate that yes, they want to save their project
Blockscad.Msg.SAVE_PROMPT_YES = 'Save';
/// save prompt button Don't Save: button the user presses to indicate that they do not want to save their project
Blockscad.Msg.SAVE_PROMPT_NO = 'Don"t Save';
/// Reset Password: The Reset Password dialog title and button to reset the user's password if they forgot it.
Blockscad.Msg.RESET_PASSWORD = 'Reset Password';
/// Or: when resetting a password, the user needs to provide a username OR password, but not both.  
Blockscad.Msg.DIALOG_OR = 'or';
/// Reset Password Instructions: instruct the user to enter their username or email and they will be sent an email with instructions for resetting their password.
Blockscad.Msg.RESET_PASSWORD_INSTRUCTIONS = 'Enter your username or your email and we will send you an email with instructions to reset your password.';
/// Reset Password send link: this button will send a link to the user's email that will allow them to reset their password.
Blockscad.Msg.RESET_PASSWORD_LINK_BUTTON = 'Send me a link to reset my password!';

// Render Window Text
/// Render button text
Blockscad.Msg.RENDER_BUTTON = 'Render';
/// Abort button text - button used to cancel rendering
Blockscad.Msg.ABORT_BUTTON = 'Abort!';
/// Generate button text for exporting mesh files (.stl, .x3d, .amf)
Blockscad.Msg.GENERATE_STL = 'Generate';
/// Rendering in progress informational text
Blockscad.Msg.RENDER_IN_PROGRESS = 'Rendering...';
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
/// Across - for mirroring a shape 'across' a plane
Blockscad.Msg.ACROSS = 'across';
/// Along - for tapering a shape 'along' an axis
Blockscad.Msg.ALONG = 'along';
/// Axis - line of rotation in 3D space
Blockscad.Msg.AXIS = 'axis';
/// Advanced rotation: applies a rotation around a vector specified by the user.  Needs to differentiate the block from the basic rotation block.
Blockscad.Msg.ROTATE_ADVANCED = 'fancy rotate';
/// Advanced mirror: applies a reflection across a plane whose normal vector is specified by the user.  Needs to differentiate the block from the basic mirror block.
Blockscad.Msg.MIRROR_ADVANCED = 'fancy mirror';
/// Around: for rotation 'around' a specified axis
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
/// Twist: as a shape is rotated upward, it can be gradually 'twist'ed (turned, rotated) ending up with a partial corkscrew or helix type of shape.
Blockscad.Msg.TWIST = 'twist';
/// STL Import: this is a block that, when clicked, allows the user to upload an STL file (a 3D shape) from their local computer into their project.
Blockscad.Msg.IMPORT_STL = 'STL import';
/// Browse: button that, when pressed, allows the user to pick out the file they want to upload from all the choices in a directory.
Blockscad.Msg.BROWSE = 'browse';
/// Center: indicates where the center coordinates of an imported .stl file are
Blockscad.Msg.CENTER = 'center';
/// Text 2D: title for a block that models text two-dimensionally (flat letters, numbers, etc.) 
Blockscad.Msg.BLOCK_TEXT_2D = '2D text'; 
/// Text 3D: title for a block that models text three-dimensionally (solid letters, numbers, etc.) 
Blockscad.Msg.BLOCK_TEXT_3D = '3D text'; 
/// Font size: word to indicate how large or small the letters should be printed
Blockscad.Msg.FONT_SIZE = 'size';
/// Font: the style that the letters are written in
Blockscad.Msg.FONT_NAME = 'font';
/// Thickness: when letters are printed on the XY plane, 'thickness' is how high the letter model is in the Z direction. 
Blockscad.Msg.TEXT_THICKNESS = 'thickness';
/// Default Text:  the default text in a text block.  English uses the first three letters of the alphabet.
Blockscad.Msg.TEXT_DEFAULT_VALUE = 'abc';
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
/// Procedures: Blocks for defining [https://en.wikipedia.org/wiki/Procedure_(computer_science) functions].  OpenSCAD refers to their functions/procedures as 'modules', so that is the choice in English.
Blockscad.Msg.CATEGORY_PROCEDURES = 'Modules';

// reset view directions in render window
// I hope to have icons for these soon but until then...
/// button to reset the view in the render window
Blockscad.Msg.RESET_VIEW_BUTTON = 'Reset View';
/// view direction: diagonal
Blockscad.Msg.DIRECTION_DIAGONAL = 'diagonal';
/// view direction: front 
Blockscad.Msg.DIRECTION_FRONT = 'front';
/// view direction: top
Blockscad.Msg.DIRECTION_TOP = 'top';
/// view direction: right
Blockscad.Msg.DIRECTION_RIGHT = 'right';
/// view direction: left
Blockscad.Msg.DIRECTION_LEFT = 'left';
/// view direction: back
Blockscad.Msg.DIRECTION_BACK = 'back';
/// view direction: bottom
Blockscad.Msg.DIRECTION_BOTTOM = 'bottom';
// Errors in login and registration forms
/// Error message: user has tried to change their password to match their username, which is not allowed.
Blockscad.Msg.ERROR_PASSWORD_IS_USERNAME = 'Your password cannot match your username!';
/// Error message: password is too short.  it must be at least six characters long.
Blockscad.Msg.ERROR_PASSWORD_LENGTH = 'Your password must be at least 6 characters long.';
/// Error message: password is not allowed to be the word 'password'
Blockscad.Msg.ERROR_PASSWORD_IS_PASSWORD = 'Your password cannot be the word "password".';
/// Error message: password field was left empty.  Indicate to the user that they should choose a password that is at least six characters long.
Blockscad.Msg.ERROR_PASSWORD_IS_EMPTY = 'Please choose a password at least 6 characters long.';
/// Error message: user has entered two passwords to register and they don't match.  Tell them to make their second password match the first.
Blockscad.Msg.ERROR_PASSWORD_CONFIRM = 'Your second password must match the first password.';
/// Error message: user has not provided a legal email address (must be of the form x@y.z)
Blockscad.Msg.ERROR_EMAIL_IS_INVALID = 'You must provide a valid email address.';
/// Error message: user has left the email field blank, but it is required.  Ask them to enter their email address.
Blockscad.Msg.ERROR_EMAIL_IS_EMPTY = 'Please enter an email address.';
/// Error message: user has left the username field blank during registration.  Ask them to choose a username.
Blockscad.Msg.ERROR_USERNAME_IS_EMPTY = 'Please choose a username.';
/// Error message: user has chosen a username that is too short.  Tell them that their username must be between 3 and 30 characters.
Blockscad.Msg.ERROR_USERNAME_LENGTH = 'Username must be between 3 and 30 characters.';
/// Error message: username is only allowed to contain letters, numbers, the '-' and '_' symbols.
Blockscad.Msg.ERROR_USERNAME_CHARACTERS = 'Your username may only contain letters, numbers, -, and _';
/// Error message: user has chosen a username that is already in use.  Inform them of this.
Blockscad.Msg.ERROR_USERNAME_EXISTS = 'Sorry, that username already exists.';
/// Error message: login failed.  Let the user know that either their username or their password was incorrect.
Blockscad.Msg.ERROR_LOGIN_FAILED = 'Incorrect username or password.';
/// Error message: when changing their password, the user has incorrectly typed in their original password.  Tell them to try again.
Blockscad.Msg.ERROR_BAD_PASSWORD = 'Incorrect password - please retype your original password.';
/// Error message: when resetting a password, if a user enters a username that the system cannot find, it sends this message:
Blockscad.Msg.ERROR_MISSING_USERNAME = 'We can"t find this username.';
/// Error message: when resetting a password, if a user enters an email that the system cannot find, it sends this message:
Blockscad.Msg.ERROR_MISSING_EMAIL = 'We can"t find this email address.';


// Text on the "My Projects" page of the backend.
/// New Project Button: button to create a new project
Blockscad.Msg.NEW_PROJECT_BUTTON = 'New Project';
/// Back to Workspace button: this button returns the user to the editing view, where they can edit the project they were editing before they pulled up the project list
Blockscad.Msg.PROJECT_LIST_EXIT = 'Exit List';
/// Filter: text in the search box that allows the user to filter their listed projects by name.  This text should be short because it needs to fit in the search box.
Blockscad.Msg.PROJECT_LIST_FILTER = 'Filter';
/// Last Modified: column header in the project list indicating the last time the project was saved by the user
Blockscad.Msg.PROJECT_LIST_LAST_MODIFIED = 'Last Modified';
/// Delete Project: Button next to each project in the project list that allows the user to delete that project.
Blockscad.Msg.PROJECT_LIST_DELETE_BUTTON = 'Delete';
/// More: the project list fetches saved projects from the server in batches.  If there are more projects that haven't been retrieved, the "more" button appears to indicate that more projects are available from the server
Blockscad.Msg.PROJECT_LIST_MORE_BUTTON = 'More';


//Mouseover text
/// Undo: mouseover text for undo button
Blockscad.Msg.MOUSEOVER_UNDO = 'Undo';
/// Redo: mouseover text for Redo button
Blockscad.Msg.MOUSEOVER_REDO = 'Redo';
/// Delete all blocks: mouseover text for trash can icon, which deletes all blocks on the workspace.
Blockscad.Msg.MOUSEOVER_TRASHCAN = 'Delete all blocks';
/// Delete all blocks message box: ask user if they want to delete some number of blocks
Blockscad.Msg.DISCARD_ALL = 'Delete all %1 blocks?';
/// Toggle display of X, Y, Z axes in the render window
Blockscad.Msg.AXES_BUTTON = 'Toggle axes display';
/// Set default color of rendered meshes button
Blockscad.Msg.DEFAULT_COLOR_BUTTON = 'Set default render color';
/// Zoom in button for render window
Blockscad.Msg.ZOOM_IN_BUTTON = 'Zoom in';
/// Zoom out button for render window
Blockscad.Msg.ZOOM_OUT_BUTTON = 'Zoom out';
/// Reset zoom and view to default diagonal view
Blockscad.Msg.ZOOM_RESET_BUTTON = 'Reset view';

// Parsing/Rendering error messages
/// Warning: STL file block needs to re-load.  Blockscad doesn't store STL files along with projects.  When a project is loaded that had an STL file, BlocksCAD prompts the user to re-load the STL file.
Blockscad.Msg.WARNING_RELOAD_STL = 'Warning: re-load your STL file block';
/// Rendering error heading: this message precedes all other error messages and indicates that an error was found.
Blockscad.Msg.ERROR_MESSAGE = 'Error';
/// Rendering error: there are no shapes in the code to render.
Blockscad.Msg.RENDER_ERROR_EMPTY = 'Nothing to Render';
/// Rendering error: user has both 2-dimensional shapes (that have not been extruded) and 3-dimensional shapes in the same code, which the rendering engine cannot handle.
Blockscad.Msg.RENDER_ERROR_MIXED = 'Both 2D and 3D objects are present.  There can be only one.';
/// Parsing error: blocks are missing fields.  Some fields are required (you must have a value for the radius of a sphere, for example): this error alerts the user that some number of blocks are missing fields.  %1 will be replaced by the actual number.
Blockscad.Msg.PARSING_ERROR_MISSING_FIELDS = '%1 blocks are missing fields.';
/// Parsing error: a block has an illegal value - for example, giving a negative radius to a sphere.  The %1 will be replaced by the actual number.
Blockscad.Msg.PARSING_ERROR_ILLEGAL_VALUE = '%1 blocks have an illegal value (negative or zero)';

// Block tooltips
/// Tooltip for the sphere block: Creates a sphere with the specified radius.
/// to translate the image, make a folder for it in the imgs folder an copy the english images there.  Then either edit the images with an SVG editor like Inkscape, or (not as good) you can use a text editor and search for the "text" tags and replace it.
Blockscad.Msg.SPHERE_TOOLTIP = '<img src="imgs/en/sphere.svg" width="65">';
/// Tooltip for the cube block: Creates a rectangular prism with specified dimensions x, y, and z. A non-centered cube has one corner at the origin.
/// to translate the image, make a folder for it in the imgs folder an copy the english images there.  Then either edit the images with an SVG editor like Inkscape, or (not as good) you can use a text editor and search for the "text" tags and replace it.
Blockscad.Msg.CUBE_TOOLTIP = '<img src="imgs/en/cube.svg" width="100px">';
/// Tooltip for the cylinder block.  Creates a cylinder with a specified bottom radius, top radius, and height. It may optionally be centered along the Z-axis.
/// to translate the image, make a folder for it in the imgs folder an copy the english images there.  Then either edit the images with an SVG editor like Inkscape, or (not as good) you can use a text editor and search for the "text" tags and replace it.
// Blockscad.Msg.CYLINDER_TOOLTIP = '<object type="image/svg+xml" data="imgs/en/cylinder.svg" width="90px"></object>';
Blockscad.Msg.CYLINDER_TOOLTIP = '<img src="imgs/en/cylinder.svg" width="90px">';
/// Tooltip for the torus block. Creates a torus with a ring of specified distance on-center from the origin (radius1), with a specified radius (radius2), a specified number of sides and faces.
/// to translate the image, make a folder for it in the imgs folder an copy the english images there.  Then either edit the images with an SVG editor like Inkscape, or (not as good) you can use a text editor and search for the "text" tags and replace it.
Blockscad.Msg.TORUS_TOOLTIP = '<img src="imgs/en/torus.svg" width="250px">';
/// tooltip for the 2D circle block: Creates a circle with the specified radius.
/// to translate the image, make a folder for it in the imgs folder an copy the english images there.  Then either edit the images with an SVG editor like Inkscape, or (not as good) you can use a text editor and search for the "text" tags and replace it.
Blockscad.Msg.CIRCLE_TOOLTIP = '<img src="imgs/en/circle.svg" width="65">';
/// tooltip for the 2D square block: Creates a rectangle of specified dimensions x and y. It may optionally be centered around the origin.
/// to translate the image, make a folder for it in the imgs folder an copy the english images there.  Then either edit the images with an SVG editor like Inkscape, or (not as good) you can use a text editor and search for the "text" tags and replace it.
Blockscad.Msg.SQUARE_TOOLTIP = '<img src="imgs/en/square.svg" width="65">';
/// tooltip for transform: translate.  'Translates (moves) one or more objects in specified dimensions x, y, and z.'
Blockscad.Msg.TRANSLATE_TOOLTIP = 'Translates (moves) one or more objects in specified dimensions x, y, and z.';
/// tooltip for transform: rotate (simple).  'Rotates one or more objects around specified axes x, y, and z.
Blockscad.Msg.SIMPLEROTATE_TOOLTIP = 'Rotates one or more objects around specified axes x, y, and z.';
/// tooltip for mirror (choice of three planes): 'Mirrors one or more objects across a specified plane.''
Blockscad.Msg.SIMPLEMIRROR_TOOLTIP = 'Mirrors one or more objects across a specified plane.';
/// tooltip for transform: scale. 'Scales one or more objects by a specified amount in dimensions x, y, and z.'
Blockscad.Msg.SCALE_TOOLTIP = 'Scales one or more objects by a specified amount in dimensions x, y, and z.';
/// tooltip for transform: color (pick from list). 'Applies the color to the child object, which must be 3D.''
Blockscad.Msg.COLOR_TOOLTIP = 'Applies the color to the child object, which must be 3D.';
/// tooltip for transform 'color_rgb': 'Apply a color by specifying the red, blue, and green components.  Each value should be between 0 and 100.'
Blockscad.Msg.COLOR_RGB_TOOLTIP = 'Apply a color by specifying the red, blue, and green components.  Each value should be between 0 and 100.';
/// tooltip for transform 'color_hsv': 'Apply a color by specifying the hue, saturation, and value components.  Each value should be between 0 and 100.'
Blockscad.Msg.COLOR_HSV_TOOLTIP = 'Apply a color by specifying the hue, saturation, and value components.  Each value should be between 0 and 100.';
/// tooltip for transform 'sides': 'Sets the number of sides used for approximating arcs (in the sphere, cylinder, circle, and torus).'
Blockscad.Msg.FN_TOOLTIP = 'Sets the number of sides used for approximating arcs (in the sphere, cylinder, circle, and torus).';
/// tooltip for transform 'taper': 'Scales shape along an axis.  The smallest value along the select axis is scaled at one, and the largest value is scaled at user input scale value.'
Blockscad.Msg.TAPER_TOOLTIP = 'Scales shape along an axis.  The smallest value along the select axis is scaled at one, and the largest value is scaled at user input scale value.';
/// tooltip for transform 'linear extrude': 'Extrudes one or more 2-dimensional objects by a specified height with a specified twist. Shape can be scaled as it extrudes in both x and y. It may optionally be centered around the origin.'
Blockscad.Msg.LINEAREXTRUDE_TOOLTIP = 'Extrudes one or more 2-dimensional objects by a specified height with a specified twist. Shape can be scaled as it extrudes in both x and y. It may optionally be centered around the origin.';
/// tooltip for transform 'rotate extrude': 'Rotate extrudes one or more 2-dimensional objects around the Z axis with a specified number of sides.'
Blockscad.Msg.ROTATEEXTRUDE_TOOLTIP = 'Rotate extrudes one or more 2-dimensional objects around the Z axis with a specified number of sides.';
/// tooltip for transform 'fancy rotate': 'Rotates one or more objects around a vector from the origin (0,0,0) to the point (x,y,z)'
Blockscad.Msg.FANCYROTATE_TOOLTIP = 'Rotates one or more objects around a vector from the origin (0,0,0) to the point (x,y,z)';
/// tooltip for transform 'fancy mirror': 'Mirrors one or more objects across specified plane whose normal vector is from (0,0,0) to the point (x,y,z).'
Blockscad.Msg.FANCYMIRROR_TOOLTIP = 'Mirrors one or more objects across specified plane whose normal vector is from (0,0,0) to the point (x,y,z).';
/// tooltip for set operation 'union': 'Combines two or more objects into one.'
Blockscad.Msg.UNION_TOOLTIP = 'Combines two or more objects into one.';
/// tooltip for set operation 'difference': 'Subtracts one or more objects from the first object in the list.'
Blockscad.Msg.DIFFERENCE_TOOLTIP = 'Subtracts one or more objects from the first object in the list.';
/// tooltip for set operation 'intersection': Returns the intersection (area that overlaps) of two or more objects.
Blockscad.Msg.INTERSECTION_TOOLTIP = 'Returns the intersection (area that overlaps) of two or more objects.';
/// tooltip for set operation 'convex hull':  'Combines one or more objects by "wrapping" them together in a hull.'
Blockscad.Msg.HULL_TOOLTIP = 'Combines one or more objects by "wrapping" them together in a hull.';
/// tooltip for 2D Text: 'A 2D rendering of text with a given size and font'
Blockscad.Msg.BS_TEXT_TOOLTIP = 'A 2D rendering of text with a given size and font';
/// tooltip for 3D Text: 'A 3D rendering of text with a given size and font, and thickness'
Blockscad.Msg.BS_3DTEXT_TOOLTIP = 'A 3D rendering of text with a given size and font, and thickness';
/// tooltip for chain-hulling within a loop: 'Return the convex hull of each shape in the loop with the next shape'
Blockscad.Msg.CONTROLS_FOR_TOOLTIP_CHAINHULL = 'Return the convex hull of each shape in the loop with the next shape';  

/// warning for blocks that do not produce compatible openSCAD code: 'Not compatible with OpenSCAD'
Blockscad.Msg.NOT_COMPATIBLE_WITH_OPENSCAD = 'Not compatible with OpenSCAD';
/// warning that the contents of .stl files are not saved with the rest of a project - don't delete the .stl! : 'STL files are not saved with your blocks.'
Blockscad.Msg.STL_IMPORT_WARNING = 'STL files are not saved with your blocks.';

/// context menu on main workspace: 'Disable All Blocks' to prevent all blocks from rendering (this is the inverse to ENABLE_ALL)
Blockscad.Msg.DISABLE_ALL = 'Disable All Blocks';
/// context menu on main workspace: 'Enable All Blocks' to make blocks able to render again - (this is the inverse to DISABLE_ALL)
Blockscad.Msg.ENABLE_ALL = 'Enable All Blocks';
/// context menu for variables and procedures: user can highlight all instances of a function (both definition and calling instance).
/// "%1" will be replaced with the user-created name of the variable or module.
Blockscad.Msg.HIGHLIGHT_INSTANCES = 'Highlight "%1" Instances';
/// context menu for main workspace: 'Remove highlighting' of all blocks that were highlighted due to error checking or user highlighting
Blockscad.Msg.REMOVE_HIGHLIGHTING_INSTANCES = 'Remove highlighting';
/// context menu for a single block: 'Remove block highlighting' for that particular block.
Blockscad.Msg.REMOVE_BLOCK_HIGHLIGHTING = 'Remove block highlighting';
/// error message: you cannot mix 2D and 3D shapes in the same model.  If you create a module that is 3D, and use it in code combined with other 3D shapes, 
/// and then change the module definition to be a 2D shape, the module instances will be disconnected from other places in the code where they exist (as well as highlighted).
/// this is the warning message put on the module definition block.  'calling blocks were displaced: 2D and 3D shapes cannot be together'
Blockscad.Msg.BLOCKS_BUMPED_OUT_DIMENSIONS = '%1 calling blocks were displaced: 2D and 3D shapes cannot be together';

/// error message: if a function which returns a value has that value in a place where one type is expected (numbers vs booleans),
/// the function caller will get bumped out and the function block will display a warning message:
/// '%1 calling blocks were displaced: type mismatch between numbers and Booleans'
Blockscad.Msg.BLOCKS_BUMPED_OUT_TYPES = '%1 calling blocks were displaced: type mismatch between %2 and %3';
/// error message: if a variable definition changes type (from a number to a true/false to a string), there may be instances of that variable that now have 
/// an illegal type.  They are disconnected from their positions in the code and highlighted, and the variable definition displays a warning message:
/// %1 variable blocks were displaced due to type mismatches
Blockscad.Msg.VARIABLES_BUMPED_ONE = '%1 variable blocks were displaced due to type mismatches';
/// error message: the second half of VARIABLES_BUMPED_ONE, this message notifies the user how the type of the variable changed.
/// "%1" is replaced by the user's name for the variable, "%2" is replaced with the old variable type, and "%3" is replaced with the new variable type
Blockscad.Msg.VARIABLES_BUMPED_TWO = 'variable "%1": type changed from %2 to %3';

// example project names
/// example project which is a cube "frame" - the centers of all the faces are cut away.
Blockscad.Msg.EXAMPLE_CUBE_WITH_CUTOUTS = 'cube with cutouts';
/// example project that is a model of an anthias fish (a small tropical reef fish)
Blockscad.Msg.EXAMPLE_ANTHIAS_FISH = 'anthias fish';
/// example project that uses variables to set the length, height, depth, and wall thickness.  By changing the variables any sized box can be made.
Blockscad.Msg.EXAMPLE_PARAMETRIC_BOX = 'any size box';
/// example project that creates a 'star shape' or 'sun shape' by using a loop block
Blockscad.Msg.EXAMPLE_LOOP_SUN = 'sun made with loop';
/// example project that creates a sine wave using a loop block
Blockscad.Msg.EXAMPLE_LOOP_SINE = 'sine function with loop';
/// example project that creates a trefoil knot (3-lobed knot) by plotting parametric equations
Blockscad.Msg.EXAMPLE_PARAMETRIC_EQ_KNOT = 'knot from parametric equations';

 



