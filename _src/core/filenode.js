var FileNode = UF.FileNode = UF.createClass("FileNode", {
    constructor: function (data) {
        this.data = {};
        this.parent = null;
        this.locked = false;
        this.children = [];
        this.setData(data);
    },
    setData: function (data) {
        var me = this,
            attrs = [
                'path', 'name', 'type', 'read', 'write', 'time', 'mode', 'size'
            ];
        $.each(attrs, function(i, attr){
            data[attr] && me.setAttr(attr, data[attr]);
        });
    },
    _regularDirPath: function(){
        var path = this.getAttr('path').replace(/^([^\/])/, '/$1');
        if(this.getAttr('type') == 'dir') {
            this.setAttr('path', path.replace(/([^\/])$/, '$1/'));
        } else {
            this.setAttr('path', path.replace(/([^\/])$/, '$1/'));
        }
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