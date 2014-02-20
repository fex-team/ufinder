UF.registerModule("renamemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {
        },
        "commands": {
            "rename": {
                execute: function (name) {
                    if(name === undefined) {
                        name = prompt('重命名文件', '重命名');
                    } else if (name == '') {
                        name = '新建文件';
                    }
                    var target = uf.getSelection().getSelectedFile();
                    uf.proxy.rename(target, uf.currentPath + name, function(d){
                        if(d.state == 0) {
                            var file = (d && d.data && d.data.file);
                            uf.dataTree.removeFile(target);
                            uf.dataTree.addFile(file);
                            uf.fire('renamefile', target, file);
                        }
                    });
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