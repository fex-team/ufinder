UF.extendClass(Finder, {
    _initEvents: function () {
        this._eventCallbacks = {};
    },
    _initDomEvent: function () {
        var me = this,
            $container = me.$container;

        me._proxyDomEvent = $.proxy(me._proxyDomEvent, me);

        me._$keyListener = $('<input class="ufui-key-listener">');
        $container.append( $('<div class="ufui-event-helper" style="position:absolute;left:0;top:0;height:0;width:0;overflow: hidden;"></div>').append(me._$keyListener) );

        /* 键盘事件 */
        me._$keyListener.on('keydown keyup keypress', me._proxyDomEvent);

        /* 鼠标事件 */
        $container.on('click contextmenu mouseup mousemove mouseover mouseout selectstart', me._proxyDomEvent);

        /* 点击事件触发隐藏域聚焦,用于捕获键盘事件 */
        this._initKeyListener($container, me._$keyListener);
    },
    _proxyDomEvent: function (evt) {
        var me = this,
            $target = $(evt.originalEvent.target);
        $.each(['tree', 'list', 'toolbar'], function(k, p){
            if( $target[0] == me['$'+p][0] || $target.parents('.ufui-' + p)[0] == me['$'+p][0] ) {
                me.fire( p + '.' + evt.type.replace(/^on/, ''), evt);
            }
        });
        return this.fire(evt.type.replace(/^on/, ''), evt);
    },
    _initKeyListener: function($container, $keyListener){
        var me = this;
        $container.on('click mousedown', function(evt){
            var target = evt.target;
            if(target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'
                && target.contenteditable != true && me.isFocused == false) {
                me.setFocus();
            }
        });
        $(document).on('click mousedown', function(evt){
            var $ufContainer = $(evt.originalEvent.target).parents('.ufui-container');
            if($ufContainer[0] != $container[0] && me.isFocused == true) {
                me.setBlur();
            }
        });
        this.on('focus blur', function(type, evt){
            console.log(type);
        });
    },
    setFocus: function(){
        this.isFocused = true;
        this._$keyListener.focus();
        this.fire('focus');
    },
    setBlur: function(){
        this.isFocused = false;
        this._$keyListener.blur();
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
            handler = function(){
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
            return false;
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