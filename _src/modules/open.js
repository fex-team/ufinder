UF.registerModule("openmodule", function () {
    var uf = this;
    return {
        "init": function(){

        },
        "defaultOptions": {
        },
        "commands": {
            "open": {
                execute: function (path) {
                    if(path === undefined) {
                        path = uf.getSelection().getSelectedFile();
                    } else if (path == "") {
                        path = "/";
                    }

                    var data = uf.dataTree.listDirFile(path),
                        openHandler = function(data) {
                        var filelist = (data && data.data && data.data.files) || [];
                        uf.dataTree.addFiles(filelist);
                        uf.fire('listfile', uf.dataTree.listDirFile(path));
                        uf.setCurrentPath(path);
                    };

                    if(data && data.length) {
                        openHandler(data);
                    } else {
                        uf.proxy.ls(path, openHandler);
                    }
                },
                queryState: function () {
                    return 0;
                }
            }
        },
        "events": {
        }
    }
});