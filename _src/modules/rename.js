UF.registerModule("renamemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {
        },
        "commands": {
            "rename": {
                execute: function (name) {
//                    var file = selection.getSelectedFile();
                    uf.proxy.rename(name, function(){
                    });
                },
                queryState: function () {
                    return 0;
                }
            }
        },
        "shortcutKeys": {
            "rename": "113" //rename F2
        },
        "events": {
        }
    };
});