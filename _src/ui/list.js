UF.ui.define('list', {
    tpl: '<div class="ufui-list">' +
        '<div class="ufui-list-container"></div>' +
        '</div>',
    defaultOpt: {
    },
    init: function (options) {
        var me = this;

        me.root( $($.parseTmpl(me.tpl, options)) ).append( me.$list );
        me.$list = me.root().find('.ufui-list-container');

        return me;
    },
    getItem: function(path){
        return this.root().find('[data-path="' + path + '"]');
    },
    getItems: function(){
        return this.$list.children();
    },
    addItem: function($item){
        this.$list.append($item);
        return this;
    },
    removeItem: function(path){
        this.getItem(path).remove();
    },
    clearItems: function(){
        this.$list.html('');
        return this;
    }
});