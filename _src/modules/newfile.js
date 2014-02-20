UF.registerModule("newfilemodule", function () {
    var uf = this;
    return {
        "init": function(){

        },
        "defaultOptions": {
        },
        "commands": {
            "newfile": {
                execute: function (name) {
                    if(name === undefined) {
                        name = prompt('新建文件', '新建文件');
                    } else if (name == '') {
                        name = '新建文件';
                    }
                    uf.proxy.touch(uf.currentPath + name, function(d){
                        if(d.state == 0) {
                            var file = (d && d.data && d.data.file);
                            uf.dataTree.addFile(file);
                            uf.fire('newfile', file);
                        }
                    });
                },
                queryState: function () {
                    return 0;
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