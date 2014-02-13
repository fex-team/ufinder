var DataTree = UF.DataTree = UF.createClass("DataTree", {
    constructor: function (finder) {
        this.finder = finder;
        this._pathFileMap = {};
        this.root = new File({path: '/'});
        this.pushMap(this.root);
    },
    _addMapItem: function (file) {
        _filePathMap[file.path] = file;
    },
    _removeMapItem: function (file) {
        _filePathMap[file.path] = undefined;
    },
    updateFiles: function (files) {
        $.each(files, function (key, file) {
            _pathFileMap[file.path].setData(file);
            file.setData();
        });
    },
    removeFiles: function (files) {

    },
    addFile: function (file) {

    },
    removeFile: function (path) {
        var file = this.getFile(path);
        file.parent && file.parent.removeChild(file);
        this._removeMapItem(file);
    },
    updateFile: function (data) {
        var file = _pathFileMap[path];
        file.setDate(data);
    },
    getFile: function (path) {
        return _filePathMap[path];
    }
});