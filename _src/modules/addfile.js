UF.registerModule("addfilemodule", function () {
    var uf = this;
    return {
        "init": function () {

        },
        "defaultOptions": {
        },
        "commands": {
            "touch": {
                execute: function (name) {
                    if (name === undefined) {
                        name = prompt('新建文件', '新建文件');
                    } else if (name == '') {
                        name = '新建文件';
                    }

                    if (name) {
                        uf.proxy.touch(uf.getCurrentPath() + name, function (d) {
                            if (d.state == 0) {
                                var file = (d && d.data && d.data.file);
                                uf.dataTree.addFile(file);
                                uf.fire('selectfiles', file.path);
                            } else {
                                uf.fire('showmessage', {title: d.message, timeout: 3000});
                            }
                        });
                    }
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            },
            "mkdir": {
                execute: function (name) {
                    if (name === undefined) {
                        name = prompt('新建文件夹', '新建文件夹');
                    } else if (name == '') {
                        name = '新建文件夹';
                    }

                    if (name) {
                        uf.proxy.mkdir(uf.getCurrentPath() + name, function (d) {
                            if (d.state == 0) {
                                var file = (d && d.data && d.data.file);
                                uf.dataTree.addFile(file);
                                uf.fire('selectfiles', file.path);
                            } else {
                                uf.fire('showmessage', {title: d.message, timeout: 3000});
                            }
                        });
                    }
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            }
        },
        "shortcutKeys": {
            "touch": "ctrl+78" //newfile ctrl+N
        },
        "events": {
        }
    }
});