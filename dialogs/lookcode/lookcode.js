(function () {
    var widgetName = 'lookcode';
    UF.registerWidget(widgetName, {
        tpl: '<div class="ufui-dialog-lookimage-body"></div>',
        initContent: function (finder, $widget) {

            var me = this,
                lang = finder.getLang(widgetName);

            me.finder = finder;
            me.$widget = $widget;

            me.root().html($.parseTmpl(me.tpl, $.extend({}, lang['static'])));

            var path = me.finder.getSelection().getSelectedFile(),
                url = me.finder.serverOption.realRootUrl + path,
                $textWrap = $('<div>').css({
                    'width': me.width - 22,
                    'height': me.height - 22,
                    'border': '1px solid #ccc',
                    'margin': '10px',
                    'overflow-x': 'hidden',
                    'overflow-y': 'scroll'
                }),
                $text = $('<textarea>').css({
                    'min-width': me.width - 32,
                    'min-height': me.height - 32,
                    'border': '0',
                    'margin': '0',
                    'padding': '5px',
                    'overflow-x': 'hidden'
                }).appendTo($textWrap);

            me.root().html('').append($textWrap);
            $.get(url, {}, function(r){
                $text.text(r || '文件内容为空...');
            });
        },
        initEvent: function (editor, $w) {

        },
        reset: function(){
        },
        buttons: {
            ok: {
                exec: function (editor) {
                    var widget = editor.getWidgetData(widgetName);

                    widget.reset();
                }
            },
            cancel: {
                exec: function(editor){
                    editor.getWidgetData(widgetName).reset();
                }
            }
        },
        width: 600,
        height: 400
    });
})();

