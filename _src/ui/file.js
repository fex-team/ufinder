UF.ui.define('file', {
    tpl: '<div class="ufui-file ufui-file-<%=pers%>" data-path="<%=path%>">' +
        '<div class="ufui-file-icon">' +
        '   <i class="ufui-file-icon-<%=type%>"></i>' +
        '   <span class="ufui-file-pers"></span>' +
        '</div>' +
        '<div class="ufui-file-title"><%=title%></div>' +
        '</div>',
    defaultOpt: {
        type: '',
        title: '',
        path: '',
        pers: 'wr'
    },
    init: function (options) {
        var me = this;
        me.root($($.parseTmpl(me.tpl, options)));
        me.root().find('.ufui-file-title').on('focus blur', function (evt) {
//            console.log(+new Date(), evt.type, evt)
        });
        return me;
    },
    editabled: function (state, callback) {
        var me = this,
            $title = this.root().find('.ufui-file-title');

        if (state === undefined) {
            return $title.attr('contenteditable');
        } else if (!state) {
            $title.removeClass('ufui-file-title-editable').attr('contenteditable', 'false');
            me.renameFlag = false;
        } else {
            if (me.renameFlag) return this;

            var isExit = false,
                finishHandler = function (evt) {
                    callback($title.text());
                    $title.focus().off('blur keydown', renameHandler);
                    me.editabled(false);
                    me.renameFlag = false;
                    evt.preventDefault();
                    return false;
                },
                renameHandler = function (evt) {
                    console.log('---', evt.type, evt.keyCode);
                    if (evt.type == 'blur' && !isExit) {
                        return finishHandler(evt);
                    } else if (evt.type == 'keydown') {
                        if (evt.keyCode == 27) { //Esc取消
                            isExit = true;
                        } else if (evt.keyCode == 13) { //Enter提交
                            return finishHandler(evt);
                        }
                    } else if (evt.type == 'click') {
                        evt.preventDefault();
                        return false;
                    }
                };
            $title.addClass('ufui-file-title-editable').attr('contenteditable', 'true');

            me.renameFlag = true;
            setTimeout(function () {
                $title.focus();
                setTimeout(function () {
                    $title.on('keydown click blur', renameHandler);
                }, 100);
            }, 100);
        }
        return this;
    },
    disabled: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-disabled');
        }
        this.root().toggleClass('ufui-disabled', state);
        if (this.root().hasClass('ufui-disabled')) {
            this.root().removeClass('ufui-hover');
        }
        return this;
    },
    active: function (state) {
        if (state === undefined) {
            return this.root().hasClass('ufui-active');
        }
        this.root().toggleClass('ufui-active', state);

        return this;
    },
    setTitle: function (title) {
        this.root().find('.ufui-file-title').text(title);
        return this;
    },
    getTitle: function () {
        return this.root().find('.ufui-file-title').text();
    },
    setType: function (type) {
        this.root().find('.ufui-file-icon i').attr('class', 'ufui-file-icon-' + type).attr('style', '');
        return this;
    },
    getType: function () {
        var c = this.root().find('.ufui-file-icon i'),
            m = c.attr('class').match(/ufui-file-icon-([\w]+)(\s|$)/);
        return m ? m[1] : null;
    },
    setPath: function (path) {
        this.root().attr('data-path', path);
        return this;
    },
    getPath: function () {
        return this.root().attr('data-path');
    },
    setPers: function (write, read) {
        this.root().addClass('ufui-file-' + (write ? 'w' : 'nw') + ('read' ? 'r' : 'nr'));
        return this;
    },
    getPers: function () {
        var $root = this.root(),
            write = $root.hasClass('ufui-file-w-r') || $root.hasClass('ufui-file-nw-r'),
            read = $root.hasClass('ufui-file-w-r') || $root.hasClass('ufui-file-w-nr');
        return {'write': write, 'read': read};
    },
    setPreviewImg: function (src) {
        var me = this;
        $('<img src="' + src + '" style="display:none;">').appendTo(document.body).on('load', function () {
            var $target = $(this);
            me.root().find('.ufui-file-icon i').css({
                'background-image': 'url("' + src + '")',
                'background-size': $target.width() > $target.height() ? 'auto 100%' : '100% auto',
                'background-position': 'center center',
                'background-repeat': 'no-repeat no-repeat',
                'border-radius': '3px',
                'width': '60px',
                'height': '60px',
                'margin': '10px auto 0 auto'
            });
            $target.remove();
        });
    }
});