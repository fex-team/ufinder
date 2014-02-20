UF.registerModule("renamemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {
        },
        "commands": {
            "rename": {
                execute: function () {
                    var name,
                        fullname,
                        target = uf.getSelection().getSelectedFile();

                    if(target) {
                        name = prompt('重命名', target.replace(/^.*\//,''));
                        fullname = uf.getCurrentPath() + name;
                        if(name && target != fullname) {
                            uf.proxy.rename(target, fullname, function(d){
                                if(d.state == 0) {
                                    var file = (d && d.data && d.data.file);
                                    uf.dataTree.removeFile(target);
                                    uf.dataTree.addFile(file);
                                    uf.fire('renamefile', target, file);
                                } else {
                                    uf.fire('showmessage', {title: d.message});
                                }
                            });
                        }
                    }
                },
                queryState: function () {
                    var paths, file;
                    paths = uf.getSelection().getSelectedFiles();

                    if(paths.length == 1) {
                        file = uf.dataTree.getFileByPath(paths[0]);
                        return file && file.getAttr('write') && !file.locked ? 0:-1;
                    } else {
                        return -1;
                    }
                }
            }
        },
        "shortcutKeys": {
            "rename": "13" //rename F2
        },
        "events": {
        }
    };
});