var Request = UF.Request = UF.createClass("Request", (function () {
    var maxIndex = 0;

    return {
        constructor: function (data, callback) {
            this.id = maxIndex++;
            this.data = data;
            this.callback = callback;
            this.jqXhr = null;
            this.webUploader = null;
            this.type = data.type;
        },
        send: function () {
            var me = this;
            me.jqXhr = $.ajax(me.data).always(function (r) {
                console.log(r);
                var data;
                try{
                    data = JSON ? JSON.parse(r):eval(r);
                } catch(e) {
                    data = r;
                }
                me.callback && me.callback(data);
            });
        },
        abort: function(){
            this.jqXhr && this.jqXhr.abort();
        },
        callback: function(){

        }
    }
})());