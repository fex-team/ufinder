var DataTree = UF.DataTree = UF.createClass("DataTree", {
    constructor: function (finder) {
        this.finder = finder;
        this.root = new FileNode({
            'path': '/',
            'name': 'root',
            'write': true,
            'read': true
        });
    },
    _getFileNode: function (path) {
        var current = this.root,
            pathArr = path.split('/');

        for (var i = 0; i < pathArr.length; i++) {
            var name = pathArr[i];
            if(name != '') {
                current = current.getChild(name);
            }
        }
        return current;
    },
    getFileInfo: function (path) {
        var info = this._getFileNode(path);
        return info ? info.getInfo():null;
    },
    addFile: function (data) {
        var current = this.root,
            pathArr = $.trim(data.path).replace(/(^\/)|(\/$)/g, '').split('/');

        for (var i = 0; i < pathArr.length - 1; i++) {
            var name = pathArr[i];
            if(name != '') {
                current = current.getChild(name);
            }
        }
        current && current.addChild(new FileNode(data));
    },
    updateFile: function (data) {
        var file = this._getFileNode(data.path);
        if (!file) {
            this.addFile(data);
        } else {
            file.setInfo(data);
        }
    },
    removeFile: function (path) {
        var file = this._getFileNode(path);
        file && file.remove();
    },
    addFiles: function (datas) {
        var me = this;
        $.each(datas, function (key, data) {
            me.addFile(data);
        });

    },
    updateFiles: function (datas) {
        var me = this;
        $.each(datas, function (key, data) {
            me.updateFile(data);
        });
    },
    removeFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.removeFile(path);
        });
    },
    lockFile: function (path) {
        var file = this._getFileNode(path);
        file && file.lock();
        this.finder.fire('lockfiles', [path]);
    },
    unLockFile: function (path) {
        var file = this._getFileNode(path);
        file && file.unLock();
        this.finder.fire('unlockfiles', [path]);
    },
    lockFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.lockFile(path);
        });
    },
    unLockFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.unLockFile(path);
        });
    },
    listDirFileInfo: function(path){
        var filelist = [],
            dir = this._getFileNode(path);
        $.each(dir.children, function(k, v){
            filelist.push(v.getInfo());
        });
        return filelist;
    },
    isFileLocked: function(path){
        return this._getFileNode(path).locked;
    }
});