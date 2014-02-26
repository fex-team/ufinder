UF.ui.define('tree', {
    tpl: '<div class="ufui-tree">' +
        '<ul class="ufui-tree-branch ufui-tree-branch-closed"></ul>' +
        '</div>',
    defaultOpt: {
    },
    init: function (options) {
        var me = this;
        me.root( $($.parseTmpl(me.tpl, options)) );

        me._ufItems = [];

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
    _regularDirPath: function(path){
        return path.replace(/([^\/])$/, '$1/').replace(/^([^\/])/, '/$1');
    },
    getItem: function(path){
        for(i = 0; i < this._ufItems.length; i++){
            if(this._ufItems[i].getPath() == path) return this._ufItems[i];
        }
        return null;
    },
    getItems: function(){
        return this._ufItems;
    },
    addItem: function(options){
        var i, $f = $.ufuifile(options), ufFile = $f.ufui();
        for(i = 0; i < this._ufItems.length; i++){
            var c = this._ufItems[i];
            if(this._compare(c, ufFile)) break;
        }

        if(i >= this._ufItems.length){
            this.$list.append($f);
        } else {
            $f.insertBefore(this._ufItems[i].root());
        }
        this._ufItems.splice(i, 0, ufFile);

        return this;
    },
    removeItem: function(path){
        for(var i = 0; i < this._ufItems.length; i++){
            var c = this._ufItems[i];
            if(c.getPath() == path) {
                this._ufItems.splice(i, 1);
                c.root().remove();
                break;
            }
        }
        return this;
    },
    clearItems: function(){
        $.each(this._ufItems, function(k, f){
            f.root().remove();
        });
        this._ufItems = [];
        return this;
    },
    isItemInTree: function(path){
        return this.getItem(path) ? true:false;
    }
});