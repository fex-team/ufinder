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
        pers: 'wr',
        onRenameFinish: function () {

        }
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));

        return me;
    }
}, 'file');