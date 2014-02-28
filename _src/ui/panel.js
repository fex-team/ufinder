UF.ui.define('panel', {
    tpl: '<div class="ufui-panel"  ></div>',
    defaultOpt: {
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        return me;
    }
});