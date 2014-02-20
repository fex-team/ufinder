UF.registerModule("mkdirmodule", function () {
    var uf = this;
    return {
        "init": function(){

        },
        "defaultOptions": {
        },
        "commands": {
            "mkdir": {
                execute: function (name) {
                    if(name === undefined) {
                        name = prompt('新建文件夹', '新建文件夹');
                    } else if (name == '') {
                        name = '新建文件夹';
                    }

                    if(name) {
                        uf.proxy.mkdir(uf.getCurrentPath() + name, function(d){
                            if(d.state == 0) {
                                var file = (d && d.data && d.data.file);
                                uf.dataTree.addFile(file);
                                uf.fire('mkdir', file);
                            } else {
                                uf.fire('showmessage', {title: d.message});
                            }
                        });
                    }
                },
                queryState: function () {
                    var file, path = uf.getCurrentPath();
                    file = uf.dataTree.getFileByPath(path);
                    return file && file.getAttr('write') && !file.locked ? 0:-1;
                }
            }
        },
        "shortcutKeys": {
            "newfile": "ctrl+78" //newfile ctrl+N
        },
        "events": {
        }
    }
});