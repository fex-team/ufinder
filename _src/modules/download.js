UF.registerModule("downloadmodule", function () {
    var uf = this;
    return {
        "commands": {
            "download": {
                execute: function (path) {
                    uf.fire('selectFiles', path);
                    var downloadUrl = uf.proxy.getRequestUrl({
                        'cmd': 'download',
                        'target': path
                    });
                    var $downloadIframe = $('<iframe src="' + downloadUrl + '">').hide().appendTo(document.body).load(function(){
                        setTimeout(function(){
                            $downloadIframe.remove();
                        }, 3000);
                    });
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile(),
                        info = uf.dataTree.getFileInfo(path);
                    return info && info.type != 'dir' ? 0 : -1;
                }
            }
        }
    };
});