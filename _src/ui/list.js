UF.ui.define('list', {
    tpl: '<div class="ufui-list">' +
        '<div class="ufui-list-container"></div>' +
        '</div>',
    defaultOpt: {
        sort: 'title'
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options))).append(me.$list);
        me.$list = me.root().find('.ufui-list-container');

        me._ufItems = [];

        return me;
    },
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else if (type1 != type2) {
            return type1 > type2;
        } else {
            return title1 > title2;
        }
    },
    getItem: function (path) {
        for (i = 0; i < this._ufItems.length; i++) {
            if (this._ufItems[i].getPath() == path) return this._ufItems[i];
        }
        return null;
    },
    getItems: function () {
        return this._ufItems;
    },
    addItem: function (options) {
        var i, $f = $.ufuifile(options), ufFile = $f.ufui();
        for (i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (this._compare(c, ufFile)) break;
        }

        if (i >= this._ufItems.length) {
            this.$list.append($f);
        } else {
            $f.insertBefore(this._ufItems[i].root());
        }
        this._ufItems.splice(i, 0, ufFile);

        return this;
    },
    removeItem: function (path, fadeOutTime) {
        for (var i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (c.getPath() == path) {
                this._ufItems.splice(i, 1);
                if (fadeOutTime) {
                    c.active(false).root().fadeOut(fadeOutTime || 0, function () {
                        $(this).remove();
                    });
                } else {
                    c.root().remove();
                }
                break;
            }
        }
        return this;
    },
    clearItems: function () {
        $.each(this._ufItems, function (k, f) {
            f.root().remove();
        });
        this._ufItems = [];
        return this;
    },
    isItemInList: function (path) {
        return this.getItem(path) ? true : false;
    }
});