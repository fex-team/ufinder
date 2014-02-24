UF.ui.define('list', {
    tpl: '<div class="ufui-list">' +
        '<div class="ufui-list-container"></div>' +
        '</div>',
    defaultOpt: {
        sort: 'title'
    },
    init: function (options) {
        var me = this;

        me.root( $($.parseTmpl(me.tpl, options)) ).append( me.$list );
        me.$list = me.root().find('.ufui-list-container');

        me._ufFiles = [];

        return me;
    },
    _compare: function(a, b){
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if(type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if(type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else {
            return title1 > title2;
        }
    },
    getItem: function(path){
        for(i = 0; i < this._ufFiles.length; i++){
            if(this._ufFiles[i].getPath() == path) return this._ufFiles[i];
        }
        return null;
    },
    getItems: function(){
        return this._ufFiles;
    },
    addItem: function(options){
        var i, $f = $.ufuifile(options), ufFile = $f.ufui();
        for(i = 0; i < this._ufFiles.length; i++){
            var c = this._ufFiles[i];
            if(this._compare(c, ufFile)) break;
        }

        if(i >= this._ufFiles.length){
            this.$list.append($f);
        } else {
            $f.insertBefore(this._ufFiles[i].root());
        }
        this._ufFiles.splice(i, 0, ufFile);

        return this;
    },
    removeItem: function(path){
        for(var i = 0; i < this._ufFiles.length; i++){
            var c = this._ufFiles[i];
            if(c.getPath() == path) {
                this._ufFiles.splice(i, 1);
                c.root().remove();
                break;
            }
        }
        return this;
    },
    clearItems: function(){
        $.each(this._ufFiles, function(k, f){
            f.root().remove();
        });
        this._ufFiles = [];
        return this;
    }
});