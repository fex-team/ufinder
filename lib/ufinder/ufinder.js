/*!
 * ====================================================
 * ufinder - v1.0.0 - 2014-04-14
 * https://github.com/fex-team/ufinder
 * GitHub: https://github.com/fex-team/ufinder.git 
 * Copyright (c) 2014 f-cube @ FEX; Licensed MIT
 * ====================================================
 */

(function($, window) {

var UFinder =
    window.UF =
        window.UFinder = function () {
            var instanceMap = {}, instanceId = 0;
            return {
                version: '1.0.0',
                createFinder: function (renderTarget, options) {
                    options = options || {};
                    options.renderTo = Utils.isString(renderTarget) ? document.getElementById(renderTarget) : renderTarget;
                    var finder = new Finder(options);
                    this.addFinder(options.renderTo, finder);
                    return finder;
                },
                addFinder: function (target, finder) {
                    var id;
                    if (typeof ( target ) === 'string') {
                        id = target;
                    } else {
                        id = target.id || ( "UF_INSTANCE_" + instanceId++ );
                    }
                    instanceMap[ id ] = finder;
                },
                getFinder: function (target, options) {
                    var id;
                    if (typeof ( target ) === 'string') {
                        id = target;
                    } else {
                        id = target.id || ( "UF_INSTANCE_" + instanceId++ );
                    }
                    return instanceMap[ id ] || this.createFinder(target, options);
                },
                //挂接多语言
                LANG: {}
            };
        }();

var browser = UF.browser = function () {
    var agent = navigator.userAgent.toLowerCase(),
        opera = window.opera,
        browser = {
            /**
             * 检测浏览器是否为IE
             * @name ie
             * @grammar UM.browser.ie  => true|false
             */
            ie: !!window.ActiveXObject,

            /**
             * 检测浏览器是否为Opera
             * @name opera
             * @grammar UM.browser.opera  => true|false
             */
            opera: ( !!opera && opera.version ),

            /**
             * 检测浏览器是否为webkit内核
             * @name webkit
             * @grammar UM.browser.webkit  => true|false
             */
            webkit: ( agent.indexOf(' applewebkit/') > -1 ),

            /**
             * 检测浏览器是否为mac系统下的浏览器
             * @name mac
             * @grammar UM.browser.mac  => true|false
             */
            mac: ( agent.indexOf('macintosh') > -1 ),

            /**
             * 检测浏览器是否处于怪异模式
             * @name quirks
             * @grammar UM.browser.quirks  => true|false
             */
            quirks: ( document.compatMode == 'BackCompat' )
        };
    /**
     * 检测浏览器是否处为gecko内核
     * @name gecko
     * @grammar UM.browser.gecko  => true|false
     */
    browser.gecko = ( navigator.product == 'Gecko' && !browser.webkit && !browser.opera );

    var version = 0;

    // Internet Explorer 6.0+
    if (browser.ie) {
        version = parseFloat(agent.match(/msie (\d+)/)[1]);
        /**
         * 检测浏览器是否为 IE9 模式
         * @name ie9Compat
         * @grammar UM.browser.ie9Compat  => true|false
         */
        browser.ie9Compat = document.documentMode == 9;
        /**
         * 检测浏览器是否为 IE8 浏览器
         * @name ie8
         * @grammar     UM.browser.ie8  => true|false
         */
        browser.ie8 = !!document.documentMode;

        /**
         * 检测浏览器是否为 IE8 模式
         * @name ie8Compat
         * @grammar     UM.browser.ie8Compat  => true|false
         */
        browser.ie8Compat = document.documentMode == 8;

        /**
         * 检测浏览器是否运行在 兼容IE7模式
         * @name ie7Compat
         * @grammar     UM.browser.ie7Compat  => true|false
         */
        browser.ie7Compat = ( ( version == 7 && !document.documentMode )
            || document.documentMode == 7 );

        /**
         * 检测浏览器是否IE6模式或怪异模式
         * @name ie6Compat
         * @grammar     UM.browser.ie6Compat  => true|false
         */
        browser.ie6Compat = ( version < 7 || browser.quirks );

        browser.ie9above = version > 8;

        browser.ie9below = version < 9;
    }

    // Gecko.
    if (browser.gecko) {
        var geckoRelease = agent.match(/rv:([\d\.]+)/);
        if (geckoRelease) {
            geckoRelease = geckoRelease[1].split('.');
            version = geckoRelease[0] * 10000 + ( geckoRelease[1] || 0 ) * 100 + ( geckoRelease[2] || 0 ) * 1;
        }
    }
    /**
     * 检测浏览器是否为chrome
     * @name chrome
     * @grammar     UM.browser.chrome  => true|false
     */
    if (/chrome\/(\d+\.\d)/i.test(agent)) {
        browser.chrome = +RegExp['\x241'];
    }
    /**
     * 检测浏览器是否为safari
     * @name safari
     * @grammar     UM.browser.safari  => true|false
     */
    if (/(\d+\.\d)?(?:\.\d)?\s+safari\/?(\d+\.\d+)?/i.test(agent) && !/chrome/i.test(agent)) {
        browser.safari = +(RegExp['\x241'] || RegExp['\x242']);
    }


    // Opera 9.50+
    if (browser.opera)
        version = parseFloat(opera.version());

    // WebKit 522+ (Safari 3+)
    if (browser.webkit)
        version = parseFloat(agent.match(/ applewebkit\/(\d+)/)[1]);

    /**
     * 浏览器版本判断
     * IE系列返回值为5,6,7,8,9,10等
     * gecko系列会返回10900，158900等.
     * webkit系列会返回其build号 (如 522等).
     * @name version
     * @grammar     UM.browser.version  => number
     * @example
     * if ( UM.browser.ie && UM.browser.version == 6 ){
     *     alert( "Ouch!居然是万恶的IE6!" );
     * }
     */
    browser.version = version;

    /**
     * 是否是兼容模式的浏览器
     * @name isCompatible
     * @grammar  UM.browser.isCompatible  => true|false
     * @example
     * if ( UM.browser.isCompatible ){
     *     alert( "你的浏览器相当不错哦！" );
     * }
     */
    browser.isCompatible =
        !browser.mobile && (
            ( browser.ie && version >= 6 ) ||
                ( browser.gecko && version >= 10801 ) ||
                ( browser.opera && version >= 9.5 ) ||
                ( browser.air && version >= 1 ) ||
                ( browser.webkit && version >= 522 ) ||
                false );
    return browser;
}();
//快捷方式
var ie = browser.ie,
    webkit = browser.webkit,
    gecko = browser.gecko,
    opera = browser.opera;

//这里只放不是由模块产生的默认参数
UF.defaultOptions = {
    zIndex: 10,
    lang: 'zh-cn'
};

//模块注册&暴露模块接口
(function () {
    var _modules;
    UF.registerModule = function (name, module) {
        //初始化模块列表
        if (!_modules) {
            _modules = {};
        }
        _modules[ name ] = module;
    };
    UF.getModules = function () {
        return _modules;
    };
})();

var Utils = UFinder.Utils = {
    argsToArray: function (args, index) {
        return Array.prototype.slice.call(args, index || 0);
    },
    regularDirPath: function (path) {
        return path.replace(/([^\/])$/, '$1/').replace(/^([^\/])/, '/$1');
    },
    getParentPath: function (path) {
        return path.replace(/[^\/]+\/?$/, '');
    },
    getPathExt: function (path) {
        var index = path.lastIndexOf('.');
        return path.substr((index == -1 ? path.length : index) + 1);
    },
    isImagePath: function (path) {
        return path && 'png gif bmp jpg jpeg'.split(' ').indexOf(Utils.getPathExt(path)) != -1;
    },
    isCodePath: function (path) {
        return path && 'txt md json js css html htm xml php asp jsp'.split(' ').indexOf(Utils.getPathExt(path)) != -1;
    },
    isWebPagePath: function (path) {
        return path && 'html php asp jsp'.split(' ').indexOf(Utils.getPathExt(path)) != -1;
    },
    extend: function (t, s, b) {
        if (s) {
            for (var k in s) {
                if (!b || !t.hasOwnProperty(k)) {
                    t[k] = s[k];
                }
            }
        }
        return t;
    },
    clone: function (source, target) {
        var tmp;
        target = target || {};
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                tmp = source[i];
                if (typeof tmp == 'object') {
                    target[i] = Utils.isArray(tmp) ? [] : {};
                    Utils.clone(source[i], target[i]);
                } else {
                    target[i] = tmp;
                }
            }
        }
        return target;
    },
    loadFile: (function () {
        var tmpList = [];

        function getItem(doc, obj) {
            try {
                for (var i = 0, ci; ci = tmpList[i++];) {
                    if (ci.doc === doc && ci.url == (obj.src || obj.href)) {
                        return ci;
                    }
                }
            } catch (e) {
                return null;
            }

        }

        return function (doc, obj, fn) {
            var p, item = getItem(doc, obj);
            if (item) {
                if (item.ready) {
                    fn && fn();
                } else {
                    item.funs.push(fn);
                }
                return;
            }
            tmpList.push({
                doc: doc,
                url: obj.src || obj.href,
                funs: [fn]
            });
            if (!doc.body) {
                var html = [];
                for (p in obj) {
                    if (p == 'tag')continue;
                    html.push(p + '="' + obj[p] + '"');
                }
                doc.write('<' + obj.tag + ' ' + html.join(' ') + ' ></' + obj.tag + '>');
                return;
            }
            if (obj.id && doc.getElementById(obj.id)) {
                return;
            }
            var element = doc.createElement(obj.tag);
            delete obj.tag;
            for (p in obj) {
                element.setAttribute(p, obj[p]);
            }
            element.onload = element.onreadystatechange = function () {
                if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                    item = getItem(doc, obj);
                    if (item.funs.length > 0) {
                        item.ready = 1;
                        for (var fi; fi = item.funs.pop();) {
                            fi();
                        }
                    }
                    element.onload = element.onreadystatechange = null;
                }
            };
            element.onerror = function () {
                throw new Error('The load ' + (obj.href || obj.src) + ' fails,check the url');
            };
            doc.getElementsByTagName("head")[0].appendChild(element);
        };
    })()
};

$.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Boolean'], function (k, v) {
    Utils['is' + v] = function (obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    };
});

/**
 * @description 创建一个类
 * @param {String}    fullClassName  类全名，包括命名空间。
 * @param {Plain}     defines        要创建的类的特性
 *     defines.constructor  {Function}       类的构造函数，实例化的时候会被调用。
 *     defines.base         {String}         基类的名称。名称要使用全名。（因为base是javascript未来保留字，所以不用base）
 *     defines.mixin        {Array<String>}  要混合到新类的类集合
 *     defines.<method>     {Function}       其他类方法
 *
 * TODO:
 *     Mixin 构造函数调用支持
 */
(function () {

    var debug = true;

    // just to bind context
    Function.prototype.bind = Function.prototype.bind || function (thisObj) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.apply(thisObj, args);
    };

    // 方便调试查看
    if (debug) {
        var origin = Object.prototype.toString;
        Object.prototype.toString = function () {
            return this.__UFinderClassName || origin.call(this);
        };
    }

    // 所有类的基类
    function Class() {
    }

    Class.__UFinderClassName = 'Class';

    function getCallerClass(instance, caller) {
        var currentClass = instance.constructor;
    }

    // 提供 base 调用支持
    Class.prototype.base = function (name) {
        var caller = arguments.callee.caller;
        var method = caller.__UFinderMethodClass.__UFinderBaseClass.prototype[ name ];
        return method.apply(this, Array.prototype.slice.call(arguments, 1));
    };

    // 直接调用 base 类的同名方法
    Class.prototype.callBase = function () {
        var caller = arguments.callee.caller;
        var method = caller.__UFinderMethodClass.__UFinderBaseClass.prototype[ caller.__UFinderMethodName ];
        return method.apply(this, arguments);
    };

    Class.prototype.mixin = function (name) {
        var caller = arguments.callee.caller;
        var mixins = caller.__UFinderMethodClass.__UFinderMixins;
        if (!mixins) {
            return this;
        }
        var method = mixins[ name ];
        return method.apply(this, Array.prototype.slice.call(arguments, 1));
    };

    Class.prototype.callMixin = function () {
        var caller = arguments.callee.caller;
        var methodName = caller.__UFinderMethodName;
        var mixins = caller.__UFinderMethodClass.__UFinderMixins;
        if (!mixins) {
            return this;
        }
        var method = mixins[ methodName ];
        if (methodName == 'constructor') {
            for (var i = 0, l = method.length; i < l; i++) {
                method[ i ].call(this);
            }
            return this;
        } else {
            return method.apply(this, arguments);
        }
    };

    Class.prototype.pipe = function (fn) {
        if (typeof ( fn ) == 'function') {
            fn.call(this, this);
        }
        return this;
    };

    Class.prototype.getType = function () {
        return this.__UFinderClassName;
    };

    // 检查基类是否调用了父类的构造函数
    // 该检查是弱检查，假如调用的代码被注释了，同样能检查成功（这个特性可用于知道建议调用，但是出于某些原因不想调用的情况）
    function checkBaseConstructorCall(targetClass, classname) {
        var code = targetClass.toString();
        if (!/this\.callBase/.test(code)) {
            throw new Error(classname + ' : 类构造函数没有调用父类的构造函数！为了安全，请调用父类的构造函数');
        }
    }

    function checkMixinConstructorCall(targetClass, classname) {
        var code = targetClass.toString();
        if (!/this\.callMixin/.test(code)) {
            throw new Error(classname + ' : 类构造函数没有调用父类的构造函数！为了安全，请调用父类的构造函数');
        }
    }

    var FINDER_INHERIT_FLAG = '__FINDER_INHERIT_FLAG_' + ( +new Date() );

    function inherit(constructor, BaseClass, classname) {
        var UFinderClass = eval('(function UFinder' + classname + '( __inherit__flag ) {' +
            'if( __inherit__flag != FINDER_INHERIT_FLAG ) {' +
            'UFinderClass.__UFinderConstructor.apply(this, arguments);' +
            '}' +
            'this.__UFinderClassName = UFinderClass.__UFinderClassName;' +
            '})');
        UFinderClass.__UFinderConstructor = constructor;

        UFinderClass.prototype = new BaseClass(FINDER_INHERIT_FLAG);

        for (var methodName in BaseClass.prototype) {
            if (BaseClass.prototype.hasOwnProperty(methodName) && methodName.indexOf('__UFinder') !== 0) {
                UFinderClass.prototype[ methodName ] = BaseClass.prototype[ methodName ];
            }
        }

        UFinderClass.prototype.constructor = UFinderClass;

        return UFinderClass;
    }

    function mixin(NewClass, mixins) {
        if (false === mixins instanceof Array) {
            return NewClass;
        }

        var i, length = mixins.length,
            proto, method;

        NewClass.__UFinderMixins = {
            constructor: []
        };

        for (i = 0; i < length; i++) {
            proto = mixins[ i ].prototype;

            for (method in proto) {
                if (false === proto.hasOwnProperty(method) || method.indexOf('__UFinder') === 0) {
                    continue;
                }
                if (method === 'constructor') {
                    // constructor 特殊处理
                    NewClass.__UFinderMixins.constructor.push(proto[ method ]);
                } else {
                    NewClass.prototype[ method ] = NewClass.__UFinderMixins[ method ] = proto[ method ];
                }
            }
        }

        return NewClass;
    }

    function extend(BaseClass, extension) {
        if (extension.__UFinderClassName) {
            extension = extension.prototype;
        }
        for (var methodName in extension) {
            if (extension.hasOwnProperty(methodName) &&
                methodName.indexOf('__UFinder') &&
                methodName != 'constructor') {
                var method = BaseClass.prototype[ methodName ] = extension[ methodName ];
                method.__UFinderMethodClass = BaseClass;
                method.__UFinderMethodName = methodName;
            }
        }
        return BaseClass;
    }

    UF.createClass = function (classname, defines) {
        var constructor, NewClass, BaseClass;

        if (arguments.length === 1) {
            defines = arguments[ 0 ];
            classname = 'AnonymousClass';
        }

        BaseClass = defines.base || Class;

        if (defines.hasOwnProperty('constructor')) {
            constructor = defines.constructor;
            if (BaseClass != Class) {
                checkBaseConstructorCall(constructor, classname);
            }
        } else {
            constructor = function () {
                this.callBase.apply(this, arguments);
                this.callMixin.apply(this, arguments);
            };
        }

        NewClass = inherit(constructor, BaseClass, classname);
        NewClass = mixin(NewClass, defines.mixins);

        NewClass.__UFinderClassName = constructor.__UFinderClassName = classname;
        NewClass.__UFinderBaseClass = constructor.__UFinderBaseClass = BaseClass;

        NewClass.__UFinderMethodNames = constructor.__UFinderMethodName = 'constructor';
        NewClass.__UFinderMethodClass = constructor.__UFinderMethodClass = NewClass;

        // 下面这些不需要拷贝到原型链上
        delete defines.mixins;
        delete defines.constructor;
        delete defines.base;

        NewClass = extend(NewClass, defines);

        return NewClass;
    };

    UF.extendClass = extend;

})();

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

var Finder = UF.Finder = UF.createClass('Finder', {
    constructor: function (options) {
        this._options = $.extend(window.UFINDER_CONFIG || {}, options);
        this.setDefaultOptions(UF.defaultOptions);
        this._initEvents();
        this._initSelection();
        this._initFinder();
        this._initShortcutKey();
        this._initModules();

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
        return this._options[ key ];
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

UF.extendClass(Finder, {
    _initEvents: function () {
        this._eventCallbacks = {};
    },
    _initDomEvent: function () {
        var me = this,
            $container = me.$container,
            $keyListener = $('<input class="ufui-key-listener">');

        $container.append($('<div class="ufui-event-helper" style="position:absolute;left:0;top:0;height:0;width:0;overflow: hidden;"></div>').append($keyListener));
        me._proxyDomEvent = $.proxy(me._proxyDomEvent, me);

        /* 点击事件触发隐藏域聚焦,用于捕获键盘事件 */
        me._initKeyListener($container, $keyListener);

        /* 键盘事件 */
        $(document).on('keydown keyup keypress', me._proxyDomEvent);

        /* 鼠标事件 */
        $container.on('click mousedown mouseup mousemove mouseover mouseout contextmenu selectstart', me._proxyDomEvent);

    },
    _proxyDomEvent: function (evt) {
        var me = this;
        if (evt.originalEvent) {
            var $target = $(evt.originalEvent.target);
            /* 同时触发 tree.click 等事件 */
            $.each(['tree', 'list', 'toolbar'], function (k, p) {
                if ($target[0] == me['$' + p][0] || $target.parents('.ufui-' + p)[0] == me['$' + p][0]) {
                    me.fire(p + '.' + evt.type.replace(/^on/, ''), evt);
                }
            });
        }
        return this.fire(evt.type.replace(/^on/, ''), evt);
    },
    _initKeyListener: function ($container, $keyListener) {
        var me = this;
        /* 点击让ufinder获得焦点,帮助获取键盘事件 */
        $container.on('click', function (evt) {
            var target = evt.target;
            if (target.tagName != 'INPUT' && target.tagName != 'TEXTAREA' &&
                target.contentEditable != true) {
                // console.log('ufinder focus');
                $keyListener.focus();
                me.isFocused == false && me.setFocus();
            }
        });
        /* 点击document除掉当前ufinder的位置,让ufinder失去焦点 */
        $(document).on('click', function (evt) {
            /* 忽略代码触发的点击事件 */
            if (evt.originalEvent) {
                var $ufContainer = $(evt.originalEvent.target).parents('.ufui-container');
                if ($ufContainer[0] != $container[0]) {
                    $keyListener.blur();
                    me.isFocused == true && me.setBlur();
                }
            }
        });
        me.on('afterexeccommand', function (type, cmd) {
            if (['rename', 'touch', 'mkdir'].indexOf(cmd) == -1) {
                $keyListener.focus();
            }
        });
    },
    setFocus: function () {
        this.isFocused = true;
        this.fire('focus');
    },
    setBlur: function () {
        this.isFocused = false;
        this.fire('blur');
    },
    _listen: function (type, callback) {
        var callbacks = this._eventCallbacks[ type ] || ( this._eventCallbacks[ type ] = [] );
        callbacks.push(callback);
    },
    on: function (name, callback) {
        var types = name.split(' ');
        for (var i = 0; i < types.length; i++) {
            this._listen(types[ i ].toLowerCase(), callback);
        }
        return this;
    },
    one: function (name, callback) {
        var me = this,
            handler = function () {
                callback();
                me.off(name, handler);
            };

        me.on(name, handler);
        return this;
    },
    off: function (name, callback) {
        var types = name.split(' ');
        var i, j, callbacks, removeIndex;
        for (i = 0; i < types.length; i++) {
            callbacks = this._eventCallbacks[ types[ i ].toLowerCase() ];
            if (callbacks) {
                removeIndex = null;
                for (j = 0; j < callbacks.length; j++) {
                    if (callbacks[j] == callback) {
                        removeIndex = j;
                    }
                }
                if (removeIndex !== null) {
                    callbacks.splice(removeIndex, 1);
                }
            }
        }
    },
    fire: function (type) {
        var callbacks = this._eventCallbacks[ type.toLowerCase() ];
        if (!callbacks) {
            return;
        }
        for (var i = 0; i < callbacks.length; i++) {
            var res = callbacks[ i ].apply(this, arguments);
            if (res == false) {
                break;
            }
        }
        return res;
    }
});

UF.extendClass(Finder, {
    _initShortcutKey: function () {
        this._shortcutkeys = {};
    },
    addShortcutKeys: function (cmd, keys) {
        var obj = {};
        if (keys) {
            obj[ cmd ] = keys;
        } else {
            obj = cmd;
        }
        $.extend(this._shortcutkeys, obj);

        this._bindshortcutKeys();
    },
    _bindshortcutKeys: function () {
        var me = this,
            shortcutkeys = me._shortcutkeys;

        me.on('keydown', function (type, e) {
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
});


UF.extendClass(Finder, {
    _initSelection: function () {
        this._selectedFiles = [];
    },
    //提供接口给command获取选区实例
    getSelection: function () {
        return new Selection(this);
    },
    //提供接口给adapter获取选区实例
    setSelectedFiles: function (paths) {
        this._selectedFiles = $.isArray(paths) ? paths : [paths];
        this.fire('selectionchange');
    }
});

UF.extendClass(Finder, {
    _initModules: function () {

        var modulesPool = UF.getModules();

        this._commands = {};
        this._query = {};
        this._modules = {};

        var me = this,
            i, name, module, moduleDeals, dealCommands, dealEvents;

        for (name in modulesPool) {
            if (!modulesPool.hasOwnProperty(name)) continue;

            //执行模块初始化，抛出后续处理对象
            moduleDeals = modulesPool[ name ].call(me);
            this._modules[name] = moduleDeals;
            if (moduleDeals.init) {
                moduleDeals.init.call(me, this._options);
            }

            //command加入命令池子
            dealCommands = moduleDeals.commands;
            for (var cmd in dealCommands) {
                me._commands[cmd.toLowerCase()] = dealCommands[cmd];
            }

            //设置模块默认配置项
            if (moduleDeals.defaultOptions) {
                me.setDefaultOptions(moduleDeals.defaultOptions);
            }

            //绑定事件
            dealEvents = moduleDeals.events;
            if (dealEvents) {
                for (var type in dealEvents) {
                    me.on(type, dealEvents[ type ]);
                }
            }

            //添加模块的快捷键
            if (moduleDeals.shortcutKeys) {
                me.addShortcutKeys(moduleDeals.shortcutKeys);
            }

        }
    }
});

UF.extendClass(Finder, {
    _getCommand: function (name) {
        return this._commands[ name.toLowerCase() ];
    },
    _queryCommand: function (name, type, args) {
        var cmd = this._getCommand(name);
        if (cmd) {
            var queryCmd = cmd[ 'query' + type ];
            if (queryCmd)
                return queryCmd.apply(cmd, [ this ].concat(args));
        }
        return 0;
    },
    queryCommandState: function (name) {
        if (!this.isFocused) return -1;
        return this._queryCommand(name, "State", Utils.argsToArray(1));
    },
    queryCommandValue: function (name) {
        return this._queryCommand(name, "Value", Utils.argsToArray(1));
    },
    execCommand: function (name) {
        name = name.toLowerCase();

        var cmdArgs = $.makeArray(arguments).slice(1),
            cmd, result;

        var me = this;
        cmd = this._getCommand(name);

        if (!cmd) {
            return false;
        }

        me.fire('beforeexeccommand', name);
        result = cmd.execute.apply(me, cmdArgs);
        me.fire('afterexeccommand', name);

        return result === undefined ? null : result;
    }
});

var Selection = UF.Selection = UF.createClass("Selection", {
    constructor: function (finder) {
        this.finder = finder;
        this._selectedFiles = finder._selectedFiles || [];
    },
    getSelectedFile: function () {
        return this._selectedFiles[0];
    },
    getSelectedFiles: function () {
        return this._selectedFiles;
    },
    removeSelectedFiles: function (paths) {
        var me = this;
        $.each($.isArray(paths) ? paths : [paths], function (i, p) {
            var index;
            if (( index = me._selectedFiles.indexOf(p) ) === -1) return;
            me._selectedFiles.splice(index, 1);
        });
    },
    removeAllSelectedFiles: function () {
        this._selectedFiles = [];
    },
    isFileSelected: function (path) {
        return this._selectedFiles.indexOf(path) !== -1;
    },
    select: function () {
        this.finder.fire('selectfiles', this._selectedFiles);
    }
});

var DataTree = UF.DataTree = UF.createClass("DataTree", {
    constructor: function (finder) {
        this.finder = finder;
        this.root = null;
    },
    setRoot: function (data) {
        this.root = new FileNode(data);
        this.finder.fire('dataReady', data);
    },
    _getFileNode: function (path) {
        var current = this.root,
            pathArr = path.split('/');

        for (var i = 0; i < pathArr.length; i++) {
            var name = pathArr[i];
            if (name != '') {
                current = current.getChild(name);
            }
        }
        return current;
    },
    getFileInfo: function (path) {
        var info = this._getFileNode(path);
        return info ? info.getInfo() : null;
    },
    _addFile: function (data) {
        var current = this.root,
            pathArr = $.trim(data.path).replace(/(^\/)|(\/$)/g, '').split('/');

        for (var i = 0; i < pathArr.length - 1; i++) {
            var name = pathArr[i];
            if (name != '') {
                current = current.getChild(name);
            }
        }
        current && current.addChild(new FileNode(data));
    },
    addFile: function (data) {
        this._addFile(data);
        this.finder.fire('addFiles', data);
    },
    updateFile: function (path, data) {
        var file = this._getFileNode(path);
        if (file.path == path) {
            file.setInfo(data);
        } else {
            file.remove();
            this._addFile(data);
        }
        this.finder.fire('updateFile', path, data);
    },
    removeFile: function (path) {
        var file = this._getFileNode(path);
        file && file.remove();
        this.finder.fire('removeFiles', path);
    },
    addFiles: function (datas) {
        var me = this;
        $.each(datas, function (key, data) {
            me.addFile(data);
        });
    },
    removeFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.removeFile(path);
        });
    },
    lockFile: function (path) {
        var file = this._getFileNode(path);
        file && file.lock();
        this.finder.fire('lockfiles', [path]);
    },
    unLockFile: function (path) {
        var file = this._getFileNode(path);
        file && file.unLock();
        this.finder.fire('unlockfiles', [path]);
    },
    lockFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.lockFile(path);
        });
    },
    unLockFiles: function (paths) {
        var me = this;
        $.each(paths, function (key, path) {
            me.unLockFile(path);
        });
    },
    listDirFileInfo: function (path) {
        var filelist = [],
            dir = this._getFileNode(path);
        $.each(dir.children, function (k, v) {
            filelist.push(v.getInfo());
        });
        return filelist;
    },
    isFileLocked: function (path) {
        return this._getFileNode(path).locked;
    }
});

var Request = UF.Request = UF.createClass("Request", {
    constructor: function (data, callback) {
        this.id = 'r' + (+new Date()).toString(36);
        this.data = data;
        this.jqXhr = null;
        this.callback = callback;
    },
    send: function () {
        var me = this;
        me.jqXhr = $.ajax(me.data).always(function (r) {
            try {
                me.responseJson = JSON ? JSON.parse(r) : eval(r);
            } catch (e) {
                me.responseJson = null;
            }
            me.responseText = r;
            console.log(me.responseJson || r);
            me.callback && me.callback(me.responseJson);
        });
    },
    abort: function () {
        this.cancel();
    },
    cancel: function () {
        this.jqXhr && this.jqXhr.abort();
    },
    callback: function () {

    }
});

var Uploader = UF.Uploader = UF.createClass("Uploader", {
    constructor: function (data, callback) {
        this.id = 'r' + (+new Date()).toString(36);
        this.data = data;
        this.webuploader = data.webuploader;
        this.callback = callback;
        this.process = data.process;
        this.file = data.data.file;
        this._initEvents();
    },
    _initEvents: function () {
        var me = this, r,
            handler = function (file) {
                if (file.id == me.file.id) {
                    console.log(r);
                    try {
                        me.responseJson = JSON ? JSON.parse(r) : eval(r);
                    } catch (e) {
                        me.responseJson = null;
                    }
                    me.responseText = r;
                    me.webuploader.stop();
                    me.callback && me.callback(me.responseJson);
                    me.webuploader.off('uploadComplete', handler);
                }
            };

        me.webuploader.on('uploadProgress', function (file, percent) {
            me.process && me.process(percent);
        });
        me.webuploader.on('uploadSuccess', function (file, ret) {
            r = ret._raw;
        });
        me.webuploader.on('uploadError', function (file, ret) {
            r = ret._raw;
        });
        me.webuploader.on('uploadComplete', handler);
    },
    send: function () {
        this.webuploader.option('formdata', {
            cmd: 'upload',
            target: this.data.data.target
        });
        this.webuploader.upload(this.file);
    },
    pause: function () {
        this.webuploader.stop();
    },
    cancel: function () {
        this.webuploader.stop(true);
    }
});

var Proxy = UF.Proxy = UF.createClass("Proxy", {
    constructor: function (finder) {
        this.finder = finder;
        this._queue = [];
        this.active = false;
        this.nextSendIndex = 0;
        this._url = finder.getOption('serverUrl');
    },
    'init': function (callback) {
        return this._get({
            'cmd': 'init'
        }, callback);
    },
    getRequestUrl: function(options){
        var url = this._url + '?';
        $.each(options || {}, function(k, v){
            url += (k + '=' + v + '&');
        });
        if(url.charAt(url.length - 1) == '&') url = url.substr(0, url.length - 1);
        if(url.charAt(url.length - 1) == '?') url = url.substr(0, url.length - 1);
        return url;
    },
    'ls': function (target, callback) {
        return this._get({
            'cmd': 'ls',
            'target': target
        }, callback);
    },
    'rename': function (target, name, callback) {
        return this._get({
            'cmd': 'rename',
            'target': target,
            'name': name
        }, callback);
    },
    'touch': function (target, callback) {
        return this._get({
            'cmd': 'touch',
            'target': target
        }, callback);
    },
    'mkdir': function (target, callback) {
        return this._get({
            'cmd': 'mkdir',
            'target': target
        }, callback);
    },
    'rm': function (target, callback) {
        return this._get({
            'cmd': 'rm',
            'target': target
        }, callback);
    },
    upload: function (target, file, callback) {
        return this._upload({
            'cmd': 'upload',
            'target': target,
            'file': file
        }, callback, file);
    },
    info: function (target, callback) {
        return this._get({
            'cmd': 'info',
            'target': target
        }, callback);
    },
    _get: function (data, callback) {
        return this._ajax('GET', data, callback);
    },
    _post: function (data, callback) {
        return this._ajax('POST', data, callback);
    },
    _upload: function (data, callback) {
        return this._ajax('UPLOAD', data, callback);
    },
    _ajax: function (type, data, callback) {
        var me = this,
            request,
            handler = function (d) {
                me._beforeRequestComplete(d, request);
                callback && callback(d, request);
                me._afterRequestComplete(d, request);
            };

        if (type == 'UPLOAD') {
            request = new Uploader({
                url: me._url,
                type: type,
                webuploader: me.finder.webuploader,
                data: data,
                process: function (p) {
                    me.finder.fire('updatemessage', {
                        loadedPercent: p,
                        request: request,
                        id: request.id
                    });
                }
            }, handler);
        } else {
            request = new Request({
                url: me._url,
                type: type,
                data: data
            }, handler);
        }

        me._pushRequest(request);
        me.finder.fire('showmessage', {
            icon: 'loading',
            title: data.cmd + ' loading...',
            loadedPercent: 100,
            request: request,
            id: request.id
        });

        return request;
    },
    _pushRequest: function (request) {
        this._queue.push(request);
        this._sendRequest();
    },
    _sendRequest: function () {
        if (!this.active && this.nextSendIndex < this._queue.length) {
            this.active = true;
            this._queue[this.nextSendIndex++].send();
        }
    },
    _beforeRequestComplete: function (d, request) {
        this.finder.fire('beforeRequestComplete', d, request);
        this.finder.fire('hidemessage', {id: request.id});
        this.active = false;
        this._sendRequest();
    },
    _afterRequestComplete: function (d, request) {
        this.finder.fire('afterRequestComplete', d, request);
    }
});

UF.registerModule("openmodule", function () {
    var uf = this,
        listFile = function (path, isOpen) {

            if (path === undefined) {
                path = uf.getSelection().getSelectedFile();
            } else if (path == "") {
                path = "/";
            }

            var data = uf.dataTree.listDirFileInfo(path),
                openHandler = function (data) {
                    var filelist = (data && data.data && data.data.files) || [];
                    uf.dataTree.addFiles(filelist);
                    isOpen && uf.setCurrentPath(path);
                };

            if (data && data.length) {
                openHandler(data);
            } else {
                uf.proxy.ls(path, openHandler);
            }

        },
        queryState = function () {
            var paths, info;
            paths = uf.getSelection().getSelectedFiles();

            if (paths.length == 1) {
                info = uf.dataTree.getFileInfo(paths[0]);
                return info && info.read && !uf.dataTree.isFileLocked(paths[0]) ? 0 : -1;
            } else {
                return -1;
            }
        };

    return {
        "init": function () {

        },
        "defaultOptions": {
        },
        "commands": {
            "open": {
                execute: function (path) {

                    if (path === undefined) {
                        path = uf.getSelection().getSelectedFile();
                    } else if (path == "") {
                        path = "/";
                    }

                    listFile(path, true);
                },
                queryState: queryState
            },
            "list": {
                execute: function (path) {
                    listFile(path, false);
                },
                queryState: queryState
            }
        },
        "events": {

        }
    };
});

UF.registerModule("addfilemodule", function () {
    var uf = this;
    return {
        "init": function () {

        },
        "defaultOptions": {
        },
        "commands": {
            "touch": {
                execute: function (name) {
                    uf.fire('newFileTitle', '', function (name, callback) {
                        console.log('|******** touch done ********|');
                        var fullname = uf.getCurrentPath() + name;
                        if (name) {
                            uf.proxy.touch(fullname, function (d) {
                                callback && callback(d.state == 0);
                                if (d.state == 0) {
                                    var file = (d && d.data && d.data.file);
                                    uf.dataTree.addFile(file);
                                    uf.fire('selectfiles', file.path);
                                } else {
                                    uf.fire('showmessage', {title: d.message, timeout: 3000});
                                }
                            });
                        }
                    });
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            },
            "mkdir": {
                execute: function (name) {
//                    if (name === undefined) {
//                        name = prompt('新建文件夹', '新建文件夹');
//                    } else if (name == '') {
//                        name = '新建文件夹';
//                    }

                    uf.fire('newFileTitle', 'dir', function (name, callback) {
                        console.log('|******** mkdir done ********|');
                        var fullname = uf.getCurrentPath() + name;
                        if (name) {
                            uf.proxy.mkdir(fullname, function (d) {
                                callback && callback(d.state == 0);
                                if (d.state == 0) {
                                    var file = (d && d.data && d.data.file);
                                    uf.dataTree.addFile(file);
                                    uf.fire('selectfiles', file.path);
                                } else {
                                    uf.fire('showmessage', {title: d.message, timeout: 3000});
                                }
                            });
                        }
                    });
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            }
        },
        "shortcutKeys": {
            "touch": "ctrl+78" //newfile ctrl+N
        },
        "events": {
        }
    };
});

UF.registerModule("removemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {
        },
        "commands": {
            "remove": {
                execute: function () {
                    var paths = uf.getSelection().getSelectedFiles();
                    if (paths.length) {
                        uf.dataTree.lockFiles(paths);
                        var req = uf.proxy.rm(paths, function (d) {
                            if (d.state == 0) {
                                uf.dataTree.removeFiles(paths);
                                uf.fire('removefiles', paths);
                            } else {
                                uf.fire('updatemessage', {title: d.message, timeout: 3000, id: req.id});
                            }
                            uf.dataTree.unLockFiles(paths);
                        });
                    }
                },
                queryState: function () {
                    var paths = uf.getSelection().getSelectedFiles();

                    if (paths.length > 0) {
                        for (var k in paths) {
                            var info = uf.dataTree.getFileInfo(paths[k]);
                            if (info && !(info.write && !uf.dataTree.isFileLocked(paths[k]))) {
                                return -1;
                            }
                        }
                        return 0;
                    } else {
                        return -1;
                    }
                }
            }
        },
        "shortcutKeys": {
            "remove": "46" //remove Delete
        },
        "events": {
        }
    };
});

UF.registerModule("renamemodule", function () {
    var uf = this;
    return {
        "defaultOptions": {
        },
        "commands": {
            "rename": {
                execute: function (name) {
                    var name,
                        fullname,
                        target = uf.getSelection().getSelectedFile();

                    if (target) {
                        // name = prompt('重命名', target.replace(/^.*\//, ''));
                        uf.fire('renameFileTitle', target, function (name, callback) {
                            console.log('|******** rename done ********|');
                            fullname = uf.getCurrentPath() + name;
                            if (name && target != fullname) {
                                uf.dataTree.lockFile(target);
                                var req = uf.proxy.rename(target, fullname, function (d) {
                                    callback && callback(d.state == 0);
                                    if (d.state == 0) {
                                        var file = (d && d.data && d.data.file);
                                        uf.dataTree.updateFile(target, file);
                                        uf.fire('selectfiles', file.path);
                                    } else {
                                        uf.fire('updatemessage', {title: d.message, timeout: 3000, id: req.id});
                                    }
                                    uf.dataTree.unLockFile(target);
                                });
                            }
                        });
                    }
                },
                queryState: function () {
                    var paths, info;
                    paths = uf.getSelection().getSelectedFiles();

                    if (paths.length == 1) {
                        info = uf.dataTree.getFileInfo(paths[0]);
                        return info && info.write && !uf.dataTree.isFileLocked(paths[0]) ? 0 : -1;
                    } else {
                        return -1;
                    }
                }
            }
        },
        "shortcutKeys": {
            "rename": browser.mac ? "13" : "113" //renamemac:Enter notmac: F2
        },
        "events": {
        }
    };
});

UF.registerModule("selectmodule", function () {
    var uf = this;
    return {
        "init": function () {

        },
        "defaultOptions": {
        },
        "commands": {
            "selectall": {
                execute: function (name) {
                    var current = uf.getCurrentPath(),
                        filelist = uf.dataTree.listDirFileInfo(current),
                        paths = [];

                    $.each(filelist, function (k, v) {
                        paths.push(v.path);
                    });
                    uf.fire('selectfiles', paths);
                },
                queryState: function () {
                }
            },
            "selectnext": {
                execute: function (paths) {
                },
                queryState: function () {
                }
            },
            "selectprevious": {
                execute: function (paths) {
                },
                queryState: function () {
                }
            }
        },
        "shortcutKeys": {
//            "selectall": "ctrl+65", //selectAll ctrl+A
//            "selectup": "37", //selectAll ctrl+up
//            "selectprevious": "38", //selectAll ctrl+left
//            "selectnext": "39", //selectAll ctrl+right
//            "selectdown": "40" //selectAll ctrl+down
        },
        "events": {
            'list.click': function () {

            }
        }
    };
});

UF.registerModule("uploadmodule", function () {
    var uf = this,
        initWebUploader = function () {

            var timestrap = (+new Date()).toString(36),
                messageId = 'u' + timestrap;

            // 创建webupoaler实例
            var uploader = uf.webuploader = WebUploader.create({

                // swf文件路径
                swf: uf.getOption('uploaderSwfUrl'),

                // 文件接收服务端。
                server: uf.getOption('serverUrl') + '?cmd=upload&target=' + uf.getCurrentPath(),

                // 选择文件的按钮。可选。
                // 内部根据当前运行是创建，可能是input元素，也可能是flash.
                // pick: '#' + id,

                // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
                resize: false,

                threads: 1,
                fileVal: uf.getOption('uploaderFileName'),
                formdata: {},
                duplicate: false

            });

            // 当有文件被添加进队列的时候
            uploader.on('fileQueued', function (file) {
                uf.execCommand('upload', file);
            });

            uf.fire('initUploader');

        };


    return {
        "init": function () {

        },
        "defaultOptions": {
            'uploaderFileName': 'file',
            'uploaderSwfUrl': uf.getOption('URL') + '/lib/webuploader/Uploader.swf',
            'uploaderJsUrl': uf.getOption('URL') + '/lib/webuploader/webuploader.js'
        },
        "commands": {
            "upload": {
                execute: function (file) {
                    if (file) {
                        uf.proxy.upload(uf.getCurrentPath(), file, function (d) {
                            if (d.state == 0) {
                                var file = (d && d.data && d.data.file);
                                uf.dataTree.addFile(file);
                                uf.fire('selectfiles', file.path);
                            } else {
                                uf.fire('showmessage', {title: d.message, timeout: 3000});
                            }
                        });
                    }
                },
                queryState: function () {
                    var info, path = uf.getCurrentPath();
                    info = uf.dataTree.getFileInfo(path);
                    return info && info.write && !uf.dataTree.isFileLocked(path) ? 0 : -1;
                }
            }
        },
        "events": {
            'ready': function () {
                var doc = uf.$container[0].ownerDocument;
                Utils.loadFile(doc, {
                    src: uf.getOption('uploaderJsUrl'),
                    tag: "script",
                    type: "text/javascript",
                    defer: "defer"
                }, initWebUploader);
            },
            'currentpathchange': function (type, path) {
                uf.webuploader && uf.webuploader.option('server', uf.getOption('URL') + '/server/ufinder.php?cmd=upload&target=' + path);
            }
        }
    };
});

UF.registerModule("lookimagemodule", function () {
    var uf = this;
    return {
        "commands": {
            "lookimage": {
                execute: function (path) {
                    uf.fire('selectFiles', path);
                    uf.$toolbar.find('.ufui-btn-lookimage').trigger('click');
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile();
                    return Utils.isImagePath(path) ? 0 : -1;
                }
            }
        }
    };
});

UF.registerModule("lookcodemodule", function () {
    var uf = this;
    return {
        "commands": {
            "lookcode": {
                execute: function (path) {
                    uf.fire('selectFiles', path);
                    uf.$toolbar.find('.ufui-btn-lookcode').trigger('click');
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile();
                    return Utils.isCodePath(path) ? 0 : -1;
                }
            }
        }
    };
});

UF.registerModule("pathchangemodule", function () {
    var uf = this;
    return {
        "init": function () {
            uf._pathHistory = [];
            uf._pathHistoryIndex = 0;
        },
        "commands": {
            "pathparent": {
                execute: function () {
                    var path = uf.getCurrentPath(),
                        parentPath = Utils.getParentPath(path);
                    uf.setCurrentPath(parentPath);
                },
                queryState: function () {
                    return uf.getCurrentPath().length > 2 ? 0 : -1;
                }
            },
            "pathbackward": {
                execute: function () {
                    if (uf._pathHistoryIndex > 0) {
                        uf.setCurrentPath(uf._pathHistory[uf._pathHistoryIndex--]);
                    }
                },
                queryState: function () {
                    return uf._pathHistoryIndex > 1 ? 0 : -1;
                }
            },
            "pathforward": {
                execute: function () {

                },
                queryState: function () {
                    return uf._pathHistory.length > (uf._pathHistoryIndex + 1) ? 0 : -1;
                }
            }
        },
        "events": {
            'currentPathChange': function (type, path) {
                uf._pathHistory.splice(uf._pathHistoryIndex, uf._pathHistory.length, path);
            }
        }
    };
});

UF.registerModule("downloadmodule", function () {
    var uf = this;
    return {
        "commands": {
            "download": {
                execute: function (path) {
                    uf.fire('selectFiles', path);
                    var downloadUrl = uf.proxy.getRequestUrl({
                        'cmd': 'download',
                        'target': path
                    });
                    var $downloadIframe = $('<iframe src="' + downloadUrl + '">').hide().appendTo(document.body).load(function(){
                        setTimeout(function(){
                            $downloadIframe.remove();
                        }, 3000);
                    });
                },
                queryState: function () {
                    var path = uf.getSelection().getSelectedFile(),
                        info = uf.dataTree.getFileInfo(path);
                    return info && info.type != 'dir' ? 0 : -1;
                }
            }
        }
    };
});

UF.registerModule("initmodule", function () {
    var uf = this;
    return {
        "init": function () {

        },
        "commands": {
            "init": {
                execute: function () {
                    uf.proxy.init(function (r) {
                        uf.dataTree.setRoot(r.data.root);
                    });
                }
            }
        },
        "events": {
            'ready': function () {
                uf.execCommand('init');
            },
            'dataReady': function () {
                uf.execCommand('open', '/');
            }
        }
    };
});

(function ($) {
    //对jquery的扩展
    $.parseTmpl = function parse(str, data) {
        var tmpl = 'var __p=[],print=function(){__p.push.apply(__p,arguments);};' + 'with(obj||{}){__p.push(\'' + str.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/<%=([\s\S]+?)%>/g,function (match, code) {
            return "'," + code.replace(/\\'/g, "'") + ",'";
        }).replace(/<%([\s\S]+?)%>/g,function (match, code) {
                return "');" + code.replace(/\\'/g, "'").replace(/[\r\n\t]/g, ' ') + "__p.push('";
            }).replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\t/g, '\\t') + "');}return __p.join('');";
        var func = new Function('obj', tmpl);
        return data ? func(data) : func;
    };
    $.extend2 = function (t, s) {
        var a = arguments,
            notCover = $.type(a[a.length - 1]) == 'boolean' ? a[a.length - 1] : false,
            len = $.type(a[a.length - 1]) == 'boolean' ? a.length - 1 : a.length;
        for (var i = 1; i < len; i++) {
            var x = a[i];
            for (var k in x) {
                if (!notCover || !t.hasOwnProperty(k)) {
                    t[k] = x[k];
                }
            }
        }
        return t;
    };

    $.IE6 = !!window.ActiveXObject && parseFloat(navigator.userAgent.match(/msie (\d+)/i)[1]) == 6;

    //所有ui的基类
    var _eventHandler = [];
    var _widget = function () {
    };
    var _prefix = 'ufui';
    _widget.prototype = {
        on: function (ev, cb) {
            this.root().on(ev, $.proxy(cb, this));
            return this;
        },
        off: function (ev, cb) {
            this.root().off(ev, $.proxy(cb, this));
            return this;
        },
        trigger: function (ev, data) {
            return  this.root().trigger(ev, data) === false ? false : this;
        },
        root: function ($el) {
            return this._$el || (this._$el = $el);
        },
        destroy: function () {

        },
        data: function (key, val) {
            if (val !== undefined) {
                this.root().data(_prefix + key, val);
                return this;
            } else {
                return this.root().data(_prefix + key);
            }
        },
        register: function (eventName, $el, fn) {
            _eventHandler.push({
                'evtname': eventName,
                '$els': $.isArray($el) ? $el : [$el],
                handler: $.proxy(fn, $el)
            });
        }
    };

    //从jq实例上拿到绑定的widget实例
    $.fn.ufui = function (obj) {
        return obj ? this.data('ufuiwidget', obj) : this.data('ufuiwidget');
    };

    function _createClass(ClassObj, properties, supperClass) {
        ClassObj.prototype = $.extend2(
            $.extend({}, properties),
            (UF.ui[supperClass] || _widget).prototype,
            true
        );
        ClassObj.prototype.supper = (UF.ui[supperClass] || _widget).prototype;
        //父class的defaultOpt 合并
        if (UF.ui[supperClass] && UF.ui[supperClass].prototype.defaultOpt) {

            var parentDefaultOptions = UF.ui[supperClass].prototype.defaultOpt,
                subDefaultOptions = ClassObj.prototype.defaultOpt;

            ClassObj.prototype.defaultOpt = $.extend({}, parentDefaultOptions, subDefaultOptions || {});

        }
        return ClassObj;
    }

    var _guid = 1;

    function mergeToJQ(ClassObj, className) {
        $[_prefix + className] = ClassObj;
        $.fn[_prefix + className] = function (opt) {
            var result, args = Array.prototype.slice.call(arguments, 1);

            this.each(function (i, el) {
                var $this = $(el);
                var obj = $this.ufui();
                if (!obj) {
                    new ClassObj(!opt || !$.isPlainObject(opt) ? {} : opt, $this);
                    $this.ufui(obj);
                }
                if ($.type(opt) == 'string') {
                    if (opt == 'this') {
                        result = obj;
                    } else {
                        result = obj[opt].apply(obj, args);
                        if (result !== obj && result !== undefined) {
                            return false;
                        }
                        result = null;
                    }

                }
            });

            return result !== null ? result : this;
        };
    }

    UF.ui = {
        define: function (className, properties, supperClass) {
            var ClassObj = UF.ui[className] = _createClass(function (options, $el) {
                var _obj = function () {
                };
                $.extend(_obj.prototype, ClassObj.prototype, {
                        guid: className + _guid++,
                        widgetName: className
                    }
                );
                var obj = new _obj();
                if ($.type(options) == 'string') {
                    obj.init && obj.init({});
                    obj.root().ufui(obj);
                    obj.root().find('a').click(function (evt) {
                        evt.preventDefault();
                    });
                    return obj.root()[_prefix + className].apply(obj.root(), arguments);
                } else {
                    $el && obj.root($el);
                    obj.init && obj.init(!options || $.isPlainObject(options) ? $.extend2(options || {}, obj.defaultOpt || {}, true) : options);
                    try {
                        obj.root().find('a').click(function (evt) {
                            evt.preventDefault();
                        });
                    } catch (e) {
                    }

                    return obj.root().ufui(obj);
                }

            }, properties, supperClass);

            mergeToJQ(ClassObj, className);
        }
    };

    $(function () {
        $(document).on('click mouseup mousedown dblclick mouseover', function (evt) {
            $.each(_eventHandler, function (i, obj) {
                if (obj.evtname == evt.type) {
                    $.each(obj.$els, function (i, $el) {
                        if ($el[0] !== evt.target && !$.contains($el[0], evt.target)) {
                            obj.handler(evt);
                        }
                    });
                }
            });
        });
    });
})(jQuery);

//button 类
UF.ui.define('button', {
    tpl: '<<%if(!texttype){%>div class="ufui-btn ufui-btn-<%=icon%> <%if(name){%>ufui-btn-name-<%=name%><%}%>" unselectable="on" onmousedown="return false" <%}else{%>a class="ufui-text-btn"<%}%><% if(title) {%>title="<%=title%>" data-original-title="<%=title%>" <%};%>> ' +
        '<% if(icon) {%><div unselectable="on" class="ufui-icon-<%=icon%> ufui-icon"></div><% }; %><%if(text) {%><span unselectable="on" onmousedown="return false" class="ufui-button-label"><%=text%></span><%}%>' +
        '<%if(caret && text){%><span class="ufui-button-spacing"></span><%}%>' +
        '<% if(caret) {%><span unselectable="on" onmousedown="return false" class="ufui-caret"></span><% };%></<%if(!texttype){%>div<%}else{%>a<%}%>>',
    defaultOpt: {
        text: '',
        title: '',
        icon: '',
        width: '',
        caret: false,
        texttype: false,
        click: function () {
        }
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options)))
            .click(function (evt) {
                me.wrapclick(options.click, evt);
            });

        me.root().hover(function () {
            if (!me.root().hasClass("ufui-disabled")) {
                me.root().toggleClass('ufui-hover');
            }
        });

        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            this.root().trigger('wrapclick');
            return $.proxy(fn, this, evt)();
        }
    },
    label: function (text) {
        if (text === undefined) {
            return this.root().find('.ufui-button-label').text();
        } else {
            this.root().find('.ufui-button-label').text(text);
            return this;
        }
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.ufui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.on('click',function () {
            me.wrapclick(function () {
                $obj.ufui().show();
            });
        }).register('click', me.root(), function (evt) {
                $obj.hide();
            });
    }
});

/**
 * Created with JetBrains PhpStorm.
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function () {

    var widgetName = 'combobox',
        itemClassName = 'ufui-combobox-item',
        HOVER_CLASS = 'ufui-combobox-item-hover',
        ICON_CLASS = 'ufui-combobox-checked-icon',
        labelClassName = 'ufui-combobox-item-label';

    UF.ui.define(widgetName, (function () {

        return {
            tpl: "<ul class=\"dropdown-menu ufui-combobox-menu<%if (comboboxName!=='') {%> ufui-combobox-<%=comboboxName%><%}%>\" unselectable=\"on\" onmousedown=\"return false\" role=\"menu\" aria-labelledby=\"dropdownMenu\">" +
                "<%if(autoRecord) {%>" +
                "<%for( var i=0, len = recordStack.length; i<len; i++ ) {%>" +
                "<%var index = recordStack[i];%>" +
                "<li class=\"<%=itemClassName%><%if( selected == index ) {%> ufui-combobox-checked<%}%>\" data-item-index=\"<%=index%>\" unselectable=\"on\" onmousedown=\"return false\">" +
                "<span class=\"ufui-combobox-icon\" unselectable=\"on\" onmousedown=\"return false\"></span>" +
                "<label class=\"<%=labelClassName%>\" style=\"<%=itemStyles[ index ]%>\" unselectable=\"on\" onmousedown=\"return false\"><%=items[index]%></label>" +
                "</li>" +
                "<%}%>" +
                "<%if( i ) {%>" +
                "<li class=\"ufui-combobox-item-separator\"></li>" +
                "<%}%>" +
                "<%}%>" +
                "<%for( var i=0, label; label = items[i]; i++ ) {%>" +
                "<li class=\"<%=itemClassName%><%if( selected == i ) {%> ufui-combobox-checked<%}%> ufui-combobox-item-<%=i%>\" data-item-index=\"<%=i%>\" unselectable=\"on\" onmousedown=\"return false\">" +
                "<span class=\"ufui-combobox-icon\" unselectable=\"on\" onmousedown=\"return false\"></span>" +
                "<label class=\"<%=labelClassName%>\" style=\"<%=itemStyles[ i ]%>\" unselectable=\"on\" onmousedown=\"return false\"><%=label%></label>" +
                "</li>" +
                "<%}%>" +
                "</ul>",
            defaultOpt: {
                //记录栈初始列表
                recordStack: [],
                //可用项列表
                items: [],
                //item对应的值列表
                value: [],
                comboboxName: '',
                selected: '',
                //自动记录
                autoRecord: true,
                //最多记录条数
                recordCount: 5
            },
            init: function (options) {

                var me = this;

                $.extend(me._optionAdaptation(options), me._createItemMapping(options.recordStack, options.items), {
                    itemClassName: itemClassName,
                    iconClass: ICON_CLASS,
                    labelClassName: labelClassName
                });

                this._transStack(options);

                me.root($($.parseTmpl(me.tpl, options)));

                this.data('options', options).initEvent();

            },
            initEvent: function () {

                var me = this;

                me.initSelectItem();

                this.initItemActive();

            },
            /**
             * 初始化选择项
             */
            initSelectItem: function () {

                var me = this,
                    labelClass = "." + labelClassName;

                me.root().delegate('.' + itemClassName, 'click', function () {

                    var $li = $(this),
                        index = $li.attr('data-item-index');

                    me.trigger('comboboxselect', {
                        index: index,
                        label: $li.find(labelClass).text(),
                        value: me.data('options').value[ index ]
                    }).select(index);

                    me.hide();

                    return false;

                });

            },
            initItemActive: function () {
                var fn = {
                    mouseenter: 'addClass',
                    mouseleave: 'removeClass'
                };
                if ($.IE6) {
                    this.root().delegate('.' + itemClassName, 'mouseenter mouseleave',function (evt) {
                        $(this)[ fn[ evt.type ] ](HOVER_CLASS);
                    }).one('afterhide', function () {
                        });
                }
            },
            /**
             * 选择给定索引的项
             * @param index 项索引
             * @returns {*} 如果存在对应索引的项，则返回该项；否则返回null
             */
            select: function (index) {

                var itemCount = this.data('options').itemCount,
                    items = this.data('options').autowidthitem;

                if (items && !items.length) {
                    items = this.data('options').items;
                }

                if (itemCount == 0) {
                    return null;
                }

                if (index < 0) {

                    index = itemCount + index % itemCount;

                } else if (index >= itemCount) {

                    index = itemCount - 1;

                }

                this.trigger('changebefore', items[ index ]);

                this._update(index);

                this.trigger('changeafter', items[ index ]);

                return null;

            },
            selectItemByLabel: function (label) {

                var itemMapping = this.data('options').itemMapping,
                    me = this,
                    index = null;

                !$.isArray(label) && ( label = [ label ] );

                $.each(label, function (i, item) {

                    index = itemMapping[ item ];

                    if (index !== undefined) {

                        me.select(index);
                        return false;

                    }

                });

            },
            /**
             * 转换记录栈
             */
            _transStack: function (options) {

                var temp = [],
                    itemIndex = -1,
                    selected = -1;

                $.each(options.recordStack, function (index, item) {

                    itemIndex = options.itemMapping[ item ];

                    if ($.isNumeric(itemIndex)) {

                        temp.push(itemIndex);

                        //selected的合法性检测
                        if (item == options.selected) {
                            selected = itemIndex;
                        }

                    }

                });

                options.recordStack = temp;
                options.selected = selected;
                temp = null;

            },
            _optionAdaptation: function (options) {

                if (!( 'itemStyles' in options )) {

                    options.itemStyles = [];

                    for (var i = 0, len = options.items.length; i < len; i++) {
                        options.itemStyles.push('');
                    }

                }

                options.autowidthitem = options.autowidthitem || options.items;
                options.itemCount = options.items.length;

                return options;

            },
            _createItemMapping: function (stackItem, items) {

                var temp = {},
                    result = {
                        recordStack: [],
                        mapping: {}
                    };

                $.each(items, function (index, item) {
                    temp[ item ] = index;
                });

                result.itemMapping = temp;

                $.each(stackItem, function (index, item) {

                    if (temp[ item ] !== undefined) {
                        result.recordStack.push(temp[ item ]);
                        result.mapping[ item ] = temp[ item ];
                    }

                });

                return result;

            },
            _update: function (index) {

                var options = this.data("options"),
                    newStack = [],
                    newChilds = null;

                $.each(options.recordStack, function (i, item) {

                    if (item != index) {
                        newStack.push(item);
                    }

                });

                //压入最新的记录
                newStack.unshift(index);

                if (newStack.length > options.recordCount) {
                    newStack.length = options.recordCount;
                }

                options.recordStack = newStack;
                options.selected = index;

                newChilds = $($.parseTmpl(this.tpl, options));

                //重新渲染
                this.root().html(newChilds.html());

                newChilds = null;
                newStack = null;

            }
        };

    })(), 'menu');

})();


/*modal 类*/
UF.ui.define('modal', {
    tpl: '<div class="ufui-modal" tabindex="-1" >' +
        '<div class="ufui-modal-header">' +
        '<div class="ufui-close" data-hide="modal"></div>' +
        '<h3 class="ufui-title"><%=title%></h3>' +
        '</div>' +
        '<div class="ufui-modal-body"  style="<%if(width){%>width:<%=width%>px;<%}%>' +
        '<%if(height){%>height:<%=height%>px;<%}%>">' +
        ' </div>' +
        '<% if(cancellabel || oklabel) {%>' +
        '<div class="ufui-modal-footer">' +
        '<div class="ufui-modal-tip"></div>' +
        '<%if(oklabel){%><div class="ufui-btn ufui-btn-primary" data-ok="modal"><%=oklabel%></div><%}%>' +
        '<%if(cancellabel){%><div class="ufui-btn" data-hide="modal"><%=cancellabel%></div><%}%>' +
        '</div>' +
        '<%}%></div>',
    defaultOpt: {
        title: "",
        cancellabel: "",
        oklabel: "",
        width: '',
        height: '',
        backdrop: true,
        keyboard: true
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options || {})));

        me.data("options", options);
        if (options.okFn) {
            me.on('ok', $.proxy(options.okFn, me));
        }
        if (options.cancelFn) {
            me.on('beforehide', $.proxy(options.cancelFn, me));
        }

        me.root().delegate('[data-hide="modal"]', 'click', $.proxy(me.hide, me))
            .delegate('[data-ok="modal"]', 'click', $.proxy(me.ok, me));

        $('[data-hide="modal"],[data-ok="modal"]', me.root()).hover(function () {
            $(this).toggleClass('ufui-hover');
        });
    },
    toggle: function () {
        var me = this;
        return me[!me.data("isShown") ? 'show' : 'hide']();
    },
    show: function () {

        var me = this;

        me.trigger("beforeshow");

        if (me.data("isShown")) return;

        me.data("isShown", true);

        me.escape();

        me.backdrop(function () {
            me.autoCenter();
            me.root()
                .show()
                .focus()
                .trigger('aftershow');
        });
    },
    showTip: function (text) {
        $('.ufui-modal-tip', this.root()).html(text).fadeIn();
    },
    hideTip: function (text) {
        $('.ufui-modal-tip', this.root()).fadeOut(function () {
            $(this).html('');
        });
    },
    autoCenter: function () {
        //ie6下不用处理了
        if(!$.IE6) {
            /* 调整宽度 */
            this.root().css("margin-left", -(this.root().width() / 2));
            /* 调整高度 */
            this.root().css("margin-top", -(this.root().height() / 2));
        }
    },
    hide: function () {
        var me = this;

        me.trigger("beforehide");

        if (!me.data("isShown")) return;

        me.data("isShown", false);

        me.escape();

        me.hideModal();
    },
    escape: function () {
        var me = this;
        if (me.data("isShown") && me.data("options").keyboard) {
            me.root().on('keyup', function (e) {
                e.which == 27 && me.hide();
            });
        }
        else if (!me.data("isShown")) {
            me.root().off('keyup');
        }
    },
    hideModal: function () {
        var me = this;
        me.root().hide();
        me.backdrop(function () {
            me.removeBackdrop();
            me.trigger('afterhide');
        });
    },
    removeBackdrop: function () {
        this.$backdrop && this.$backdrop.remove();
        this.$backdrop = null;
    },
    backdrop: function (callback) {
        var me = this;
        if (me.data("isShown") && me.data("options").backdrop) {
            me.$backdrop = $('<div class="ufui-modal-backdrop" />').click(
                me.data("options").backdrop == 'static' ?
                    $.proxy(me.root()[0].focus, me.root()[0])
                    : $.proxy(me.hide, me)
            );
        }
        me.trigger('afterbackdrop');
        callback && callback();

    },
    attachTo: function ($obj) {
        var me = this;
        if (!$obj.data('$mergeObj')) {

            $obj.data('$mergeObj', me.root());
            $obj.on('click', function () {
                me.toggle($obj);
            });
            me.data('$mergeObj', $obj);
        }
    },
    ok: function () {
        var me = this;
        me.trigger('beforeok');
        if (me.trigger("ok", me) === false) {
            return;
        }
        me.hide();
    },
    getBodyContainer: function () {
        return this.root().find('.ufui-modal-body');
    }
});



//scale 类
UF.ui.define('scale', {
    tpl: '<div class="ufui-scale" unselectable="on">' +
        '<span class="ufui-scale-hand0"></span>' +
        '<span class="ufui-scale-hand1"></span>' +
        '<span class="ufui-scale-hand2"></span>' +
        '<span class="ufui-scale-hand3"></span>' +
        '<span class="ufui-scale-hand4"></span>' +
        '<span class="ufui-scale-hand5"></span>' +
        '<span class="ufui-scale-hand6"></span>' +
        '<span class="ufui-scale-hand7"></span>' +
        '</div>',
    defaultOpt: {
        $doc: $(document),
        $wrap: $(document)
    },
    init: function (options) {
        if (options.$doc) this.defaultOpt.$doc = options.$doc;
        if (options.$wrap) this.defaultOpt.$wrap = options.$wrap;
        this.root($($.parseTmpl(this.tpl, options)));
        this.initStyle();
        this.startPos = this.prePos = {x: 0, y: 0};
        this.dragId = -1;
        return this;
    },
    initStyle: function () {
        utils.cssRule('ufui-style-scale', '.ufui-scale{display:none;position:absolute;border:1px solid #38B2CE;cursor:hand;}' +
            '.ufui-scale span{position:absolute;left:0;top:0;width:7px;height:7px;overflow:hidden;font-size:0px;display:block;background-color:#3C9DD0;}' +
            '.ufui-scale .ufui-scale-hand0{cursor:nw-resize;top:0;margin-top:-4px;left:0;margin-left:-4px;}' +
            '.ufui-scale .ufui-scale-hand1{cursor:n-resize;top:0;margin-top:-4px;left:50%;margin-left:-4px;}' +
            '.ufui-scale .ufui-scale-hand2{cursor:ne-resize;top:0;margin-top:-4px;left:100%;margin-left:-3px;}' +
            '.ufui-scale .ufui-scale-hand3{cursor:w-resize;top:50%;margin-top:-4px;left:0;margin-left:-4px;}' +
            '.ufui-scale .ufui-scale-hand4{cursor:e-resize;top:50%;margin-top:-4px;left:100%;margin-left:-3px;}' +
            '.ufui-scale .ufui-scale-hand5{cursor:sw-resize;top:100%;margin-top:-3px;left:0;margin-left:-4px;}' +
            '.ufui-scale .ufui-scale-hand6{cursor:s-resize;top:100%;margin-top:-3px;left:50%;margin-left:-4px;}' +
            '.ufui-scale .ufui-scale-hand7{cursor:se-resize;top:100%;margin-top:-3px;left:100%;margin-left:-3px;}');
    },
    _eventHandler: function (e) {
        var me = this,
            $doc = me.defaultOpt.$doc;
        switch (e.type) {
            case 'mousedown':
                var hand = e.target || e.srcElement;
                if (hand.className.indexOf('ufui-scale-hand') != -1) {
                    me.dragId = hand.className.slice(-1);
                    me.startPos.x = me.prePos.x = e.clientX;
                    me.startPos.y = me.prePos.y = e.clientY;
                    $doc.bind('mousemove', $.proxy(me._eventHandler, me));
                }
                break;
            case 'mousemove':
                if (me.dragId != -1) {
                    me.updateContainerStyle(me.dragId, {x: e.clientX - me.prePos.x, y: e.clientY - me.prePos.y});
                    me.prePos.x = e.clientX;
                    me.prePos.y = e.clientY;
                    me.updateTargetElement();
                }
                break;
            case 'mouseup':
                if (me.dragId != -1) {
                    me.dragId = -1;
                    me.updateTargetElement();
                    var $target = me.data('$scaleTarget');
                    if ($target.parent()) me.attachTo(me.data('$scaleTarget'));
                }
                $doc.unbind('mousemove', $.proxy(me._eventHandler, me));
                break;
            default:
                break;
        }
    },
    updateTargetElement: function () {
        var me = this,
            $root = me.root(),
            $target = me.data('$scaleTarget');
        $target.css({width: $root.width(), height: $root.height()});
        me.attachTo($target);
    },
    updateContainerStyle: function (dir, offset) {
        var me = this,
            $dom = me.root(),
            tmp,
            rect = [
                //[left, top, width, height]
                [0, 0, -1, -1],
                [0, 0, 0, -1],
                [0, 0, 1, -1],
                [0, 0, -1, 0],
                [0, 0, 1, 0],
                [0, 0, -1, 1],
                [0, 0, 0, 1],
                [0, 0, 1, 1]
            ];

        if (rect[dir][0] != 0) {
            tmp = parseInt($dom.offset().left) + offset.x;
            $dom.css('left', me._validScaledProp('left', tmp));
        }
        if (rect[dir][1] != 0) {
            tmp = parseInt($dom.offset().top) + offset.y;
            $dom.css('top', me._validScaledProp('top', tmp));
        }
        if (rect[dir][2] != 0) {
            tmp = $dom.width() + rect[dir][2] * offset.x;
            $dom.css('width', me._validScaledProp('width', tmp));
        }
        if (rect[dir][3] != 0) {
            tmp = $dom.height() + rect[dir][3] * offset.y;
            $dom.css('height', me._validScaledProp('height', tmp));
        }
    },
    _validScaledProp: function (prop, value) {
        var $ele = this.root(),
            $wrap = this.defaultOpt.$doc,
            calc = function (val, a, b) {
                return (val + a) > b ? b - a : value;
            };

        value = isNaN(value) ? 0 : value;
        switch (prop) {
            case 'left':
                return value < 0 ? 0 : calc(value, $ele.width(), $wrap.width());
            case 'top':
                return value < 0 ? 0 : calc(value, $ele.height(), $wrap.height());
            case 'width':
                return value <= 0 ? 1 : calc(value, $ele.offset().left, $wrap.width());
            case 'height':
                return value <= 0 ? 1 : calc(value, $ele.offset().top, $wrap.height());
        }
    },
    show: function ($obj) {
        var me = this;
        if ($obj) me.attachTo($obj);
        me.root().bind('mousedown', $.proxy(me._eventHandler, me));
        me.defaultOpt.$doc.bind('mouseup', $.proxy(me._eventHandler, me));
        me.root().show();
        me.trigger("aftershow");
    },
    hide: function () {
        var me = this;
        me.root().unbind('mousedown', $.proxy(me._eventHandler, me));
        me.defaultOpt.$doc.unbind('mouseup', $.proxy(me._eventHandler, me));
        me.root().hide();
        me.trigger('afterhide');
    },
    attachTo: function ($obj) {
        var me = this,
            imgPos = $obj.offset(),
            $root = me.root(),
            $wrap = me.defaultOpt.$wrap,
            posObj = $wrap.offset();

        me.data('$scaleTarget', $obj);
        me.root().css({
            position: 'absolute',
            width: $obj.width(),
            height: $obj.height(),
            left: imgPos.left - posObj.left - parseInt($wrap.css('border-left-width')) - parseInt($root.css('border-left-width')),
            top: imgPos.top - posObj.top - parseInt($wrap.css('border-top-width')) - parseInt($root.css('border-top-width'))
        });
    },
    getScaleTarget: function () {
        return this.data('$scaleTarget')[0];
    }
});

//splitbutton 类
///import button
UF.ui.define('splitbutton', {
    tpl: '<div class="ufui-splitbutton <%if (name){%>ufui-splitbutton-<%= name %><%}%>"  unselectable="on" <%if(title){%>data-original-title="<%=title%>"<%}%>><div class="ufui-btn"  unselectable="on" ><%if(icon){%><div  unselectable="on" class="ufui-icon-<%=icon%> ufui-icon"></div><%}%><%if(text){%><%=text%><%}%></div>' +
        '<div  unselectable="on" class="ufui-btn ufui-dropdown-toggle" >' +
        '<div  unselectable="on" class="ufui-caret"><\/div>' +
        '</div>' +
        '</div>',
    defaultOpt: {
        text: '',
        title: '',
        click: function () {
        }
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        me.root().find('.ufui-btn:first').click(function (evt) {
            if (!me.disabled()) {
                $.proxy(options.click, me)();
            }
        });
        me.root().find('.ufui-dropdown-toggle').click(function () {
            if (!me.disabled()) {
                me.trigger('arrowclick');
            }
        });
        me.root().hover(function () {
            if (!me.root().hasClass("ufui-disabled")) {
                me.root().toggleClass('ufui-hover');
            }
        });

        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            $.proxy(fn, this, evt)();
        }
        return this;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state).find('.ufui-btn').toggleClass('ufui-disabled', state);
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state).find('.ufui-btn:first').toggleClass('ufui-active', state);
        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.ufui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.root().delegate('.ufui-dropdown-toggle', 'click', function () {
            me.wrapclick(function () {
                $obj.ufui().show();
            });
        });
        me.register('click', me.root().find('.ufui-dropdown-toggle'), function (evt) {
            $obj.hide();
        });
    }
});

/*tooltip 类*/
UF.ui.define('tooltip', {
    tpl: '<div class="ufui-tooltip" unselectable="on" onmousedown="return false"><div class="ufui-tooltip-arrow" unselectable="on" onmousedown="return false"></div><div class="ufui-tooltip-inner" unselectable="on" onmousedown="return false"></div></div>',
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options || {})));
    },
    content: function (e) {
        var me = this,
            title = $(e.currentTarget).attr("data-original-title");

        me.root().find('.ufui-tooltip-inner').text(title);
    },
    position: function (e) {
        var me = this,
            $obj = $(e.currentTarget);

        me.root().css($.extend({display: 'block'}, $obj ? {
            top: $obj.outerHeight(),
            left: (($obj.outerWidth() - me.root().outerWidth()) / 2)
        } : {}));
    },
    show: function (e) {
        if ($(e.currentTarget).hasClass('ufui-disabled')) return;

        var me = this;
        me.content(e);
        me.root().appendTo($(e.currentTarget));
        me.position(e);
        me.root().css('display', 'block');
    },
    hide: function () {
        var me = this;
        me.root().css('display', 'none');
    },
    attachTo: function ($obj) {
        var me = this;

        function tmp($obj) {
            var me = this;

            if (!$.contains(document.body, me.root()[0])) {
                me.root().appendTo($obj);
            }

            me.data('tooltip', me.root());

            $obj.each(function () {
                if ($(this).attr("data-original-title")) {
                    $(this).on('mouseenter', $.proxy(me.show, me))
                        .on('mouseleave click', $.proxy(me.hide, me));

                }
            });

        }

        if ($.type($obj) === "undefined") {
            $("[data-original-title]").each(function (i, el) {
                tmp.call(me, $(el));
            });

        } else {
            if (!$obj.data('tooltip')) {
                tmp.call(me, $obj);
            }
        }
    }
});


/**
 * Combox 抽象基类
 * User: hn
 * Date: 13-5-29
 * Time: 下午8:01
 * To change this template use File | Settings | File Templates.
 */

(function () {

    var widgetName = 'buttoncombobox';

    UF.ui.define(widgetName, (function () {

        return {
            defaultOpt: {
                //按钮初始文字
                label: '',
                title: ''
            },
            init: function (options) {

                var me = this;

                var btnWidget = $.ufuibutton({
                    caret: true,
                    name: options.comboboxName,
                    title: options.title,
                    text: options.label,
                    click: function () {
                        me.show(this.root());
                    }
                });

                me.supper.init.call(me, options);

                //监听change， 改变button显示内容
                me.on('changebefore', function (e, label) {
                    btnWidget.ufuibutton('label', label);
                });

                me.data('button', btnWidget);

                me.attachTo(btnWidget);

            },
            button: function () {
                return this.data('button');
            }
        };

    })(), 'combobox');

})();


//dropmenu 类
UF.ui.define('dropmenu', {
    tmpl: '<ul class="ufui-dropdown-menu" aria-labelledby="dropdownMenu" >' +
        '<%for(var i=0,ci;ci=data[i++];){%>' +
        '<%if(ci.divider){%><li class="ufui-divider"></li><%}else{%>' +
        '<li <%if(ci.active||ci.disabled){%>class="<%= ci.active|| \'\' %> <%=ci.disabled||\'\' %>" <%}%> data-value="<%= ci.value%>">' +
        '<a href="#" tabindex="-1"><em class="ufui-dropmenu-checkbox"><i class="ufui-icon-ok"></i></em><%= ci.label%></a>' +
        '</li><%}%>' +
        '<%}%>' +
        '</ul>',
    defaultOpt: {
        data: [],
        click: function () {

        }
    },
    init: function (options) {
        var me = this;
        var eventName = {
            click: 1,
            mouseover: 1,
            mouseout: 1
        };

        this.root($($.parseTmpl(this.tmpl, options))).on('click', 'li[class!="ufui-disabled ufui-divider ufui-dropdown-submenu"]',function (evt) {
            $.proxy(options.click, me, evt, $(this).data('value'), $(this))();
        }).find('li').each(function (i, el) {
                var $this = $(this);
                if (!$this.hasClass("ufui-disabled ufui-divider ufui-dropdown-submenu")) {
                    var data = options.data[i];
                    $.each(eventName, function (k) {
                        data[k] && $this[k](function (evt) {
                            $.proxy(data[k], el)(evt, data, me.root);
                        });
                    });
                }
            });

    },
    disabled: function (cb) {
        $('li[class!=ufui-divider]', this.root()).each(function () {
            var $el = $(this);
            if (cb === true) {
                $el.addClass('ufui-disabled');
            } else if ($.isFunction(cb)) {
                $el.toggleClass('ufui-disabled', cb(li));
            } else {
                $el.removeClass('ufui-disabled');
            }

        });
    },
    val: function (val) {
        var currentVal;
        $('li[class!="ufui-divider ufui-disabled ufui-dropdown-submenu"]', this.root()).each(function () {
            var $el = $(this);
            if (val === undefined) {
                if ($el.find('em.ufui-dropmenu-checked').length) {
                    currentVal = $el.data('value');
                    return false;
                }
            } else {
                $el.find('em').toggleClass('ufui-dropmenu-checked', $el.data('value') == val);
            }
        });
        if (val === undefined) {
            return currentVal;
        }
    },
    addSubmenu: function (label, menu, index) {
        index = index || 0;

        var $list = $('li[class!=ufui-divider]', this.root());
        var $node = $('<li class="ufui-dropdown-submenu"><a tabindex="-1" href="#">' + label + '</a></li>').append(menu);

        if (index >= 0 && index < $list.length) {
            $node.insertBefore($list[index]);
        } else if (index < 0) {
            $node.insertBefore($list[0]);
        } else if (index >= $list.length) {
            $node.appendTo($list);
        }
    }
}, 'menu');

//menu 类
UF.ui.define('menu', {
    show: function ($obj, dir, fnname, topOffset, leftOffset) {

        fnname = fnname || 'position';
        if (this.trigger('beforeshow') === false) {
            return;
        } else {
            this.root().css($.extend({display: 'block'}, $obj ? {
                top: $obj[fnname]().top + ( dir == 'right' ? 0 : $obj.outerHeight()) - (topOffset || 0),
                left: $obj[fnname]().left + (dir == 'right' ? $obj.outerWidth() : 0) - (leftOffset || 0)
            } : {}));
            this.trigger('aftershow');
        }
    },
    hide: function (all) {
        var $parentmenu;
        if (this.trigger('beforehide') === false) {
            return;
        } else {

            if ($parentmenu = this.root().data('parentmenu')) {
                if ($parentmenu.data('parentmenu') || all)
                    $parentmenu.ufui().hide();
            }
            this.root().css('display', 'none');
            this.trigger('afterhide');
        }
    },
    attachTo: function ($obj) {
        var me = this;
        if (!$obj.data('$mergeObj')) {
            $obj.data('$mergeObj', me.root());
            $obj.on('wrapclick', function (evt) {
                me.show();
            });
            me.register('click', $obj, function (evt) {
                me.hide();
            });
            me.data('$mergeObj', $obj);
        }
    }
});

//popup 类
UF.ui.define('popup', {
    tpl: '<div class="ufui-dropdown-menu ufui-popup"' +
        '<%if(!<%=stopprop%>){%>onmousedown="return false"<%}%>' +
        '><div class="ufui-popup-body" unselectable="on" onmousedown="return false"><%=subtpl%></div>' +
        '<div class="ufui-popup-caret"></div>' +
        '</div>',
    defaultOpt: {
        stopprop: false,
        subtpl: '',
        width: '',
        height: ''
    },
    init: function (options) {
        this.root($($.parseTmpl(this.tpl, options)));
        return this;
    },
    mergeTpl: function (data) {
        return $.parseTmpl(this.tpl, {subtpl: data});
    },
    show: function ($obj, posObj) {
        if (!posObj) posObj = {};

        var fnname = posObj.fnname || 'position';
        if (this.trigger('beforeshow') === false) {
            return;
        } else {
            this.root().css($.extend({display: 'block'}, $obj ? {
                top: $obj[fnname]().top + ( posObj.dir == 'right' ? 0 : $obj.outerHeight()) - (posObj.offsetTop || 0),
                left: $obj[fnname]().left + (posObj.dir == 'right' ? $obj.outerWidth() : 0) - (posObj.offsetLeft || 0),
                position: 'absolute'
            } : {}));

            this.root().find('.ufui-popup-caret').css({
                top: posObj.caretTop || 0,
                left: posObj.caretLeft || 0,
                position: 'absolute'
            }).addClass(posObj.caretDir || "up");

        }
        this.trigger("aftershow");
    },
    hide: function () {
        this.root().css('display', 'none');
        this.trigger('afterhide');
    },
    attachTo: function ($obj, posObj) {
        var me = this;
        if (!$obj.data('$mergeObj')) {
            $obj.data('$mergeObj', me.root());
            $obj.on('wrapclick', function (evt) {
                me.show($obj, posObj);
            });
            me.register('click', $obj, function (evt) {
                me.hide();
            });
            me.data('$mergeObj', $obj);
        }
    },
    getBodyContainer: function () {
        return this.root().find(".ufui-popup-body");
    }
});

//button 类
UF.ui.define('separator', {
    tpl: '<div class="ufui-separator" unselectable="on" onmousedown="return false" ></div>',
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        return me;
    }
});

//toolbar 类
(function () {
    UF.ui.define('toolbar', {
        tpl: '<div class="ufui-toolbar"  ><div class="ufui-btn-toolbar" unselectable="on" onmousedown="return false"  ></div></div>',
        init: function () {
            var $root = this.root($(this.tpl));
            this.data('$btnToolbar', $root.find('.ufui-btn-toolbar'));
        },
        appendToBtnmenu: function (data) {
            var $cont = this.data('$btnToolbar');
            data = $.isArray(data) ? data : [data];
            $.each(data, function (i, $item) {
                $cont.append($item);
            });
        }
    });
})();


UF.ui.define('file', {
    tpl: '<div class="ufui-file ufui-file-<%=pers%>" data-path="<%=path%>">' +
        '<div class="ufui-file-icon">' +
        '   <i class="ufui-file-icon-<%=type%>"></i>' +
        '   <span class="ufui-file-pers"></span>' +
        '</div>' +
        '<div class="ufui-file-title"><%=title%></div>' +
        '</div>',
    defaultOpt: {
        type: '',
        title: '',
        path: '',
        pers: 'wr'
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        me.root().find('.ufui-file-title').on('focus blur', function (evt) {
//            console.log(+new Date(), evt.type, evt)
        });
        return me;
    },
    editabled: function (state, callback) {
        var me = this,
            $title = this.root().find('.ufui-file-title');

        if (state === undefined) {
            return $title.attr('contenteditable');
        } else if (!state) {
            $title.removeClass('ufui-file-title-editable').attr('contenteditable', 'false');
            me.renameFlag = false;
        } else {
            if (me.renameFlag) return this;

            var isExit = false,
                finishHandler = function (evt) {
                    callback($title.text());
                    $title.focus().off('blur keydown', renameHandler);
                    me.editabled(false);
                    me.renameFlag = false;
                    evt.preventDefault();
                    return false;
                },
                renameHandler = function (evt) {
                    console.log('---', evt.type, evt.keyCode);
                    if (evt.type == 'blur' && !isExit) {
                        return finishHandler(evt);
                    } else if (evt.type == 'keydown') {
                        if (evt.keyCode == 27) { //Esc取消
                            isExit = true;
                        } else if (evt.keyCode == 13) { //Enter提交
                            return finishHandler(evt);
                        }
                    } else if (evt.type == 'click') {
                        evt.preventDefault();
                        return false;
                    }
                };
            $title.addClass('ufui-file-title-editable').attr('contenteditable', 'true');

            me.renameFlag = true;
            setTimeout(function () {
                $title.focus();
                setTimeout(function () {
                    $title.on('keydown click blur', renameHandler);
                }, 100);
            }, 100);
        }
        return this;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    setTitle: function (title) {
        this.root().find('.ufui-file-title').text(title);
        return this;
    },
    getTitle: function () {
        return this.root().find('.ufui-file-title').text();
    },
    setType: function (type) {
        this.root().find('.ufui-file-icon i').attr('class', 'ufui-file-icon-' + type).attr('style', '');
        return this;
    },
    getType: function () {
        var c = this.root().find('.ufui-file-icon i'),
            m = c.attr('class').match(/ufui-file-icon-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setPath: function (path) {
        this.root().attr('data-path', path);
        return this;
    },
    getPath: function () {
        return this.root().attr('data-path');
    },
    setPers: function (write, read) {
        this.root().addClass('ufui-file-' + (write ? 'w' : 'nw') + ('read' ? 'r' : 'nr'));
        return this;
    },
    getPers: function () {
        var $root = this.root(),
            write = $root.hasClass('ufui-file-w-r') || $root.hasClass('ufui-file-nw-r'),
            read = $root.hasClass('ufui-file-w-r') || $root.hasClass('ufui-file-w-nr');
        return {'write': write, 'read': read};
    },
    setPreviewImg: function (src) {
        var me = this;
        $('<img src="' + src + '" style="display:none;">').appendTo(document.body).on('load', function () {
            var $target = $(this);
            me.root().find('.ufui-file-icon i').css({
                'background-image': 'url("' + src + '")',
                'background-size': $target.width() > $target.height() ? 'auto 100%' : '100% auto',
                'background-position': 'center center',
                'background-repeat': 'no-repeat no-repeat',
                'border-radius': '3px',
                'width': '60px',
                'height': '60px',
                'margin': '10px auto 0 auto'
            });
            $target.remove();
        });
    }
});

UF.ui.define('list', {
    tpl: '<div class="ufui-list">' +
        '<div class="ufui-list-container"></div>' +
        '</div>',
    defaultOpt: {
        sort: 'title'
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options))).append(me.$list);
        me.$list = me.root().find('.ufui-list-container');

        me._ufItems = [];

        return me;
    },
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else if (type1 != type2) {
            return type1 > type2;
        } else {
            return title1 > title2;
        }
    },
    getItem: function (path) {
        for (var i = 0; i < this._ufItems.length; i++) {
            if (this._ufItems[i].getPath() == path) return this._ufItems[i];
        }
        return null;
    },
    getItems: function () {
        return this._ufItems;
    },
    addItem: function (options) {
        var i, $f = $.ufuifile(options), ufFile = $f.ufui();
        for (i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (this._compare(c, ufFile)) break;
        }

        if (i >= this._ufItems.length) {
            this.$list.append($f);
        } else {
            $f.insertBefore(this._ufItems[i].root());
        }
        this._ufItems.splice(i, 0, ufFile);

        return this;
    },
    removeItem: function (path, fadeOutTime) {
        for (var i = 0; i < this._ufItems.length; i++) {
            var c = this._ufItems[i];
            if (c.getPath() == path) {
                this._ufItems.splice(i, 1);
                if (fadeOutTime) {
                    c.active(false).root().fadeOut(fadeOutTime || 0, function () {
                        $(this).remove();
                    });
                } else {
                    c.root().remove();
                }
                break;
            }
        }
        return this;
    },
    clearItems: function () {
        $.each(this._ufItems, function (k, f) {
            f.root().remove();
        });
        this._ufItems = [];
        return this;
    },
    isItemInList: function (path) {
        return this.getItem(path) ? true : false;
    }
});

UF.ui.define('leaf', {
    tpl: '<li class="ufui-leaf" data-path="<%=path%>">' +
        '   <div class="ufui-leaf-detail ufui-leaf-detail-closed">' +
        '       <div class="ufui-leaf-expand"></div>' +
        '       <div class="ufui-leaf-folder"><i class="ufui-leaf-folder-<%=type%>"></i></div>' +
        '       <div class="ufui-leaf-title"><%=title%></div>' +
        '   </div>' +
        '   <ul class="ufui-tree-branch ufui-tree-branch-closed"></ul>' +
        '</li>',
    defaultOpt: {
        type: 'dir',
        title: '',
        path: '/',
        pers: 'wr'
    },
    init: function (options) {
        var me = this;
        options.path = Utils.regularDirPath(options.path);
        me.root($($.parseTmpl(me.tpl, options)));
        var $detail = me.$detail = me.root().children().eq(0);
        me.$branch = me.root().children().eq(1);

        /* 设置展开收起文件夹 */
        $detail.find('.ufui-leaf-expand').on('click', function () {
            if ($detail.hasClass('ufui-leaf-detail-opened')) {
                me.expand(false);
            } else {
                me.expand(true);
            }
        });

        return me;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    expand: function (state) {
        if (state) {
            this.$detail.removeClass('ufui-leaf-detail-closed').addClass('ufui-leaf-detail-opened');
            this.$branch.removeClass('ufui-tree-branch-closed').addClass('ufui-tree-branch-opened');
        } else {
            this.$detail.removeClass('ufui-leaf-detail-opened').addClass('ufui-leaf-detail-closed');
            this.$branch.removeClass('ufui-tree-branch-opened').addClass('ufui-tree-branch-closed');
        }
    },
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else {
            return title1 > title2;
        }
    },
    setPath: function (path) {
        this.root().attr('data-path', Utils.regularDirPath(path));
        return this;
    },
    getPath: function () {
        return this.root().attr('data-path');
    },
    setType: function (type) {
        this.$detail.find('.ufui-leaf-folder i').attr('class', 'ufui-leaf-folder-' + type);
        return this;
    },
    getType: function () {
        var c = this.$detail.find('.ufui-leaf-folder i'),
            m = c.attr('class').match(/ufui-leaf-folder-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setTitle: function (title) {
        this.$detail.find('.ufui-leaf-title').text(title);
        return this;
    },
    getTitle: function () {
        return this.$detail.find('.ufui-leaf-title').text();
    },
    addChild: function (ufLeaf) {
        var children = this.$branch.children();
        for (var i = 0; i < children.length; i++) {
            if (this._compare($(children[i]).ufui(), ufLeaf)) break;
        }
        if (i == 0) {
            this.$branch.prepend(ufLeaf.root());
        } else {
            $(children[i - 1]).after(ufLeaf.root());
        }
        this.expand(true);
        return this;
    },
    removeChild: function ($leaf) {
        $leaf.remove();
        return this;
    },
    getChildren: function () {
        return this.$branch.children();
    }
});

UF.ui.define('tree', {
    tpl: '<div class="ufui-tree">' +
        '<ul class="ufui-tree-branch ufui-tree-branch-root"></ul>' +
        '</div>',
    defaultOpt: {
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options)));
        me.$branch = me.root().find('.ufui-tree-branch');

        me._ufItems = {};

        return me;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    _compare: function (a, b) {
        var type1 = a.getType(),
            type2 = b.getType(),
            title1 = a.getTitle(),
            title2 = b.getTitle();

        if (type1 == 'dir' && type2 != 'dir') {
            return 0;
        } else if (type1 != 'dir' && type2 == 'dir') {
            return 1;
        } else {
            return title1 > title2;
        }
    },
    getItem: function (path) {
        return this._ufItems[Utils.regularDirPath(path)];
    },
    getItems: function () {
        return this._ufItems;
    },
    addItem: function (options) {
        var path = options.path,
            $l = $.ufuileaf(options),
            ufLeaf = $l.ufui(),
            $parent = this.getItem(Utils.getParentPath(path));

        if (!this._ufItems[path]) {
            if ($parent) {
                $parent.addChild(ufLeaf);
            } else {
                this.$branch.append($l);
            }
            this._ufItems[path] = ufLeaf;
        }

        return this;
    },
    setRoot: function (options) {
        options.name = 'Root';

        var $l = $.ufuileaf(options),
            ufLeaf = $l.ufui();

        this.$branch.append($l);
        this._ufItems[options.path] = ufLeaf;
        $l.addClass('ufui-tree-leaf-root');
//        ufLeaf.expand(true);

        return this;
    },
    removeItem: function (path) {
        var me = this;
        path = Utils.regularDirPath(path);
        if (me._ufItems[path]) {
            me._ufItems[path].root().remove();
            delete me._ufItems[path];
        }
        return this;
    },
    clearItems: function () {
        $.each(this._ufItems, function (k, f) {
            f.root().remove();
        });
        this._ufItems = [];
        return this;
    },
    isItemInTree: function (path) {
        return this.getItem(path) ? true : false;
    }
});

UF.ui.define('panel', {
    tpl: '<div class="ufui-panel"  ></div>',
    defaultOpt: {
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        return me;
    }
});

UF.ui.define('message', {
    tpl: '<div class="ufui-message">' +
        '   <div class="ufui-message-head"><div class="ufui-message-close"></div></div>' +
        '   <div class="ufui-message-body">' +
        '       <div class="ufui-message-icon"><i class="ufui-message-icon-<%=icon%>"></i></div>' +
        '       <div class="ufui-message-info">' +
        '           <div class="ufui-message-title"><%=title%></div>' +
        '           <div class="ufui-message-loadbar"><div class="ufui-message-loadbar-percent"></div></div>' +
        '       </div>' +
        '   </div>' +
        '</div>',
    defaultOpt: {
        icon: '',
        title: ''
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        me.root().hide();

        me.$title = me.root().find('.ufui-message-title');
        me.$loadbar = me.root().find('.ufui-message-loadbar');

        //初始化进度
        me.loadedPercent = options.loadedPercent || 0;
        me.setLoadedPercent(me.loadedPercent);

        //设置关闭按钮事件
        me.root().find('.ufui-message-close').on('click', function () {
            me.hide();
        });

        //设置关闭的定时器
        if (options.timeout !== undefined && options.timeout >= 0) {
            me.timer = setTimeout(function () {
                me.hide();
            }, options.timeout);
        }

        return me;
    },
    show: function () {
        return this.root().fadeIn(400);
    },
    hide: function () {
        return this.root().fadeOut(400);
    },
    setIcon: function (icon) {
        this.root().find('.ufui-message-icon i').attr('class', 'ufui-message-icon-' + icon);
        return this;
    },
    getIcon: function () {
        var c = this.root().find('.ufui-message-icon i'),
            m = c.attr('class').match(/ufui-message-icon-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setMessage: function (message) {
        this.$title.text(message);
        return this;
    },
    getMessage: function () {
        return this.$title.text();
    },
    setLoadedPercent: function (percent) {
        this.root().find('.ufui-message-loadbar-percent').css('width', percent + '%');
        return this;
    },
    getLoadedPercent: function () {
        return this.root().find('.ufui-message-loadbar-percent').css('width');
    },
    setTimer: function (timeout) {
        var me = this;
        if (timeout !== undefined) {
            clearTimeout(me.timer);
        }
        if (timeout >= 0) {
            me.timer = setTimeout(function () {
                me.hide();
            }, timeout);
        }
        return this;
    },
    getTimer: function () {
        return this.timer;
    }
});

$.extend(UFinder, (function () {

    var _ufinderUI = {},
        _activeWidget = null,
        _widgetData = {},
        _widgetCallBack = {};

    return {
        registerUI: function (uiname, fn) {
            $.each(uiname.split(/\s+/), function (i, name) {
                _ufinderUI[ name ] = fn;
            });
        },
        _createContainer: function (id) {
            var $container = $('<div class="ufui-container"></div>');
            $(Utils.isString(id) ? '#' + id : id).append($container);
            return $container;
        },
        _createToolbar: function (uf) {
            var toolbars = uf.getOption('toolbars');

            var $toolbar = $.ufuitoolbar();
            uf.$container.append($toolbar);
            uf.$toolbar = $toolbar;

            if (toolbars && toolbars.length) {
                var btns = [];
                $.each(toolbars, function (i, uiNames) {
                    $.each(uiNames.split(/\s+/), function (index, name) {
                        if (name == '|') {
                            $.ufuiseparator && btns.push($.ufuiseparator());
                        } else {
                            if (_ufinderUI[ name ]) {
                                var ui = _ufinderUI[ name ].call(uf, name);
                                ui && btns.push(ui);
                            }
                        }

                    });
                    btns.length && $toolbar.ufui().appendToBtnmenu(btns);
                });
            }
            $toolbar.append($('<div class="ufui-dialog-container"></div>'));
        },
        _createtree: function (uf) {
            var $tree = _ufinderUI['tree'].call(uf, 'list');
            uf.$container.append($tree);
            uf.$tree = $tree;

        },
        _createlist: function (uf) {
            var $list = _ufinderUI['list'].call(uf, 'list');
            uf.$container.append($list);
            uf.$list = $list;
        },
        _createMessageHolder: function (uf) {
            var $messageHolder = $('<div class="ufui-message-list"></div>');
            uf.$container.append($messageHolder);
            uf.$messageHolder = $messageHolder;

            var _messages = {};

            uf.on('showmessage', function (type, p) {
                var $message = _ufinderUI['message'].call(uf, 'message', {
                    icon: p.icon || 'warning',
                    title: p.title || '',
                    loadedPercent: p.loadedPercent || 100,
                    timeout: p.timeout,
                    id: p.id || 'm' + (+new Date()).toString(36)
                });
                if (p.id) {
                    _messages[p.id] = $message;
                }
                $messageHolder.append($message);
                $message.ufui().show();
            });
            uf.on('updatemessage', function (type, p) {
                var $message;
                if (p.id && ($message = _messages[p.id])) {
                    $message.ufui().setIcon(p.icon).setMessage(p.title).setTimer(p.timeout).setLoadedPercent(p.loadedPercent);
                }
            });
            uf.on('hidemessage', function (type, p) {
                var $message;
                if (($message = _messages[p.id])) {
                    $message.ufui().hide();
                }
            });
        },
        getUFinder: function (id, options) {
            var $container = this._createContainer(id),
                uf = this.getFinder($container, options);

            uf.$container = $container;
            uf.on('focus',function () {
                $container.removeClass('ufui-disabled');
            }).on('blur', function () {
                    $container.addClass('ufui-disabled');
                });

            this._createToolbar(uf);
            this._createtree(uf);
            this._createlist(uf);
            this._createMessageHolder(uf);

            uf._initDomEvent();
            uf.fire('ready');
            return uf;
        },
        delUFinder: function (id) {
        },
        registerWidget: function (name, pro, cb) {
            _widgetData[name] = $.extend2(pro, {
                $root: '',
                _preventDefault: false,
                root: function ($el) {
                    return this.$root || (this.$root = $el);
                },
                preventDefault: function () {
                    this._preventDefault = true;
                },
                clear: false
            });
            if (cb) {
                _widgetCallBack[name] = cb;
            }
        },
        getWidgetData: function (name) {
            return _widgetData[name];
        },
        setWidgetBody: function (name, $widget, finder) {
            if (!finder._widgetData) {
                Utils.extend(finder, {
                    _widgetData: {},
                    getWidgetData: function (name) {
                        return this._widgetData[name];
                    },
                    getWidgetCallback: function (widgetName) {
                        var me = this;
                        return function () {
                            return  _widgetCallBack[widgetName].apply(me, [me, $widget].concat(Array.prototype.slice.call(arguments, 0)));
                        };
                    }
                });

            }
            var pro = _widgetData[name];
            if (!pro) {
                return null;
            }
            pro = finder._widgetData[name];
            if (!pro) {
                pro = _widgetData[name];
                pro = finder._widgetData[name] = $.type(pro) == 'function' ? pro : Utils.clone(pro);
            }

            pro.root($widget.ufui().getBodyContainer());

            pro.initContent(finder, $widget);
            if (!pro._preventDefault) {
                pro.initEvent(finder, $widget);
            }

            pro.width && $widget.width(pro.width);

        },
        createEditor: function (id, opt) {
        },
        createToolbar: function (options, editor) {
        }
    };
})());

UF.registerUI('open pathparent pathbackward pathforward touch mkdir rename remove',
    function (name) {
        var me = this;
        var $btn = $.ufuibutton({
            icon: name,
            click: function (evt) {
                me.execCommand(name);
                evt.preventDefault();
                return false;
            },
            title: me.getLang('labelMap')[name] || ''
        });

        me.on('selectionchange ready focus blur currentpathchange', function () {
            var state = me.queryCommandState(name);
            $btn.ufui().disabled(state == -1).active(state == 1);
        });
        return $btn;
    }
);



UF.registerUI('list',

    function (name) {
        var me = this,
            $list = $.ufuilist(),
            ufList = $list.ufui(),
            $preCliskFile,
            singleClickTimer,
            singleClickTarget,
            addFile = function (filelist) {
                var currentPath = me.getCurrentPath();
                $.each($.isArray(filelist) ? filelist : [filelist], function (k, file) {
                    if (Utils.getParentPath(file.path) == currentPath) {
                        var type = Utils.getPathExt(file.path);
                        ufList.addItem({
                            type: file.type == 'dir' ? 'dir' : type,
                            title: file.name,
                            path: file.path,
                            pers: (file.write ? 'w' : 'nw') + (file.read ? 'r' : 'nr')
                        });

                        if (Utils.isImagePath(file.path)) {
                            var realPath = me.getRealPath(file.path);
                            ufList.getItem(file.path).setPreviewImg(realPath);
                        }
                    }
                });
            },
            getPathsFormView = function () {
                var paths = [];
                $list.find('.ufui-file.ufui-active').each(function (i, item) {
                    paths.push($(item).attr('data-path'));
                });
                return paths;
            },
            updateSelection = function () {
                me.setSelectedFiles(getPathsFormView());
            },
            clearAllSelectedFiles = function ($except) {
                $list.find('.ufui-file').not($except).each(function () {
                    $(this).ufui().active(false);
                });
            };

        /* 双击文件 */
        $list.delegate('.ufui-file', 'dblclick', function (e) {
            var ufFile = $(this).ufui(),
                path = ufFile.getPath();
            if (ufFile.getType() == 'dir') {
                var file = me.dataTree.getFileInfo(path);
                if (file.read && !file.locked) {
                    me.execCommand('open', path);
                }
            } else {
                if (Utils.isImagePath(path)) {
                    me.execCommand('lookimage', path);
                } else if (Utils.isCodePath(path)) {
                    me.execCommand('lookcode', path);
                } else if (Utils.isWebPagePath(path)) {
                } else {
                    me.execCommand('download', path);
                }
            }
        });

        /* 点击选文件 */
        $list.delegate('.ufui-file', 'click', function (e) {

            /* 解决双击单个文件时,不选中问题 */
            if(singleClickTimer && singleClickTarget == e.target && !(e.shiftKey || e.ctrlKey || e.metaKey)) {
                return;
            } else {
                singleClickTimer = setTimeout(function(){
                    singleClickTimer = 0;
                }, 500);
                singleClickTarget = e.target;
            }

            var $file = $(this);
            /* 点击选中文件 */
            var ufFile = $(this).ufui(),
                state = ufFile.active();

            if (e.shiftKey && $preCliskFile) {
                /* 按住shift,直点击文件 */
                var $start, $end, $current, endIndex;
                if ($file.index() > $preCliskFile.index()) {
                    $start = $preCliskFile;
                    $end = $file;
                } else {
                    $start = $file;
                    $end = $preCliskFile;
                }
                endIndex = $end.index();

                $current = $start;
                while ($current.length) {
                    $current.ufui().active(true);
                    $current = $current.next();
                    if ($current.index() > endIndex) break;
                }
                updateSelection();
            } else if (e.ctrlKey || e.metaKey) {
                /* 按住ctrl,直点击文件 */
                ufFile.active(!state);

                !state && ($preCliskFile = $file);
                updateSelection();
            } else {

                /* 直接点击文件 */
                if ((!state && getPathsFormView().length > 0) || (state && getPathsFormView().length > 1)) {
                    clearAllSelectedFiles($file);
                    ufFile.active(true);
                } else {
                    ufFile.active(!state);
                }

                ufFile.active() && ($preCliskFile = $file);
                updateSelection();
            }
        });

        /* 去除选区 */
        $list.on('click', function (e) {
            var target = e.target || e.srcElement;
            if (target && target == $list.children()[0]) {
                clearAllSelectedFiles();
                updateSelection();
            }
        });

        /* 目录改变 */
        me.on('currentPathChange', function (type, path) {
            if ($list.attr('data-path') != path) {
                $list.attr('data-path', path);
                ufList.clearItems();
                addFile(me.dataTree.listDirFileInfo(path));
            }
        });


        /* 新增文件 */
        me.on('addFiles', function (type, files) {
            addFile(files);
        });

        /* 重命名文件 */
        me.on('updateFile', function (type, path, info) {
            ufList.isItemInList(path) && ufList.removeItem(path);
            addFile(info);
        });

        /* 删除文件 */
        me.on('removeFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                ufList.isItemInList(path) && ufList.removeItem(path, 300);
            });
        });

        /* 选中文件 */
        me.on('selectFiles', function (type, paths) {
            clearAllSelectedFiles();
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                if (ufFile) {
                    ufFile.active(true);

                    /* 滚动到选中文件 */
//                    var $c = $list.find('.ufui-list-container').scrollTop(ufFile.root().offset().top - 3);
                }
            });
            updateSelection();
        });

        /* 锁文件 */
        me.on('lockFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(true);
            });
        });


        /* 解锁文件 */
        me.on('unlockFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(false);
            });
        });

        /* 文件进入重命名 */
        me.on('renameFileTitle', function (type, path, callback) {
            var ufFile = ufList.getItem(path);
            if (ufFile) {
                ufFile.editabled(true, function (name) {
                    callback(name, function (isSuccess) {
                        /* 重命名失败 */
                        if (!isSuccess) {
                            var file = me.dataTree.getFileInfo(path);
                            if (file) {
                                ufFile.setTitle(file.name);
                            }
                        }
                    });
                });
            }
        });

        /* 进入新建文件 */
        me.on('newFileTitle', function (type, filetype, callback) {
            var tmpName = filetype == 'dir' ? '新建文件夹' : '新建文件',
                tmpPath = me.getCurrentPath() + tmpName,
                tmpUfFile;
            addFile({
                type: filetype,
                path: tmpPath,
                name: tmpName,
                read: true,
                write: true
            });
            tmpUfFile = ufList.getItem(tmpPath);
            tmpUfFile.editabled(true, function (name) {
                callback(name, function (isSuccess) {
                    ufList.removeItem(tmpPath);
                });
            });
        });

        return $list;
    }
);


UF.registerUI('message',
    function (name, options) {
        var me = this,
            $message = $.ufuimessage(options),
            request = options.request;

        if (request) {
            $message.find('.ufui-message-loadbar').on('click', function () {
                request.pause();
            });
        }
        return $message;
    }
);


UF.registerUI('tree',
    function (name) {
        var me = this,
            $tree = $.ufuitree(),
            ufTree = $tree.ufui(),
            addItem = function (info) {
                if (info.type == 'dir') {
                    if (!ufTree.isItemInTree(info.path)) {
                        ufTree.addItem({
                            type: info.type,
                            title: info.name,
                            path: info.path
                        });
                    }
                }
            },
            openDir = function (path) {
                var info = me.dataTree.getFileInfo(path);
                if (info.read && !me.dataTree.isFileLocked(path)) {
                    me.execCommand('open', path);
                }
            };

        /* 点击目录执行打开命令 */
        $tree.delegate('.ufui-leaf-expand,.ufui-leaf-folder,.ufui-leaf-title', 'click', function () {
            var $target = $(this),
                $detail = $target.parent(),
                $leaf = $detail.parent(),
                path = $leaf.attr('data-path'),
                info = me.dataTree.getFileInfo(path);
            if (info.read && !me.dataTree.isFileLocked(path)) {
                if ($target.hasClass('ufui-leaf-expand')) {
                    if (!$detail.hasClass('ufui-leaf-detail-closed')) {
                        me.execCommand('list', path);
                    }
                } else {
                    me.execCommand('open', path);
                }
            }
        });

        /* 初始化根节点 */
        me.on('dataReady', function (type, info) {
            ufTree.setRoot({
                type: info.type,
                title: 'Root',
                path: info.path
            });
        });

        /* 打开目录 */
        me.on('listFile', function (type, filelist) {
            $.each(filelist, function (i, file) {
                addItem(file);
            });
        });

        /* 打开目录 */
        me.on('addfiles', function (type, files) {
            $.each($.isArray(files) ? files : [files], function (k, file) {
                addItem(file);
            });
        });

        /* 重命名文件 */
        me.on('renamefile', function (type, path, file) {
            if (file.type != 'dir') return;
            var ufLeaf = ufTree.getItem(path);
            if (ufLeaf) {
                ufTree.removeItem(path);
                addItem(file);
            }
        });

        /* 删除文件 */
        me.on('removefiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                ufTree.isItemInTree(path) && ufTree.removeItem(path);
            });
        });

        return $tree;
    }
);


UF.registerUI('upload',
    function (name) {
        var me = this,
            id = 'ufui-btn-upload-' + (+new Date()).toString(36),
            $btn = $.ufuibutton({
                icon: name,
                click: function () {

                },
                title: me.getLang('labelMap')[name] || ''
            });

        /* 按钮状态反射 */
        me.on('selectionchange ready focus blur currentpathchange', function () {
            var state = me.queryCommandState(name);
            $btn.ufui().disabled(state == -1).active(state == 1);
            if (me.webuploader) {
                state == -1 ? me.webuploader.disable() : me.webuploader.enable();
            }
        });

        $btn.attr('id', id);
        /* 绑定按钮到uploader */
        me.on('initUploader', function () {
            me.webuploader.addButton({
                id: '#' + id
            });
        });
        return $btn;
    }
);

UF.registerUI('lookimage lookcode', function (name) {

    var me = this, $dialog,
        labelMap = me.getOption('labelMap'),
        opt = {
            title: (labelMap && labelMap[name]) || me.getLang("labelMap." + name),
            url: me.getOption('URL') + '/dialogs/' + name + '/' + name + '.js'
        };

    var $btn = $.ufuibutton({
        icon: name,
        title: this.getLang('labelMap')[name] || ''
    });

    /* 加载dialog模版数据 */
    Utils.loadFile(document, {
        src: opt.url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    }, function () {
        /* 调整数据 */
        var data = UF.getWidgetData(name);
        if (data.buttons) {
            var ok = data.buttons.ok;
            if (ok) {
                opt.oklabel = ok.label || me.getLang('ok');
                if (ok.exec) {
                    opt.okFn = function () {
                        return $.proxy(ok.exec, null, me, $dialog)();
                    };
                }
            }
            var cancel = data.buttons.cancel;
            if (cancel) {
                opt.cancellabel = cancel.label || me.getLang('cancel');
                if (cancel.exec) {
                    opt.cancelFn = function () {
                        return $.proxy(cancel.exec, null, me, $dialog)();
                    };
                }
            }
        }
        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $dialog = $.ufuimodal(opt);

        $dialog.attr('id', 'ufui-dialog-' + name).addClass('ufui-dialog-' + name)
            .find('.ufui-modal-body').addClass('ufui-dialog-' + name + '-body');

        $dialog.ufui().on('beforehide',function () {

        }).on('beforeshow',function () {
                var $root = this.root(),
                    win = null,
                    offset = null;
                if (!$root.parent()[0]) {
                    me.$container.find('.ufui-dialog-container').append($root);
                }

                /* IE6下 特殊处理, 通过计算进行定位 */
                if ($.IE6) {

                    win = {
                        width: $(window).width(),
                        height: $(window).height()
                    };
                    offset = $root.parents(".ufui-toolbar")[0].getBoundingClientRect();
                    $root.css({
                        position: 'absolute',
                        margin: 0,
                        left: ( win.width - $root.width() ) / 2 - offset.left,
                        top: 100 - offset.top
                    });

                }
                UF.setWidgetBody(name, $dialog, me);
            }).on('afterbackdrop',function () {
                this.$backdrop.css('zIndex', me.getOption('zIndex') + 1).appendTo(me.$container.find('.ufui-dialog-container'));
                $dialog.css('zIndex', me.getOption('zIndex') + 2);
            }).on('beforeok',function () {

            }).attachTo($btn);
    });

    me.on('selectionchange ready focus blur currentpathchange', function () {
        var state = me.queryCommandState(name);
        $btn.ufui().disabled(state == -1).active(state == 1);
    });
    return $btn;
});


})(jQuery, window);
