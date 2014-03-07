UF.ui.define('leaf', {
    tpl: '<li class="ufui-leaf" data-path="<%=path%>">' +
        '   <div class="ufui-leaf-detail ufui-leaf-detail-closed">' +
        '       <div class="ufui-leaf-expand"></div>' +
        '       <div class="ufui-leaf-folder"><i class="ufui-leaf-folder-<%=type%>"></i></div>' +
        '       <div class="ufui-leaf-title"><%=title%></div>' +
        '   </div>' +
        '   <ul class="ufui-tree-branch ufui-tree-branch-closed"></ul>' +
        '</li>',
    defaultOpt: {
        type: 'dir',
        title: '',
        path: '/',
        pers: 'wr'
    },
    init: function (options) {
        var me = this;
        options.path = Utils.regularDirPath(options.path);
        me.root($($.parseTmpl(me.tpl, options)));
        var $detail = me.$detail = me.root().children().eq(0);
        me.$branch = me.root().children().eq(1);

        /* 设置展开收起文件夹 */
        $detail.find('.ufui-leaf-expand').on('click', function () {
            if ($detail.hasClass('ufui-leaf-detail-opened')) {
                me.expand(false);
            } else {
                me.expand(true);
            }
        });

        return me;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    expand: function (state) {
        if (state) {
            this.$detail.removeClass('ufui-leaf-detail-closed').addClass('ufui-leaf-detail-opened');
            this.$branch.removeClass('ufui-tree-branch-closed').addClass('ufui-tree-branch-opened');
        } else {
            this.$detail.removeClass('ufui-leaf-detail-opened').addClass('ufui-leaf-detail-closed');
            this.$branch.removeClass('ufui-tree-branch-opened').addClass('ufui-tree-branch-closed');
        }
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
    setPath: function (path) {
        this.root().attr('data-path', Utils.regularDirPath(path));
        return this;
    },
    getPath: function () {
        return this.root().attr('data-path');
    },
    setType: function (type) {
        this.$detail.find('.ufui-leaf-folder i').attr('class', 'ufui-leaf-folder-' + type);
        return this;
    },
    getType: function () {
        var c = this.$detail.find('.ufui-leaf-folder i'),
            m = c.attr('class').match(/ufui-leaf-folder-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setTitle: function (title) {
        this.$detail.find('.ufui-leaf-title').text(title);
        return this;
    },
    getTitle: function () {
        return this.$detail.find('.ufui-leaf-title').text();
    },
    addChild: function (ufLeaf) {
        var children = this.$branch.children();
        for (var i = 0; i < children.length; i++) {
            if (this._compare($(children[i]).ufui(), ufLeaf)) break;
        }
        if (i == 0) {
            this.$branch.prepend(ufLeaf.root());
        } else {
            $(children[i - 1]).after(ufLeaf.root());
        }
        this.expand(true);
        return this;
    },
    removeChild: function ($leaf) {
        $leaf.remove();
        return this;
    },
    getChildren: function () {
        return this.$branch.children();
    }
});