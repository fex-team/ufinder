UF.registerUI('message',
    function (name, options) {
        var me = this,
            $message = $.ufuimessage(options),
            request = options.request;

        if(request) {
            $message.find('.ufui-message-loadbar').on('click', function(){
                request.pause();
            });
        }
        return $message;
    }
);
