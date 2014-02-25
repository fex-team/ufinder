UF.extendClass(Finder, {
    _initEvents: function () {
        this._eventCallbacks = {};

        var me = this,
            $container = $(me.getOption('renderTo'));

        me._proxyDomEvent = $.proxy(me._proxyDomEvent, me);

        var $keyListener = $('<input class="ufui-key-listener">');
        $container.append( $('<div class="ufui-event-helper"></div>').append($keyListener) );
        $container.append($('<input class="ufui-key-listener">'));

        //键盘事件
        $keyListener
            .on('keydown keyup keypress', me._proxyDomEvent)
            .on('keydown', function (evt) {
                if (evt.ctrlKey || evt.metaKey || evt.shiftKey || evt.altKey) {
                    return;
                }
            });

        //鼠标事件
        $container
            .on('click contextmenu mouseup mousemove mouseover mouseout selectstart', me._proxyDomEvent)
            .on('mouseup', function (evt) {
                if (evt.button == 2) return;
            });

        this._initDomEvent($container, $keyListener);
    },
    _initDomEvent: function ($container, $keyListener) {
        var me = this;
        $container.on('click contextmenu mousedown mouseup selectstart', function(evt){
            var target = evt.target;
            if(target.tagName != 'INPUT' && target.tagName != 'TEXTAREA'
                && target.contenteditable != true) {
                $keyListener.focus();
                me.fire('focus');
            }
        });
        $(document.body).on('click contextmenu mousedown mouseup selectstart', function(evt){
            var $ufContainer = $(evt.target).parent($container);
            if(!$ufContainer.length) {
                me.fire('blur');
                $keyListener.blur();
            }
        });
    },
    _proxyDomEvent: function (evt) {
//        if(evt.type != 'mousemove') console.log(evt.type + ':' + evt.target.className);
//        if(evt.type == 'mouseout') console.log(evt.fromElement, evt.toElement);
        return this.fire(evt.type.replace(/^on/, ''), evt);
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