var DataTree = UF.DataTree = UF.createClass("DataTree", {
    constructor: function (finder) {
        this.finder = finder;
        this.root = null;
    },
    setRoot: function (data) {
        this.root = new FileNode(data);
        this.finder.fire('dataReady', data);
    },
    _getFileNode: function (path) {
        var current = this.root,
            pathArr = path.split('/');

        for (var i = 0; i < pathArr.length; i++) {
            var name = pathArr[i];
            if (name != '') {
                current = current.getChild(name);
            }
        }
        return current;
    },
    getFileInfo: function (path) {
        var info = this._getFileNode(path);
        return info ? info.getInfo() : null;
    },
    _addFile: function (data) {
        var current = this.root,
            pathArr = $.trim(data.path).replace(/(^\/)|(\/$)/g, '').split('/');

        for (var i = 0; i < pathArr.length - 1; i++) {
            var name = pathArr[i];
            if (name != '') {
                current = current.getChild(name);
            }
        }
        current && current.addChild(new FileNode(data));
    },
    addFile: function (data) {
        this._addFile(data);
        this.finder.fire('addFiles', data);
    },
    updateFile: function (path, data) {
        var file = this._getFileNode(path);
        if (file.path == path) {
            file.setInfo(data);
        } else {
            file.remove();
            this._addFile(data);
        }
        this.finder.fire('updateFile', path, data);
    },
    removeFile: function (path) {
        var file = this._getFileNode(path);
        file && file.remove();
        this.finder.fire('removeFiles', path);
    },
    addFiles: function (datas) {
        var me = this;
        $.each(datas, function (key, data) {
            me.addFile(data);
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
    listDirFileInfo: function (path) {
        var filelist = [],
            dir = this._getFileNode(path);
        $.each(dir.children, function (k, v) {
            filelist.push(v.getInfo());
        });
        return filelist;
    },
    isFileLocked: function (path) {
        return this._getFileNode(path).locked;
    }
});