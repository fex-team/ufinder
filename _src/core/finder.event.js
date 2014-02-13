UF.extendClass(Finder, {
    _initEvents: function () {
        this._eventCallbacks = {};
    },
    _resetEvents: function () {
        this._initEvents();
    },
    _listen: function (type, callback) {
        var callbacks = this._eventCallbacks[ type ] || ( this._eventCallbacks[ type ] = [] );
        callbacks.push(callback);
    },
    _fire: function (e) {
        var callbacks = this._eventCallbacks[ e.type.toLowerCase() ];
        if (!callbacks) {
            return false;
        }
        for (var i = 0; i < callbacks.length; i++) {
            callbacks[ i ].call(this, e);
            if (e.shouldStopPropagationImmediately()) {
                break;
            }
        }
        return e.shouldStopPropagation();
    },
    on: function (name, callback) {
        var types = name.split(' ');
        for (var i = 0; i < types.length; i++) {
            this._listen(types[ i ].toLowerCase(), callback);
        }
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
                    if (callbacks[ j ] == callback) {
                        removeIndex = j;
                    }
                }
                if (removeIndex !== null) {
                    callbacks.splice(removeIndex, 1);
                }
            }
        }
    },
    fire: function (type, params) {
        var e = new FinderEvent(type, params);
        this._fire(e);
        return this;
    }
});