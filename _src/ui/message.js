UF.ui.define('file', {
    tpl: '<div class="ufui-file" data-path="<%=path%>">' +
        '<div class="ufui-file-icon"><i class="ufui-file-icon-<%=type%>"></i></div>' +
        '<div class="ufui-file-title"><%=title%></div>' +
        '</div>',
    defaultOpt: {
        type: '',
        title: '',
        path: ''
    },
    init: function (options) {
        var me = this;
        me.root( $($.parseTmpl(me.tpl, options)) );
        return me;
    },
    show: function(){
        this.root().fadeIn();
    },
    hide: function(){
        this.root().fadeOut();
    },
    setMessage: function(){
        this.root().fadeOut();
    }
});