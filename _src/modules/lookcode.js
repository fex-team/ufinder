UF.registerModule("lookcodemodule", function () {
    var uf = this;
    return {
        "commands": {
            "lookcode": {
                execute: function(path){
                    uf.fire('selectFiles', path);
                    uf.$toolbar.find('.ufui-btn-lookcode').trigger('click');
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile();
                    return Utils.isCodePath(path) ? 0:-1;
                }
            }
        }
    }
});