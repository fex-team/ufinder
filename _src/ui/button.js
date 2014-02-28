//button 类
UF.ui.define('button', {
    tpl: '<<%if(!texttype){%>div class="ufui-btn ufui-btn-<%=icon%> <%if(name){%>ufui-btn-name-<%=name%><%}%>" unselectable="on" onmousedown="return false" <%}else{%>a class="ufui-text-btn"<%}%><% if(title) {%>title="<%=title%>" data-original-title="<%=title%>" <%};%>> ' +
        '<% if(icon) {%><div unselectable="on" class="ufui-icon-<%=icon%> ufui-icon"></div><% }; %><%if(text) {%><span unselectable="on" onmousedown="return false" class="ufui-button-label"><%=text%></span><%}%>' +
        '<%if(caret && text){%><span class="ufui-button-spacing"></span><%}%>' +
        '<% if(caret) {%><span unselectable="on" onmousedown="return false" class="ufui-caret"></span><% };%></<%if(!texttype){%>div<%}else{%>a<%}%>>',
    defaultOpt: {
        text: '',
        title: '',
        icon: '',
        width: '',
        caret: false,
        texttype: false,
        click: function () {
        }
    },
    init: function (options) {
        var me = this;

        me.root($($.parseTmpl(me.tpl, options)))
            .click(function (evt) {
                me.wrapclick(options.click, evt)
            });

        me.root().hover(function () {
            if (!me.root().hasClass("ufui-disabled")) {
                me.root().toggleClass('ufui-hover')
            }
        })

        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            this.root().trigger('wrapclick');
            $.proxy(fn, this, evt)()
        }
        return this;
    },
    label: function (text) {
        if (text === undefined) {
            return this.root().find('.ufui-button-label').text();
        } else {
            this.root().find('.ufui-button-label').text(text);
            return this;
        }
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled')
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover')
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active')
        }
        this.root().toggleClass('ufui-active', state)

        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.ufui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.on('click',function () {
            me.wrapclick(function () {
                $obj.ufui().show();
            })
        }).register('click', me.root(), function (evt) {
                $obj.hide()
            });
    }
});