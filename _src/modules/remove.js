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
                        uf.dataTree.lockFiles(paths);
                        uf.proxy.rm(paths, function(d){
                            if(d.state == 0) {
                                uf.dataTree.unLockFiles(paths);
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
                        for(var k in paths) {
                            var file = uf.dataTree.getFileByPath(paths[k]);
                            if(file && file.getAttr('write') && !file.locked) {
                                return -1;
                            }
                        }
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