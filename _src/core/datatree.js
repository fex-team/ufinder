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
    addFile: function (data) {
        var current = this.root,
            pathArr = this._getPathArr(data.path);

        for (var i = 0; i < pathArr.length - 1; i++) {
            var name = pathArr[i];
            if(name != '') {
                current = current.getChild(name);
            }
        }
        current && current.addChild(new FileNode(data));
    },
    updateFile: function (data) {
        var file = this.getFileByPath(data.path);
        if (!file) {
            this.addFile(data);
        } else {
            file.setData(data);
        }
    },
    removeFile: function (path) {
        var file = this.getFileByPath(path);
        file && file.remove();
    },
    addFiles: function (datas) {
        var me = this;
        $.each(datas, function (key, data) {
            me.addFile(data);
        });

    },
    updateFiles: function (datas) {
        $.each(datas, function (key, data) {
            this.updateFile(data);
        });
    },
    removeFiles: function (paths) {
        $.each(paths, function (key, path) {
            this.removeFile(path);
        });
    },
    lockFile: function (path) {
        var file = this.getFileByPath(path);
        file && file.lock();
        this.finder.fire('lockfile', file.getData());
    },
    unLockFile: function (path) {
        var file = this.getFileByPath(path);
        file && file.unLock();
        this.finder.fire('unlockfile', file.getData());
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
    getFileByPath: function (path) {
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
    listDirFile: function(path){
        var filelist = [],
            dir = this.getFileByPath(path);
        $.each(dir.children, function(k, v){
            filelist.push(v.getData());
        });
        return filelist;
    },
    _getPathArr: function (path) {
        return $.trim(path).replace(/(^\/)|(\/$)/g, '').split('/');
    }
});