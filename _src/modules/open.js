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
                    var paths, file;
                    paths = uf.getSelection().getSelectedFiles();

                    if(paths.length == 1) {
                        file = uf.dataTree.getFileByPath(paths[0]);
                        return file && file.getAttr('read') && !file.locked ? 0:-1;
                    } else {
                        return -1;
                    }
                }
            }
        },
        "events": {
        }
    }
});