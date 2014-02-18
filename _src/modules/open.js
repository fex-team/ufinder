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

                    uf.proxy.ls(path, function(r){
                        var json = JSON.parse(r),
                            filelist = (json && json.data && json.data.files) || [];

                        uf.dataTree.addFiles(filelist);
                        uf.fire('listfile', uf.dataTree.listDirFile(path));
                    });
                },
                queryState: function () {
                    return 0;
                }
            },
            "events": {
            }
        }
    }
});