UF.registerModule("selectallmodule", function () {
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
                        filelist = uf.dataTree.listDirFile(current),
                        paths = [];

                    $.each(filelist, function(k, v){
                        paths.push(v.path);
                    });
                    uf.fire('selectfiles', paths);
                },
                queryState: function () {
                }
            }
        },
        "shortcutKeys": {
            "selectall": "ctrl+65" //selectAll ctrl+A
        },
        "events": {
        }
    }
});