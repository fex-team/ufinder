var FileNode = UF.FileNode = UF.createClass("FileNode", {
    constructor: function (data) {
        this.data = {};
        this.parent = null;
        this.locked = false;
        this.children = [];
        this.setData(data);
    },
    setData: function (data) {
        $.extend(this.data, data);
    },
    getData: function () {
        return this.data;
    },
    setAttr: function (key, value) {
        this.data[key] = value;
    },
    getAttr: function (key) {
        return this.data[key];
    },
    addChild: function (file) {
        file.parent = this;
        this.children.push(file);
    },
    removeChild: function (file) {
        file.parent = this;
        this.children.push(file);
    },
    getChild: function (filename) {
        for (var key in this.children) {
            if (this.children[key].name == filename) {
                return this.children[key];
            }
        }
        return null;
    },
    lock: function () {
        this.locked = true;
    },
    unlock: function () {
        this.locked = false;
    }
});