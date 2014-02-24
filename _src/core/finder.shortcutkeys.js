UF.extendClass(Finder, {
    _initShortcutKey: function () {
        this._shortcutkeys = {};
    },
    addShortcutKeys: function (cmd, keys) {
        var obj = {};
        if (keys) {
            obj[ cmd ] = keys
        } else {
            obj = cmd;
        }
        $.extend(this._shortcutkeys, obj)
    },
    _bindshortcutKeys: function () {
        var me = this,
            shortcutkeys = me._shortcutkeys,
            container = me.$container[0],
            doc = container && container.ownerDocument;

        if (doc) {
            $(doc.body).on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;

                for (var i in shortcutkeys) {
                    var tmp = shortcutkeys[ i ].split(',');
                    for (var t = 0, ti; ti = tmp[ t++ ];) {
                        ti = ti.split(':');
                        var key = ti[ 0 ],
                            param = ti[ 1 ];
                        if (/^(ctrl)(\+shift)?\+(\d+)$/.test(key.toLowerCase()) || /^(\d+)$/.test(key)) {
                            if (( ( RegExp.$1 == 'ctrl' ? ( e.ctrlKey || e.metaKey ) : 0 ) && ( RegExp.$2 != "" ? e[ RegExp.$2.slice(1) + "Key" ] : 1 ) && keyCode == RegExp.$3 ) ||
                                keyCode == RegExp.$1
                                ) {

                                if (me.queryCommandState(i, param) != -1)
                                    me.execCommand(i, param);
                                e.preventDefault();
                            }
                        }
                    }
                }
            });
        }
    }
});
