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

                    if (target) {
                        name = prompt('重命名', target.replace(/^.*\//, ''));
                        fullname = uf.getCurrentPath() + name;
                        if (name && target != fullname) {
                            uf.dataTree.lockFile(target);
                            var req = uf.proxy.rename(target, fullname, function (d) {
                                if (d.state == 0) {
                                    var file = (d && d.data && d.data.file);
                                    uf.dataTree.removeFile(target);
                                    uf.dataTree.addFile(file);
                                    uf.fire('renamefile', target, file);
                                } else {
                                    uf.fire('updatemessage', {title: d.message, timeout: 3000, id:req.id});
                                }
                                uf.dataTree.unLockFile(target);
                            });
                        }
                    }
                },
                queryState: function () {
                    var paths, info;
                    paths = uf.getSelection().getSelectedFiles();

                    if (paths.length == 1) {
                        info = uf.dataTree.getFileInfo(paths[0]);
                        return info && info.write && !uf.dataTree.isFileLocked(paths[0]) ? 0 : -1;
                    } else {
                        return -1;
                    }
                }
            }
        },
        "shortcutKeys": {
            "rename": browser.mac ? "13" : "113" //renamemac:Enter notmac: F2
        },
        "events": {
        }
    };
});