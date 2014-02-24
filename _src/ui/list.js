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

        me._files = [];

        return me;
    },
    _compare: function(a, b){
        var uia = a.ufui(),
            uib = b.ufui(),
            type1 = uia.getType(),
            type2 = uib.getType(),
            title1 = uia.getTitle(),
            title2 = uib.getTitle();

        if(type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if(type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else {
            return title1 > title2;
        }
    },
    getFile: function(path){
        for(i = 0; i < this._files.length; i++){
            if(this._files[i].path == path) return this._files[i];
        }
        return null;
    },
    getItems: function(){
        return this._files;
    },
    addItem: function(options){
        var i, f = $.ufuifile(options);
        for(i = 0; i < this._files.length; i++){
            var c = this._files[i];
            if(this._compare(c, f)) break;
        }

        if(i >= this._files.length){
            this.$list.append(f);
        } else {
            f.insertBefore(this._files[i]);
        }
        this._files.splice(i, 0, f);

        return this;
    },
    removeItem: function(path){
        for(var i = 0; i < this._files.length; i++){
            var c = this._files[i];
            if(c.ufui().getPath() == path) {
                c.remove();
                this._files.splice(i, 1);
                break;
            }
        }
        return this;
    },
    clearItems: function(){
        $.each(this._files, function(k, $v){
            $v.remove();
        });
        this._files = [];
        return this;
    }
});