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
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled')
        }
        this.root().toggleClass('ufui-disabled', state);
        if(this.root().hasClass('ufui-disabled')){
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
    setTitle: function(title){
        this.root().find('.ufui-file-title').text(title);
    },
    getTitle: function(){
        this.root().find('.ufui-file-title').text(title);
    },
    setType: function(type){
        this.root().find('.ufui-file-icon i').removeClass().addClass('ufui-file-icon-' + type);
    },
    getType: function(){
        var c = this.root().find('.ufui-file-icon i'),
            m = c.match(/ufui-file-icon-([\w]+)(\s|$)/);
        return m ? m[1]:null;
    },
    setPath: function(path){
        this.root().attr('data-path', path);
    },
    getPath: function(){
        return this.root().attr('data-path');
    }
});