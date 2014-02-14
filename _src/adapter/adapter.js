$.extend(UFinder, function(){

    var _editorUI = {},
        _activeWidget = null,
        _widgetData = {},
        _widgetCallBack = {};

    return {
        registerUI: function ( uiname, fn ) {
            utils.each( uiname.split( /\s+/ ), function ( i, name ) {
                _ufinderUI[ name ] = fn;
            })
        },
        getUFinder: function (id, options) {
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
        createUI: function (id, editor) {
        },
        createToolbar: function (options, editor) {
        }
    }
});