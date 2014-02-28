UF.ui.define('tree', {
    tpl: '<div class="ufui-tree">' +
        '<ul class="ufui-tree-branch ufui-tree-branch-closed"></ul>' +
        '</div>',
    defaultOpt: {
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options)));
        me.$branch = me.root().find('.ufui-tree-branch');

        me._ufItems = {};

        return me;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled')
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover')
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active')
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    _regularDirPath: function (path) {
        return path.replace(/([^\/])$/, '$1/').replace(/^([^\/])/, '/$1');
    },
    _getParentPath: function (path) {
        return path.replace(/[^\/]+\/?$/, '');
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
        } else {
            return title1 > title2;
        }
    },
    getItem: function (path) {
        return this._ufItems[this._regularDirPath(path)];
    },
    getItems: function () {
        return this._ufItems;
    },
    addItem: function (options) {
        var i, path = options.path,
            $l = $.ufuileaf(options),
            ufLeaf = $l.ufui(),
            $parent = this.getItem(this._getParentPath(path));

        if(!this._ufItems[path]) {
            if ($parent) {
                $parent.addChild($l);
            } else {
                this.$branch.append($l);
            }
            this._ufItems[path] = ufLeaf;
        }

        return this;
    },
    removeItem: function (path) {
        for (var i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (c.getPath() == path) {
                this._ufItems.splice(i, 1);
                c.root().remove();
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
    isItemInTree: function (path) {
        return this.getItem(path) ? true : false;
    }
});