var Uploader = UF.Uploader = UF.createClass("Uploader", {
    constructor: function (data, callback) {
        this.id = 'r' + (+new Date()).toString(36);
        this.data = data;
        this.webuploader = data.webuploader;
        this.callback = callback;
        this.process = data.process;
        this.file = data.data.file;
        this._initEvents();
    },
    _initEvents: function () {
        var me = this, r,
            handler = function (file) {
                if(file.id == me.file.id) {
                    console.log(r);
                    try {
                        me.responseJson = JSON ? JSON.parse(r) : eval(r);
                    } catch (e) {
                        me.responseJson = null;
                    }
                    me.responseText = r;
                    me.webuploader.stop();
                    me.callback && me.callback(me.responseJson);
                    me.webuploader.off('uploadComplete', handler);
                }
            };

        me.webuploader.on('uploadProgress', function(file, percent){
            me.process && me.process(percent);
        });
        me.webuploader.on('uploadSuccess', function (file, ret) {
            r = ret._raw;
        });
        me.webuploader.on('uploadError', function (file, ret) {
            r = ret._raw;
        });
        me.webuploader.on('uploadComplete', handler);
    },
    send: function () {
        this.webuploader.option('formdata', {
            cmd: 'upload',
            target: this.data.data.target
        });
        this.webuploader.upload(this.file);
    },
    pause: function () {
        webuploader.stop();
    },
    cancel: function () {
        webuploader.stop(true);
    }
});