UF.registerModule("pathchangemodule", function () {
    var uf = this;
    return {
        "init": function () {
            uf._pathHistory = [];
            uf._pathHistoryIndex = 0;
        },
        "commands": {
            "pathparent": {
                execute: function () {
                    var path = uf.getCurrentPath(),
                        parentPath = Utils.getParentPath(path);
                    uf.setCurrentPath(parentPath);
                },
                queryState: function () {
                    return uf.getCurrentPath().length > 2 ? 0 : -1;
                }
            },
            "pathbackward": {
                execute: function () {
                    if (uf._pathHistoryIndex > 0) {
                        uf.setCurrentPath(uf._pathHistory[uf._pathHistoryIndex--]);
                    }
                },
                queryState: function () {
                    return uf._pathHistoryIndex > 1 ? 0 : -1;
                }
            },
            "pathforward": {
                execute: function () {

                },
                queryState: function () {
                    return uf._pathHistory.length > (uf._pathHistoryIndex + 1) ? 0 : -1;
                }
            }
        },
        "events": {
            'currentPathChange': function (type, path) {
                uf._pathHistory.splice(uf._pathHistoryIndex, uf._pathHistory.length, path);
            }
        }
    };
});