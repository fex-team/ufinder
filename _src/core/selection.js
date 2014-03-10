var Selection = UF.Selection = UF.createClass("Selection", {
    constructor: function (finder) {
        this.finder = finder;
        this._selectedFiles = finder._selectedFiles || [];
    },
    getSelectedFile: function () {
        return this._selectedFiles[0];
    },
    getSelectedFiles: function () {
        return this._selectedFiles;
    },
    removeSelectedFiles: function (paths) {
        var me = this;
        $.each($.isArray(paths) ? paths : [paths], function (i, p) {
            var index;
            if (( index = me._selectedFiles.indexOf(p) ) === -1) return;
            me._selectedFiles.splice(index, 1);
        });
    },
    removeAllSelectedFiles: function () {
        this._selectedFiles = [];
    },
    isFileSelected: function (path) {
        return this._selectedFiles.indexOf(path) !== -1;
    },
    select: function () {
        this.finder.fire('selectfiles', this._selectedFiles);
    }
});