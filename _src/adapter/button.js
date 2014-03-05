UF.registerUI('open touch mkdir rename remove',
    function (name) {
        var me = this;
        var $btn = $.ufuibutton({
            icon: name,
            click: function () {
                me.execCommand(name);
            },
            title: me.getLang('labelMap')[name] || ''
        });

        me.on('selectionchange ready focus blur currentpathchange', function () {
            var state = me.queryCommandState(name);
            $btn.ufui().disabled(state == -1).active(state == 1)
        });
        return $btn;
    }
);

