UF.registerModule("uploadmodule", function () {
    var uf = this,
        webUploader;
    return {
        "init": function(){
            uf.on('ready', function(){
                webUploader = WebUploader.create({

                    // swf文件路径
                    swf: BASE_URL + '/js/Uploader.swf',

                    // 文件接收服务端。
                    server: './server/fileupload.php',

                    // 选择文件的按钮。可选。
                    // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                    pick: '#picker',

                    // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                    resize: false
                });


                uf.$container.find('.ufui-btn-upload').each(function(){

                });
            })
        },
        "defaultOptions": {
        },
        "commands": {
            "upload": {
                execute: function (path) {

                },
                queryState: function () {

                }
            }
        },
        "events": {
        }
    }
});