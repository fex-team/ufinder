UF.registerUI('open newfile mkdir rename remove',
    function(name) {
        var me = this;
        var $btn = $.ufuibutton({
            icon : name,
            click : function(){
                me.execCommand(name);
            },
            title: this.getLang('labelMap')[name] || ''
        });

        this.on('selectionchange',function(){
            var state = this.queryCommandState(name);
            $btn.ufui().disabled(state == -1).active(state == 1)
        });
        return $btn;
    }
);

