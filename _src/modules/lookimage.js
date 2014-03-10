UF.registerModule("lookimagemodule", function () {
    var uf = this;
    return {
        "commands": {
            "lookimage": {
                execute: function (path) {
                    uf.fire('selectFiles', path);
                    uf.$toolbar.find('.ufui-btn-lookimage').trigger('click');
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile();
                    return Utils.isImagePath(path) ? 0 : -1;
                }
            }
        }
    };
});