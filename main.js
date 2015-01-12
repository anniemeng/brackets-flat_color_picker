define(function (require, exports, module) {
    "use strict";

    var AppInit = brackets.getModule('utils/AppInit'),
        CommandManager = brackets.getModule("command/CommandManager"),
        Menus  = brackets.getModule("command/Menus"),
        EditorManager = brackets.getModule("editor/EditorManager"),
        KeyEvent = brackets.getModule("utils/KeyEvent");
        
    var CMD_ID = "flatcolorpicker";

    // gets word
    var parseLine = function (line, cursorPosition) {
        var words;
        line = line.substring(0, cursorPosition);
        //split the line in "words" made of alphanumeric char or underscores (a-zA-Z0-9 and _)
        words = line.split(/\W/);
        return words[words.length - 1];
    };
    
    // TAB trigger
    var keyEventHandler = function ($event, editor, event) {
        if ((event.type === "keydown") && (event.keyCode === KeyEvent.DOM_VK_TAB)) {
            triggerFlat();
            event.preventDefault();
        }
    };

    // register different editors
    var activeEditorChangeHandler = function ($event, focusedEditor, lostEditor) {
        if (lostEditor) {
            $(lostEditor).off("keydown", keyEventHandler);
        }

        if (focusedEditor) {
            $(focusedEditor).on("keydown", keyEventHandler);
        }
    };
    
        
    // trigger function that executes flatify
    var triggerFlat = function () {
        var editor = EditorManager.getCurrentFullEditor();
        var cursorPosition,
            line,
            snippetKey,
            start;

        cursorPosition = editor.getCursorPos();
        line = editor.document.getLine(cursorPosition.line);
        snippetKey = parseLine(line, cursorPosition.ch);
        if (snippetKey === "flat") {
            start = {
                line: cursorPosition.line,
                ch: cursorPosition.ch - snippetKey.length
            };
            editor.document.replaceRange("INSERT FLAT HERE", start, cursorPosition);
        } 
    };
    
    AppInit.appReady(function () {
        var currentEditor = EditorManager.getCurrentFullEditor();
        
        // command on help menu and keystroke
        var helpMenu = Menus.getMenu(Menus.AppMenuBar.HELP_MENU);
        CommandManager.register("Flatify", CMD_ID, triggerFlat);
        helpMenu.addMenuItem(CMD_ID, "Alt-F");
        
        // trigger editor
        $(currentEditor).on('keydown', keyEventHandler);
        $(EditorManager).on('activeEditorChange', activeEditorChangeHandler);
    });
});
