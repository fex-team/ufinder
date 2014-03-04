var FileNode = UF.FileNode = UF.createClass("FileNode", {
    constructor: function (info) {
        this.info = {};
        this.parent = null;
        this.locked = false;
        this.children = [];
        this.setInfo(info);
    },
    setInfo: function (info) {
        var me = this,
            attrs = [
                'path', 'name', 'type', 'read', 'write', 'time', 'mode', 'size'
            ];
        $.each(attrs, function (i, attr) {
            info[attr] && me.setAttr(attr, info[attr]);
        });
        this._regularDirPath();
    },
    _regularDirPath: function () {
        var path = this.info['path'].replace(/^([^\/])/, '/$1');
        if (this.getAttr('type') == 'dir') {
            this.info['path'] = path.replace(/([^\/])$/, '$1/');
        } else {
            this.info['path'] = path.replace(/([^\/])$/, '$1');
        }
    },
    getInfo: function () {
        return this.info;
    },
    setAttr: function (key, value) {
        this.info[key] = value;
        this._regularDirPath();
    },
    getAttr: function (key) {
        return this.info[key];
    },
    addChild: function (file) {
        file.parent = this;
        this.children.push(file);
    },
    remove: function () {
        this.parent && this.parent.removeChild(this);
    },
    removeChild: function (file) {
        file.parent = this;
        this.children.pop(file);
    },
    getChild: function (filename) {
        for (var key in this.children) {
            if (this.children[key].getAttr('name') == filename) {
                return this.children[key];
            }
        }
        return null;
    },
    lock: function () {
        this.locked = true;
    },
    unLock: function () {
        this.locked = false;
    }
});