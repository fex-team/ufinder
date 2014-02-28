UF.ui.define('file', {
    tpl: '<div class="ufui-file ufui-file-<%=pers%>" data-path="<%=path%>">' +
        '<div class="ufui-file-icon">' +
        '   <i class="ufui-file-icon-<%=type%>"></i>' +
        '   <span class="ufui-file-pers"></span>' +
        '</div>' +
        '<div class="ufui-file-title"><%=title%></div>' +
        '</div>',
    defaultOpt: {
        type: '',
        title: '',
        path: '',
        pers: 'wr'
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));

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
    setTitle: function (title) {
        this.root().find('.ufui-file-title').text(title);
        return this;
    },
    getTitle: function () {
        return this.root().find('.ufui-file-title').text();
    },
    setType: function (type) {
        this.root().find('.ufui-file-icon i').attr('class', 'ufui-file-icon-' + type);
        return this;
    },
    getType: function () {
        var c = this.root().find('.ufui-file-icon i'),
            m = c.attr('class').match(/ufui-file-icon-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setPath: function (path) {
        this.root().attr('data-path', path);
        return this;
    },
    getPath: function () {
        return this.root().attr('data-path');
    },
    setPers: function (write, read) {
        this.root().addClass('ufui-file-' + (write ? 'w' : 'nw') + ('read' ? 'r' : 'nr'));
        return this;
    },
    getPers: function () {
        var $root = this.root(),
            write = $root.hasClass('ufui-file-w-r') || $root.hasClass('ufui-file-nw-r'),
            read = $root.hasClass('ufui-file-w-r') || $root.hasClass('ufui-file-w-nr');
        return {'write': write, 'read': read};
    }
});