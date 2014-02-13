Ufinder.registerModule("renamemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {
        },
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
        "shortcutKeys": {
            "rename": "113" //rename F2
        },
        "events": {
        }
    };
});