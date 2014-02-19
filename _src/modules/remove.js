UF.registerModule("removemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {
        },
        "commands": {
            "remove": {
                execute: function () {
                    var paths = uf.getSelection().getSelectedFiles();
                    if(paths.length) {
                        uf.proxy.rm(paths, function(r){
                            if(r.state == 0) {
                                uf.fire('removefiles', paths);
                            } else {
                                uf.fire('showmessage', '删除失败',3000)
                            }
                        });
                    }
                },
                queryState: function () {
                    return 0;
                }
            }
        },
        "shortcutKeys": {
            "remove": "46" //remove Delete
        },
        "events": {
        }
    };
});