UF.extendClass(Finder, {
    _initSelection: function(){
        this._selectedFiles = [];
    },
    //提供接口给command获取选区实例
    getSelection: function(){
        return new Selection(this);
    },
    //提供接口给adapter获取选区实例
    setSelectedFiles: function(paths){
        this._selectedFiles = $.isArray(paths) ? paths:[paths];
    }
});