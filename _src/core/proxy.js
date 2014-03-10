var Proxy = UF.Proxy = UF.createClass("Proxy", {
    constructor: function (finder) {
        this.finder = finder;
        this._queue = [];
        this.active = false;
        this.nextSendIndex = 0;
        this._url = finder.getOption('serverUrl');
    },
    'init': function (callback) {
        return this._get({
            'cmd': 'init'
        }, callback);
    },
    getRequestUrl: function(options){
        var url = this._url + '?';
        $.each(options || {}, function(k, v){
            url += (k + '=' + v + '&');
        });
        if(url.charAt(url.length - 1) == '&') url = url.substr(0, url.length - 1);
        if(url.charAt(url.length - 1) == '?') url = url.substr(0, url.length - 1);
        return url;
    },
    'ls': function (target, callback) {
        return this._get({
            'cmd': 'ls',
            'target': target
        }, callback);
    },
    'rename': function (target, name, callback) {
        return this._get({
            'cmd': 'rename',
            'target': target,
            'name': name
        }, callback);
    },
    'touch': function (target, callback) {
        return this._get({
            'cmd': 'touch',
            'target': target
        }, callback);
    },
    'mkdir': function (target, callback) {
        return this._get({
            'cmd': 'mkdir',
            'target': target
        }, callback);
    },
    'rm': function (target, callback) {
        return this._get({
            'cmd': 'rm',
            'target': target
        }, callback);
    },
    upload: function (target, file, callback) {
        return this._upload({
            'cmd': 'upload',
            'target': target,
            'file': file
        }, callback, file);
    },
    info: function (target, callback) {
        return this._get({
            'cmd': 'info',
            'target': target
        }, callback);
    },
    _get: function (data, callback) {
        return this._ajax('GET', data, callback);
    },
    _post: function (data, callback) {
        return this._ajax('POST', data, callback);
    },
    _upload: function (data, callback) {
        return this._ajax('UPLOAD', data, callback);
    },
    _ajax: function (type, data, callback) {
        var me = this,
            request,
            handler = function (d) {
                me._beforeRequestComplete(d, request);
                callback && callback(d, request);
                me._afterRequestComplete(d, request);
            };

        if (type == 'UPLOAD') {
            request = new Uploader({
                url: me._url,
                type: type,
                webuploader: me.finder.webuploader,
                data: data,
                process: function (p) {
                    me.finder.fire('updatemessage', {
                        loadedPercent: p,
                        request: request,
                        id: request.id
                    });
                }
            }, handler);
        } else {
            request = new Request({
                url: me._url,
                type: type,
                data: data
            }, handler);
        }

        me._pushRequest(request);
        me.finder.fire('showmessage', {
            icon: 'loading',
            title: data.cmd + ' loading...',
            loadedPercent: 100,
            request: request,
            id: request.id
        });

        return request;
    },
    _pushRequest: function (request) {
        this._queue.push(request);
        this._sendRequest();
    },
    _sendRequest: function () {
        if (!this.active && this.nextSendIndex < this._queue.length) {
            this.active = true;
            this._queue[this.nextSendIndex++].send();
        }
    },
    _beforeRequestComplete: function (d, request) {
        this.finder.fire('beforeRequestComplete', d, request);
        this.finder.fire('hidemessage', {id: request.id});
        this.active = false;
        this._sendRequest();
    },
    _afterRequestComplete: function (d, request) {
        this.finder.fire('afterRequestComplete', d, request);
    }
});