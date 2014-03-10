UF.registerModule("openmodule", function () {
    var uf = this,
        listFile = function (path, isOpen) {

            if (path === undefined) {
                path = uf.getSelection().getSelectedFile();
            } else if (path == "") {
                path = "/";
            }

            var data = uf.dataTree.listDirFileInfo(path),
                openHandler = function (data) {
                    var filelist = (data && data.data && data.data.files) || [];
                    uf.dataTree.addFiles(filelist);
                    isOpen && uf.setCurrentPath(path);
                };

            if (data && data.length) {
                openHandler(data);
            } else {
                uf.proxy.ls(path, openHandler);
            }

        },
        queryState = function () {
            var paths, info;
            paths = uf.getSelection().getSelectedFiles();

            if (paths.length == 1) {
                info = uf.dataTree.getFileInfo(paths[0]);
                return info && info.read && !uf.dataTree.isFileLocked(paths[0]) ? 0 : -1;
            } else {
                return -1;
            }
        };

    return {
        "init": function () {

        },
        "defaultOptions": {
        },
        "commands": {
            "open": {
                execute: function (path) {

                    if (path === undefined) {
                        path = uf.getSelection().getSelectedFile();
                    } else if (path == "") {
                        path = "/";
                    }

                    listFile(path, true);
                },
                queryState: queryState
            },
            "list": {
                execute: function (path) {
                    listFile(path, false);
                },
                queryState: queryState
            }
        },
        "events": {

        }
    };
});