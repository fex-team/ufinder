$.extend(UFinder, (function(){

    var _ufinderUI = {},
        _activeWidget = null,
        _widgetData = {},
        _widgetCallBack = {};

    return {
        registerUI: function ( uiname, fn ) {
            $.each( uiname.split( /\s+/ ), function ( i, name ) {
                _ufinderUI[ name ] = fn;
            })
        },
        _createContainer: function (id) {
            var $container = $( '<div class="ufui-container"></div>' );
            $(Utils.isString( id ) ? '#' + id : id ).append( $container );
            return $container;
        },
        _createToolbar: function(uf){
            var toolbars = uf.getOption( 'toolbars' );

            var $toolbar = $.ufuitoolbar();
            uf.$container.append($toolbar);
            uf.$toolbar = $toolbar;

            if ( toolbars && toolbars.length ) {
                var btns = [];
                $.each( toolbars, function ( i, uiNames ) {
                    $.each( uiNames.split( /\s+/ ), function ( index, name ) {
                        if ( name == '|' ) {
                            $.ufuiseparator && btns.push( $.ufuiseparator() );
                        } else {
                            if ( _ufinderUI[ name ] ) {
                                var ui = _ufinderUI[ name ].call( uf, name );
                                ui && btns.push( ui );
                            }

                        }

                    } );
                    btns.length && $toolbar.ufui().appendToBtnmenu( btns );
                } );
            }
            $toolbar.append( $( '<div class="ufui-dialog-container"></div>' ) );
        },
        _createtree: function(uf){
            var $tree = _ufinderUI['tree'].call( uf, 'list' );
            uf.$container.append($tree);
            uf.$tree = $tree;
        },
        _createlist: function(uf){
            var $list = _ufinderUI['list'].call( uf, 'list' );
            uf.$container.append($list);
            uf.$list = $list;
        },
        _CreateMessageHolder: function(uf){
            var $messageHolder = $('<div class="ufui-message-list"></div>');
            uf.$container.append($messageHolder);
            uf.$messageHolder = $messageHolder;

            var _messages = {};

            uf.on('showmessage', function(type, p){
                var $message = _ufinderUI['message'].call( uf, 'message', {
                    icon: p.icon || 'warning',
                    title: p.title || '',
                    loadedPercent: p.loadedPercent || 100,
                    timeout: p.timeout !== undefined ? p.timeout:3000
                });
                if(p.request) {
                    _messages[p.request.id] = $message;
                }
                $messageHolder.prepend($message);
                $message.ufui().show();
            });
            uf.on('updatemessage', function(type, p){
                var $message;
                if(p.request && ($message = _messages[p.request.id])) {
                    $message.ufui().setIcon(p.icon).setTitle(p.title).setLoadedPercent(p.loadedPercent);
                }
            });
            uf.on('hidemessage', function(type, p){
                var $message;
                if(p.request && ($message = _messages[p.request.id])) {
                    $message.ufui().hide();
                }
            });
        },
        _loadData: function(uf){
            uf.execCommand('open', '/');
        },
        getUFinder: function (id, options) {
            var $container = this._createContainer(id),
                uf = this.getFinder( $container, options );

            uf.$container = $container;
            uf._bindshortcutKeys();

            this._createToolbar(uf);
            this._createtree(uf);
            this._createlist(uf);
            this._CreateMessageHolder(uf);

            this._loadData(uf);
            uf.fire('ready');
            return uf;
        },
        delUFinder: function (id) {
        },
        registerWidget: function ( name, pro, cb ) {
        },
        getWidgetData: function ( name ) {
        },
        setWidgetBody: function ( name, $widget, km ) {
        },
        createEditor: function (id, opt) {
        },
        createToolbar: function (options, editor) {
        }
    }
})());