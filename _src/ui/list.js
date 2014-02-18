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
    addItem: function($item){
        this.$list.append($item);
    },
    removeItem: function($item){
        $item.remove();
    },
    clearItems: function(){
        this.$list.html('');
    }
});