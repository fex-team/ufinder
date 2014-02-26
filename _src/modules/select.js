UF.registerModule("selectmodule", function () {
    var uf = this;
    return {
        "init": function(){

        },
        "defaultOptions": {
        },
        "commands": {
            "selectall": {
                execute: function (name) {
                    var current = uf.getCurrentPath(),
                        filelist = uf.dataTree.listDirFileInfo(current),
                        paths = [];

                    $.each(filelist, function(k, v){
                        paths.push(v.path);
                    });
                    uf.fire('selectfiles', paths);
                },
                queryState: function () {
                }
            },
            "selectnext": {
                execute: function (name) {
                    uf.fire('selectfiles', paths);
                },
                queryState: function () {
                }
            },
            "selectprevious": {
                execute: function (name) {
                    uf.fire('selectfiles', paths);
                },
                queryState: function () {
                }
            }
        },
        "shortcutKeys": {
            "selectall": "ctrl+65", //selectAll ctrl+A
            "selectup": "37", //selectAll ctrl+up
            "selectprevious": "38", //selectAll ctrl+left
            "selectnext": "39", //selectAll ctrl+right
            "selectdown": "40" //selectAll ctrl+down
        },
        "events": {
        }
    }
});