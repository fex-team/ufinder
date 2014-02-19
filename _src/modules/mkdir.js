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
                        name = prompt('新建文件夹', '新建文件夹')
                    } else if (name == '') {
                        name = '新建文件夹';
                    }
                    uf.proxy.mkdir(uf.currentPath + name, function(d){
                        if(d.state == 0) {
                            var file = (d && d.data && d.data.file);
                            uf.dataTree.addFile(file);
                            uf.fire('mkdir', file);
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