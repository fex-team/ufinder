UF.registerUI('upload',
    function (name) {
        var me = this,
            id = 'ufui-btn-upload-' + (+new Date()).toString(36),
            $btn = $.ufuibutton({
                icon: name,
                click: function () {

                },
                title: me.getLang('labelMap')[name] || ''
            });

        /* 按钮状态反射 */
        me.on('selectionchange ready focus blur currentpathchange', function () {
            var state = me.queryCommandState(name);
            $btn.ufui().disabled(state == -1).active(state == 1);
            if (me.webuploader) {
                state == -1 ? me.webuploader.disable() : me.webuploader.enable();
            }
        });

        $btn.attr('id', id);
        /* 绑定按钮到uploader */
        me.on('initUploader', function () {
            me.webuploader.addButton({
                id: '#' + id
            });
        });
        return $btn;
    }
);