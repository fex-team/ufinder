UF.ui.define('tree', {
    tpl: '<div class="ufui-tree"  ></div>',
    defaultOpt: {
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
        this.root().toggleClass('ufui-active', state)

        return this;
    },
    setData: function(filelist){
        var $ul = $('<ul class="ufui-tree-container"></ul>');
        for(var i in filelist) {
            if(filelist[i].type == 'dir') {
                $ul.append($('<li data-path="' + filelist[i].path + '" class="ufui-tree-item">').text(filelist[i].path));
            }
        }
        this.root().html('').append($ul);
    }
});