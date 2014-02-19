UF.registerModule("renamemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {
        },
        "commands": {
            "rename": {
                execute: function (name) {
                    if(!name) return;
//                    var file = selection.getSelectedFile();
//                    uf.proxy.rename(target, name, function(){
//                    });
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