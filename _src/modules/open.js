UF.registerModule("openmodule", function () {
    var uf = this;
    return {
        "init": function(){

        },
        "defaultOptions": {
        },
        "commands": {
            "open": {
                execute: function (path, callback) {
                    uf.proxy.ls(path, function(r){
                        var json = JSON.parse(r),
                            files = (json && json.data && json.data.files) || [];

                        callback(files);
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