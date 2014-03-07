UF.registerUI('lookimage lookcode',function(name){

    var me = this, currentRange, $dialog,
        labelMap = me.getOption('labelMap'),
        opt = {
            title: (labelMap && labelMap[name]) || me.getLang("labelMap." + name),
            url: me.getOption('URL') + '/dialogs/' + name + '/' + name + '.js'
        };

    var $btn = $.ufuibutton({
        icon: name,
        title: this.getLang('labelMap')[name] || ''
    });
    //加载模版数据
    Utils.loadFile(document,{
        src: opt.url,
        tag: "script",
        type: "text/javascript",
        defer: "defer"
    },function(){
        //调整数据
        var data = UF.getWidgetData(name);
        if(data.buttons){
            var ok = data.buttons.ok;
            if(ok){
                opt.oklabel = ok.label || me.getLang('ok');
                if(ok.exec){
                    opt.okFn = function(){
                        return $.proxy(ok.exec,null,me,$dialog)()
                    }
                }
            }
            var cancel = data.buttons.cancel;
            if(cancel){
                opt.cancellabel = cancel.label || me.getLang('cancel');
                if(cancel.exec){
                    opt.cancelFn = function(){
                        return $.proxy(cancel.exec,null,me,$dialog)()
                    }
                }
            }
        }
        data.width && (opt.width = data.width);
        data.height && (opt.height = data.height);

        $dialog = $.ufuimodal(opt);

        $dialog.attr('id', 'ufui-dialog-' + name).addClass('ufui-dialog-' + name)
            .find('.ufui-modal-body').addClass('ufui-dialog-' + name + '-body');

        $dialog.ufui().on('beforehide',function () {

        }).on('beforeshow', function () {
                var $root = this.root(),
                    win = null,
                    offset = null;
                if (!$root.parent()[0]) {
                    me.$container.find('.ufui-dialog-container').append($root);
                }

                //IE6下 特殊处理, 通过计算进行定位
                if( $.IE6 ) {

                    win = {
                        width: $( window ).width(),
                        height: $( window ).height()
                    };
                    offset = $root.parents(".ufui-toolbar")[0].getBoundingClientRect();
                    $root.css({
                        position: 'absolute',
                        margin: 0,
                        left: ( win.width - $root.width() ) / 2 - offset.left,
                        top: 100 - offset.top
                    });

                }
                UF.setWidgetBody(name,$dialog,me);
        }).on('afterbackdrop',function(){
            this.$backdrop.css('zIndex',me.getOption('zIndex')+1).appendTo(me.$container.find('.ufui-dialog-container'))
            $dialog.css('zIndex',me.getOption('zIndex')+2)
        }).on('beforeok',function(){

        }).attachTo($btn)
    });

    me.on('selectionchange ready focus blur currentpathchange', function () {
        var state = me.queryCommandState(name);
        $btn.ufui().disabled(state == -1).active(state == 1);
    });
    return $btn;
});