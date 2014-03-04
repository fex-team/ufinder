UF.extendClass(Finder, {
    _initEvents: function () {
        this._eventCallbacks = {};
    },
    _initDomEvent: function () {
        var me = this,
            $container = me.$container;
        $keyListener = $('<input class="ufui-key-listener">');

        $container.append($('<div class="ufui-event-helper" style="position:absolute;left:0;top:0;height:0;width:0;overflow: hidden;"></div>').append($keyListener));
        me._proxyDomEvent = $.proxy(me._proxyDomEvent, me);

        /* 点击事件触发隐藏域聚焦,用于捕获键盘事件 */
        me._initKeyListener($container, $keyListener);

        /* 键盘事件 */
        $keyListener.on('keydown keyup keypress', me._proxyDomEvent);

        /* 鼠标事件 */
        $container.on('click contextmenu mouseup mousemove mouseover mouseout selectstart', me._proxyDomEvent);

    },
    _proxyDomEvent: function (evt) {
//        if(['mouseover', 'mousemove', 'mouseout'].indexOf(evt.type)==-1) console.log(evt.type);
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
        $container.on('click mousedown', function (evt) {
            var target = evt.target;
            if (target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'
                && target.contenteditable != true) {
                $keyListener.focus();
                me.isFocused == false && me.setFocus();
            }
        });
        /* 点击document除掉当前ufinder的位置,让ufinder失去焦点 */
        $(document).on('click mousedown', function (evt) {
            /* 忽略代码触发的点击事件 */
            if (evt.originalEvent) {
                var $ufContainer = $(evt.originalEvent.target).parents('.ufui-container');
                if ($ufContainer[0] != $container[0]) {
                    $keyListener.focus();
                    me.isFocused == true && me.setBlur();
                }
            }
        });
        me.on('afterexeccommand', function () {
            $keyListener.focus();
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
        return this;
    }
});