var Finder = UF.Finder = UF.createClass('Finder', {
    constructor: function (options) {
        this._options = $.extend(window.UFINDER_CONFIG || {}, options);
        this.setDefaultOptions(UF.defaultOptions);
        this._initEvents();
        this._initSelection();
        this._initFinder();
        this._initShortcutKey();
        this._initModules();

        this.fire('ready');
    },
    _initFinder: function () {
        this.dataTree = new DataTree(this);
        this.proxy = new Proxy(this);
        this.setCurrentPath('/');
    },
    getCurrentPath: function () {
        return this._currentPath;
    },
    setCurrentPath: function (path) {
        path.charAt(0) != '/' && (path = '/' + path);
        path.charAt(path.length - 1) != '/' && (path = path + '/');
        this._currentPath = path;
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
    getLang: function (path) {
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
    },
    addShortcutKeys: function (cmd, keys) {
        var obj = {};
        if (keys) {
            obj[ cmd ] = keys
        } else {
            obj = cmd;
        }
        $.extend(this._shortcutkeys, obj)
    },
    _bindshortcutKeys: function () {
        var me = this,
            shortcutkeys = me._shortcutkeys,
            container = me.$container[0],
            doc = container && container.ownerDocument;

        if (doc) {
            $(doc.body).on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;

                for (var i in shortcutkeys) {
                    var tmp = shortcutkeys[ i ].split(',');
                    for (var t = 0, ti; ti = tmp[ t++ ];) {
                        ti = ti.split(':');
                        var key = ti[ 0 ],
                            param = ti[ 1 ];
                        if (/^(ctrl)(\+shift)?\+(\d+)$/.test(key.toLowerCase()) || /^(\d+)$/.test(key)) {
                            if (( ( RegExp.$1 == 'ctrl' ? ( e.ctrlKey || e.metaKey ) : 0 ) && ( RegExp.$2 != "" ? e[ RegExp.$2.slice(1) + "Key" ] : 1 ) && keyCode == RegExp.$3 ) ||
                                keyCode == RegExp.$1
                                ) {

                                if (me.queryCommandState(i, param) != -1)
                                    me.execCommand(i, param);
                                e.preventDefault();
                            }
                        }
                    }
                }
            });
        }
    }
});