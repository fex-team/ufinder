//dropmenu 类
UF.ui.define('dropmenu', {
    tmpl: '<ul class="ufui-dropdown-menu" aria-labelledby="dropdownMenu" >' +
        '<%for(var i=0,ci;ci=data[i++];){%>' +
        '<%if(ci.divider){%><li class="ufui-divider"></li><%}else{%>' +
        '<li <%if(ci.active||ci.disabled){%>class="<%= ci.active|| \'\' %> <%=ci.disabled||\'\' %>" <%}%> data-value="<%= ci.value%>">' +
        '<a href="#" tabindex="-1"><em class="ufui-dropmenu-checkbox"><i class="ufui-icon-ok"></i></em><%= ci.label%></a>' +
        '</li><%}%>' +
        '<%}%>' +
        '</ul>',
    defaultOpt: {
        data: [],
        click: function () {

        }
    },
    init: function (options) {
        var me = this;
        var eventName = {
            click: 1,
            mouseover: 1,
            mouseout: 1
        };

        this.root($($.parseTmpl(this.tmpl, options))).on('click', 'li[class!="ufui-disabled ufui-divider ufui-dropdown-submenu"]',function (evt) {
            $.proxy(options.click, me, evt, $(this).data('value'), $(this))();
        }).find('li').each(function (i, el) {
                var $this = $(this);
                if (!$this.hasClass("ufui-disabled ufui-divider ufui-dropdown-submenu")) {
                    var data = options.data[i];
                    $.each(eventName, function (k) {
                        data[k] && $this[k](function (evt) {
                            $.proxy(data[k], el)(evt, data, me.root);
                        });
                    });
                }
            });

    },
    disabled: function (cb) {
        $('li[class!=ufui-divider]', this.root()).each(function () {
            var $el = $(this);
            if (cb === true) {
                $el.addClass('ufui-disabled');
            } else if ($.isFunction(cb)) {
                $el.toggleClass('ufui-disabled', cb(li));
            } else {
                $el.removeClass('ufui-disabled');
            }

        });
    },
    val: function (val) {
        var currentVal;
        $('li[class!="ufui-divider ufui-disabled ufui-dropdown-submenu"]', this.root()).each(function () {
            var $el = $(this);
            if (val === undefined) {
                if ($el.find('em.ufui-dropmenu-checked').length) {
                    currentVal = $el.data('value');
                    return false;
                }
            } else {
                $el.find('em').toggleClass('ufui-dropmenu-checked', $el.data('value') == val);
            }
        });
        if (val === undefined) {
            return currentVal;
        }
    },
    addSubmenu: function (label, menu, index) {
        index = index || 0;

        var $list = $('li[class!=ufui-divider]', this.root());
        var $node = $('<li class="ufui-dropdown-submenu"><a tabindex="-1" href="#">' + label + '</a></li>').append(menu);

        if (index >= 0 && index < $list.length) {
            $node.insertBefore($list[index]);
        } else if (index < 0) {
            $node.insertBefore($list[0]);
        } else if (index >= $list.length) {
            $node.appendTo($list);
        }
    }
}, 'menu');