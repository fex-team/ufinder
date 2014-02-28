//splitbutton 类
///import button
UF.ui.define('splitbutton', {
    tpl: '<div class="ufui-splitbutton <%if (name){%>ufui-splitbutton-<%= name %><%}%>"  unselectable="on" <%if(title){%>data-original-title="<%=title%>"<%}%>><div class="ufui-btn"  unselectable="on" ><%if(icon){%><div  unselectable="on" class="ufui-icon-<%=icon%> ufui-icon"></div><%}%><%if(text){%><%=text%><%}%></div>' +
        '<div  unselectable="on" class="ufui-btn ufui-dropdown-toggle" >' +
        '<div  unselectable="on" class="ufui-caret"><\/div>' +
        '</div>' +
        '</div>',
    defaultOpt: {
        text: '',
        title: '',
        click: function () {
        }
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        me.root().find('.ufui-btn:first').click(function (evt) {
            if (!me.disabled()) {
                $.proxy(options.click, me)();
            }
        });
        me.root().find('.ufui-dropdown-toggle').click(function () {
            if (!me.disabled()) {
                me.trigger('arrowclick')
            }
        });
        me.root().hover(function () {
            if (!me.root().hasClass("ufui-disabled")) {
                me.root().toggleClass('ufui-hover')
            }
        });

        return me;
    },
    wrapclick: function (fn, evt) {
        if (!this.disabled()) {
            $.proxy(fn, this, evt)()
        }
        return this;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled')
        }
        this.root().toggleClass('ufui-disabled', state).find('.ufui-btn').toggleClass('ufui-disabled', state);
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active')
        }
        this.root().toggleClass('ufui-active', state).find('.ufui-btn:first').toggleClass('ufui-active', state);
        return this;
    },
    mergeWith: function ($obj) {
        var me = this;
        me.data('$mergeObj', $obj);
        $obj.ufui().data('$mergeObj', me.root());
        if (!$.contains(document.body, $obj[0])) {
            $obj.appendTo(me.root());
        }
        me.root().delegate('.ufui-dropdown-toggle', 'click', function () {
            me.wrapclick(function () {
                $obj.ufui().show();
            })
        });
        me.register('click', me.root().find('.ufui-dropdown-toggle'), function (evt) {
            $obj.hide()
        });
    }
});