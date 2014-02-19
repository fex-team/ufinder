UF.registerUI('message',
    function(name) {
        var me = this;
        var $message = $.ufuimessage();

        me.on('showmessage', function(type, filelist){
            $message.show();
        });

        me.on('hidemessage', function(type, filelist){
            $message.hide();
        });

        return $message;
    }
);
