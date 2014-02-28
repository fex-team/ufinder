//toolbar 类
(function () {
    UF.ui.define('toolbar', {
        tpl: '<div class="ufui-toolbar"  ><div class="ufui-btn-toolbar" unselectable="on" onmousedown="return false"  ></div></div>',
        init: function () {
            var $root = this.root($(this.tpl));
            this.data('$btnToolbar', $root.find('.ufui-btn-toolbar'))
        },
        appendToBtnmenu: function (data) {
            var $cont = this.data('$btnToolbar');
            data = $.isArray(data) ? data : [data];
            $.each(data, function (i, $item) {
                $cont.append($item)
            })
        }
    });
})();
