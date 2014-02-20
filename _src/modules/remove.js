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
                                uf.dataTree.unlockFile();
                                uf.fire('removefiles', paths);
                            } else {
                                uf.fire('showmessage', {title: d.message});
                            }
                        });
                    }
                },
                queryState: function () {
                    var paths = uf.getSelection().getSelectedFiles();

                    if(paths.length > 0) {
                        $.each(paths, function(k, v){
                            var file = uf.dataTree.getFileByPath(v);
                            if(file && file.getAttr('write') && !file.locked) {
                                return -1;
                            }
                        });
                        return 0;
                    } else {
                        return -1;
                    }
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