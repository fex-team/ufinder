var File = UF.File = UF.createClass("File", {
    constructor: function (data) {
        this.data = {};
        this.parent = null;
        this.root = null;
        this.locked = false;
        this.children = [];
        this.setData(data);
    },
    setData: function (data) {
        this.data = $.extend(this.data, data);
    },
    getData: function () {
        return this.data;
    },
    setAttribute: function (key, value) {
        this.data[key] = value;
    },
    getAttribute: function (key) {
        return this.data[key];
    },
    remove: function(){
        this.parent.removeChild(this);
    },
    addChild: function (file) {
        file.parent = this;
        file.root = parent.root;
        this.children.push(file);
    },
    removeChild: function (file) {
        file.parent = this;
        file.root = parent.root;
        this.children.push(file);
    },
    lock: function () {
        this.locked = true;
    },
    unlock: function () {
        this.locked = false;
    }
});