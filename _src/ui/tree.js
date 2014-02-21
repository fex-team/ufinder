UF.ui.define('tree', {
    tpl: '<div class="ufui-tree">' +
        '<ul class="ufui-tree-branch ufui-tree-branch-closed"></ul>' +
        '</div>',
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
    },
    addLeaf: function($leaf){
        var path = $leaf.ufui().getPath(),
            $parent = this.getLeaf(path.replace(/\/[^\/]+\/?$/, ''));
        if($parent && $parent.length > 0) {
            $parent.ufui().addChild($leaf);
        } else {
            this.root().children().eq(0).append($leaf);
        }
    },
    removeLeaf: function(path){
        this.getLeaf(path).remove();
    },
    getLeaf: function(path){
        return this.root().find('[data-path="' + path + '"]');
    }
});