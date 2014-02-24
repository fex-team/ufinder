UF.ui.define('tree', {
    tpl: '<div class="ufui-tree">' +
        '<ul class="ufui-tree-branch ufui-tree-branch-closed"></ul>' +
        '</div>',
    defaultOpt: {
    },
    init: function (options) {
        var me = this;
        me.root( $($.parseTmpl(me.tpl, options)) );

        me._ufLeaves = {};

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
    getLeaf: function(path){
        for(i = 0; i < this._ufLeaves.length; i++){
            if(this._ufLeaves[i].getPath() == path) return this._ufLeaves[i];
        }
        return null;
    },
    getLeaves: function(){
        return this._ufLeaves;
    },
    addLeaf: function($leaf){
        var path = $leaf.ufui().getPath(),
            $parent = this.getLeaf(path.replace(/[^\/]+\/?$/, ''));

        if(this.getLeaf(path)) return;
        if($parent) {
            $parent.ufui().addChild($leaf);
        } else {
            this.root().children().eq(0).append($leaf);
        }
    },
    removeLeaf: function(path){
        this.getLeaf(path).remove();
    },
    isLeafInTree: function(path){
        return this.getLeaf(path) ? true:false;
    }
});