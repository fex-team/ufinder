var Proxy = UF.Proxy = UF.createClass("Proxy", {
    constructor: function (finder) {
        this.finder = finder;
        this._queue = [];
        this.active = false;
        this.nextSendIndex = 0;
        this._url = 'http://localhost/ufinder/server/ufinder.php';
    },
    ls: function (target, callback) {
        return this._get({
            'cmd': 'ls',
            'target': target
        }, callback);
    },
    rename: function (target, name, callback) {
        return this._get({
            'cmd': 'rename',
            'target': target,
            'name': name
        }, callback);
    },
    touch: function (target, callback) {
        return this._get({
            'cmd': 'touch',
            'target': target
        }, callback);
    },
    mkdir: function (target, callback) {
        return this._get({
            'cmd': 'mkdir',
            'target': target
        }, callback);
    },
    rm: function (target, callback) {
        return this._get({
            'cmd': 'rm',
            'target': target
        }, callback);
    },
    _get: function (data, callback) {
        return this._ajax('GET', data, callback);
    },
    _post: function (data, callback) {
        return this._ajax('GET', data, callback);
    },
    _upload: function (data, callback) {
        //TODO 上传文件
    },
    _ajax: function(type, data, callback){
        var me = this,
            request = new Request({
            url: this._url,
            type: type,
            data: data
        }, function(d){
            me._beforeRequestComplete(d, request);
            callback && callback(d, request);
            me._afterRequestComplete(d, request);
        });

        this._pushRequest(request);
        return request;
    },
    _pushRequest: function (request) {
        this._queue.push(request);
        this._sendRequest();
    },
    _sendRequest: function () {
        if(!this.active && this.nextSendIndex < this._queue.length) {
            this.active = true;
            this._queue[this.nextSendIndex++].send();
        }
    },
    _beforeRequestComplete: function(d, request){
        this.finder.fire('beforeRequestComplete', d, request);
        this.active = false;
        this._sendRequest();
    },
    _afterRequestComplete: function(d, request){
        this.finder.fire('afterRequestComplete', d, request);
        console.log(d);
    }
});