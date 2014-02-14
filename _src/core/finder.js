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