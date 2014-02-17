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
        _createUI: function (id) {
            var $container = $( '<div class="ufui-container"></div>' ),
                $toolbar = $.ufuitoolbar(),
                $tree = $.ufuitree(),
                $list = $.ufuilist();

            $container.append( $toolbar ).append( $tree ).append( $list );
            $(Utils.isString( id ) ? '#' + id : id ).append( $container );
            return {
                '$container': $container,
                '$toolbar': $toolbar,
                '$tree': $tree,
                '$list': $list
            };
        },
        _createToolbar: function($toolbar, uf){
            var toolbars = uf.getOption( 'toolbars' );
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
        _loadData: function(uf){
            uf.execCommand('open', '/', function(data){
                uf.$tree.ufui().setData(data);
                uf.$list.ufui().setData(data);
            })
        },
        getUFinder: function (id, options) {
            var uis = this._createUI(id),
                uf = this.getFinder( uis.$container, options );

            this._createToolbar( uis.$toolbar, uf );
            uf.$container = uis.$container;
            uf.$tree = uis.$tree;
            uf.$list = uis.$list;

            this._loadData(uf);
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