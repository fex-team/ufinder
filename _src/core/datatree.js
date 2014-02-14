var DataTree = UF.DataTree = UF.createClass("DataTree", {
    constructor: function (finder) {
        this.finder = finder;
        this.root = null;
    },
    addFile: function (data) {
        var file = this.root,
            pathArr = this._getPathArr(data.path);

        for (var i = 0; i < pathArr.length - 1; i++) {
            var name = pathArr[i];
            file = file.getChild(name);
            if (file == null) break;
        }
        file && file.addChild(new FileNode(data));
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
        $.each(datas, function (key, data) {
            this.addFile(data);
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
    getFileByPath: function (path) {
        var file = this.root,
            pathArr = this._getPathArr(path);

        for (var i = 0; i < pathArr.length; i++) {
            var name = pathArr[i];
            file = file.getChild(name);
            if (file == null) break;
        }
        return file;
    },
    _getPathArr: function (path) {
        return $.trim(path).replace(/(^\/)|(\/$)/g, '').split('/');
    }
});