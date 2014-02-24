UF.ui.define('message', {
    tpl: '<div class="ufui-message">' +
        '   <div class="ufui-message-head"><div class="ufui-message-close"></div></div>' +
        '   <div class="ufui-message-body">' +
        '       <div class="ufui-message-icon"><i class="ufui-message-icon-<%=icon%>"></i></div>' +
        '       <div class="ufui-message-info">' +
        '           <div class="ufui-message-title"><%=title%></div>' +
        '           <div class="ufui-message-loadbar"><div class="ufui-message-loadbar-percent"></div></div>' +
        '       </div>' +
        '   </div>' +
        '</div>',
    defaultOpt: {
        icon: '',
        title: ''
    },
    init: function (options) {
        var me = this;
        me.root( $($.parseTmpl(me.tpl, options)) );
        me.root().hide();

        me.$title = me.root().find('.ufui-message-title');
        me.$loadbar = me.root().find('.ufui-message-loadbar');

        //初始化进度
        me.loadedPercent = options.loadedPercent || 0;
        me.setLoadedPercent(me.loadedPercent);

        //设置关闭按钮事件
        me.root().find('.ufui-message-close').on('click', function(){
            me.hide();
        });

        //设置关闭的定时器
        if(options.timeout > 0) {
            setTimeout(function(){
                me.hide();
            }, options.timeout);
        }

        return me;
    },
    show: function(){
        return this.root().fadeIn(400);
    },
    hide: function(){
        return this.root().fadeOut(400);
    },
    setIcon: function(icon){
        this.root().find('.ufui-message-icon i').attr('class', 'ufui-message-icon-' + icon);
        return this;
    },
    getIcon: function(){
        var c = this.root().find('.ufui-message-icon i'),
            m = c.attr('class').match(/ufui-message-icon-([\w]+)(\s|$)/);
        return m ? m[1]:null;
    },
    setMessage: function(message){
        this.$title.text(message);
        return this;
    },
    getMessage: function(){
        return this.$title.text();
    },
    setLoadedPercent: function(percent){
        this.root().find('.ufui-message-loadbar-percent').css('width', percent + '%');
        return this;
    },
    getLoadedPercent: function(){
        return this.root().find('.ufui-message-loadbar-percent').css('width');
    }
});