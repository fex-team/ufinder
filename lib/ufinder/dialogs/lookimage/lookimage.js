(function () {
    var widgetName = 'lookimage';
    UF.registerWidget(widgetName, {
        tpl: '<div class="ufui-dialog-lookimage-body"></div>',
        initContent: function (finder, $widget) {

            var me = this,
                lang = finder.getLang(widgetName);

            me.finder = finder;
            me.$widget = $widget;

            me.root().html($.parseTmpl(me.tpl, $.extend({}, lang['static'])));

            var src, $img, path = me.finder.getSelection().getSelectedFile();
            if(path && UF.Utils.isImagePath(path)) {
                src = me.finder.serverOption.realRootUrl + path;
                $img = $('<img src="' + src + '" width="100%" />').on('load', function(){
                    var $target = $(this),
                        width = $target.width(),
                        height = $target.height();
                    me.root().height(me.width * height / width);
                    me.$widget.ufui().autoCenter();
                }).on('click', function(){
                    me.finder.getWidgetData(widgetName).reset();
                    return false;
                });
                me.root().html('').css('over-flow', 'hidden').height(me.height).append($img);
            }
        },
        reset: function(){
            this.$widget.ufui().hide();
        },
        initEvent: function (editor, $w) {
        },
        buttons: {},
        width: 700,
        height: 300
    });
})();

