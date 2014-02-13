var File = UFinder.File = UF.createClass( "File", {
    constructor: function(){
        this._info = {};
    },
    setData: function(){
        this._info = {};
    },
    getData: function(info){
        return this._info;
    },
    setAttribute: function(key, value){
        this._info[key] = value;
    },
    getAttribute: function(key){
        return this._info[key];
    },
    lock: function(){

    },
    unlock: function(){

    },
    setDisable: function(){

    },
    setEnable: function(){

    }
});