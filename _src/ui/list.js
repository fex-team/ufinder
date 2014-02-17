//button 类
UF.ui.define('list', {
    tpl: '<div class="ufui-list"  ></div>',
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
        var $ul = $('<ul class="ufui-list-container"></ul>');
        for(var i in filelist) {
            var filetitle = filelist[i].name,
                filetype = filelist[i].type;
            $ul.append($('<li class="ufui-list-item">' +
                '<div class="ufui-list-icon"><i class="ufui-list-' + filetype + '"></i></div>' +
                '<div class="ufui-list-title">' + filetitle + '</div>' +
                '</li>'));
        }
        this.root().html('').append($ul);
    },
    addItem: function(){},
    updateItem: function(){},
    clearItems: function(){},
    itemClick: function(){}
});