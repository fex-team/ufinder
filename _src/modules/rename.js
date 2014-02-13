Ufinder.registerModule("renamemodule", function () {
    var uf = this;
    return {
        "commands": {
            "rename": UF.createClass("renameCommand", {
                base: Command,
                execute: function () {
                },
                queryState: function () {
                    return 0;
                }
            })
        },
        "addShortcutKeys": {
            "rename": "113" //rename F2
        },
        "events": {
        }
    };
});