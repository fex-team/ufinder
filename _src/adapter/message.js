UF.registerUI('message',
    function(name) {
        var me = this;
        var $message = $.ufuimessage();

        me.on('showmessage', function(type, options){
            $message.show();
        });

        me.on('hidemessage', function(type, options){
            $message.hide();
        });

        return $message;
    }
);
