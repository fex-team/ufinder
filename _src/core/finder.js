var Finder = UF.Finder = UF.createClass('Finder', {
    constructor: function (options) {
        this._options = $.extend({}, window.UFINDER_CONFIG || {}, options);
        this.setDefaultOptions(UF.defaultOptions);
        this._initEvents();
        this._initSelection();
        this._initFinder();
        this._initShortcutKey();
        this._initModules();
        window.UFINDER_CONFIG = $.extend(this._options, window.UFINDER_CONFIG || {}, options);
        this.fire('finderready');
    },
    _initFinder: function () {
        this.dataTree = new DataTree(this);
        this.proxy = new Proxy(this);
        this.isFocused = false;
        this.serverOption = {
            realRootUrl: this.getOption('realUrl')
        };
        this.setCurrentPath('/');
    },
    getCurrentPath: function () {
        return this._currentPath;
    },
    setCurrentPath: function (path) {
        path.charAt(0) != '/' && (path = '/' + path);
        path.charAt(path.length - 1) != '/' && (path = path + '/');
        this._currentPath = path;
        this.fire('currentpathchange', this._currentPath);
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
        return this._options[key];
    },
    getLang: function (path) {
        var lang = UF.LANG[this.getOption('lang')];
        if (!lang) {
            throw new Error("not import language file");
        }
        path = (path || "").split(".");
        for (var i = 0, ci; ci = path[i++];) {
            lang = lang[ci];
            if (!lang)break;
        }
        return lang;
    },
    getRealPath: function (path) {
        return (this.serverOption.realRootUrl + path).replace(/([^:])\/\//g, '$1/');
    }
});