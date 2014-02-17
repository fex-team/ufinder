var Finder = UF.Finder = UF.createClass('Finder', {
    constructor: function (options) {
        this._options = $.extend( window.UFINDER_CONFIG || {}, options );
        this.setDefaultOptions(UF.defaultOptions);
        this._initEvents();
        this._initFinder();
        this._initShortcutKey();
        this._initModules();

        this.fire('ready');
    },
    _initFinder: function () {
        this.dataTree = new DataTree(this);
        this.selection = new Selection(this);
        this.proxy = new Proxy(this);
    },
    setDefaultOptions: function (key, val) {
        var obj = {};
        if (Utils.isString(key)) {
            obj[key] = val;
        } else {
            obj = key;
        }
        $.extend(this._options, obj, true);
    },
    getOption: function (key) {
        return this._options[ key ];
    },
    getLang:function(path){
        var lang = UF.LANG[this.getOption('lang')];
        if (!lang) {
            throw Error("not import language file");
        }
        path = (path || "").split(".");
        for (var i = 0, ci; ci = path[i++];) {
            lang = lang[ci];
            if (!lang)break;
        }
        return lang;
    },
    _initShortcutKey: function () {
        this._shortcutkeys = {};
        this._bindshortcutKeys();
    },
    addShortcutKeys: function ( cmd, keys ) {
        var obj = {};
        if ( keys ) {
            obj[ cmd ] = keys
        } else {
            obj = cmd;
        }
        $.extend( this._shortcutkeys, obj )
    },
    _bindshortcutKeys: function () {

    }
});