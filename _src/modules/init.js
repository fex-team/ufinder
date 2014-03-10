UF.registerModule("initmodule", function () {
    var uf = this;
    return {
        "init": function () {

        },
        "commands": {
            "init": {
                execute: function () {
                    uf.proxy.init(function (r) {
                        uf.dataTree.setRoot(r.data.root);
                    });
                }
            }
        },
        "events": {
            'ready': function () {
                uf.execCommand('init');
            },
            'dataReady': function () {
                uf.execCommand('open', '/');
            }
        }
    };
});