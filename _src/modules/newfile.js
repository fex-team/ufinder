UF.registerModule("newfilemodule", function () {
    var uf = this;
    return {
        "init": function(){

        },
        "defaultOptions": {
        },
        "commands": {
            "newfile": {
                execute: function (name) {
                    uf.proxy.touch(name, function(){
                    });
                },
                queryState: function () {
                    return 0;
                }
            },
            "shortcutKeys": {
                "newfile": "ctrl+78" //newfile ctrl+N
            },
            "events": {
            }
        }
    }
});