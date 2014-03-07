$.extend(UFinder, (function () {

    var _ufinderUI = {},
        _activeWidget = null,
        _widgetData = {},
        _widgetCallBack = {};

    return {
        registerUI: function (uiname, fn) {
            $.each(uiname.split(/\s+/), function (i, name) {
                _ufinderUI[ name ] = fn;
            });
        },
        _createContainer: function (id) {
            var $container = $('<div class="ufui-container"></div>');
            $(Utils.isString(id) ? '#' + id : id).append($container);
            return $container;
        },
        _createToolbar: function (uf) {
            var toolbars = uf.getOption('toolbars');

            var $toolbar = $.ufuitoolbar();
            uf.$container.append($toolbar);
            uf.$toolbar = $toolbar;

            if (toolbars && toolbars.length) {
                var btns = [];
                $.each(toolbars, function (i, uiNames) {
                    $.each(uiNames.split(/\s+/), function (index, name) {
                        if (name == '|') {
                            $.ufuiseparator && btns.push($.ufuiseparator());
                        } else {
                            if (_ufinderUI[ name ]) {
                                var ui = _ufinderUI[ name ].call(uf, name);
                                ui && btns.push(ui);
                            }
                        }

                    });
                    btns.length && $toolbar.ufui().appendToBtnmenu(btns);
                });
            }
            $toolbar.append($('<div class="ufui-dialog-container"></div>'));
        },
        _createtree: function (uf) {
            var $tree = _ufinderUI['tree'].call(uf, 'list');
            uf.$container.append($tree);
            uf.$tree = $tree;

        },
        _createlist: function (uf) {
            var $list = _ufinderUI['list'].call(uf, 'list');
            uf.$container.append($list);
            uf.$list = $list;
        },
        _createMessageHolder: function (uf) {
            var $messageHolder = $('<div class="ufui-message-list"></div>');
            uf.$container.append($messageHolder);
            uf.$messageHolder = $messageHolder;

            var _messages = {};

            uf.on('showmessage', function (type, p) {
                var $message = _ufinderUI['message'].call(uf, 'message', {
                    icon: p.icon || 'warning',
                    title: p.title || '',
                    loadedPercent: p.loadedPercent || 100,
                    timeout: p.timeout,
                    id: p.id || 'm' + (+new Date()).toString(36)
                });
                if (p.id) {
                    _messages[p.id] = $message;
                }
                $messageHolder.append($message);
                $message.ufui().show();
            });
            uf.on('updatemessage', function (type, p) {
                var $message;
                if (p.id && ($message = _messages[p.id])) {
                    $message.ufui().setIcon(p.icon).setMessage(p.title).setTimer(p.timeout).setLoadedPercent(p.loadedPercent);
                }
            });
            uf.on('hidemessage', function (type, p) {
                var $message;
                if (($message = _messages[p.id])) {
                    $message.ufui().hide();
                }
            });
        },
        getUFinder: function (id, options) {
            var $container = this._createContainer(id),
                uf = this.getFinder($container, options);

            uf.$container = $container;
            uf.on('focus',function () {
                $container.removeClass('ufui-disabled');
            }).on('blur', function () {
                    $container.addClass('ufui-disabled');
                });

            this._createToolbar(uf);
            this._createtree(uf);
            this._createlist(uf);
            this._createMessageHolder(uf);

            uf._initDomEvent();
            uf.fire('ready');
            return uf;
        },
        delUFinder: function (id) {
        },
        registerWidget: function (name, pro, cb) {
            _widgetData[name] = $.extend2(pro,{
                $root : '',
                _preventDefault:false,
                root:function($el){
                    return this.$root || (this.$root = $el);
                },
                preventDefault:function(){
                    this._preventDefault = true;
                },
                clear:false
            });
            if(cb){
                _widgetCallBack[name] = cb;
            }
        },
        getWidgetData: function (name) {
            return _widgetData[name];
        },
        setWidgetBody: function (name, $widget, finder) {
            if(!finder._widgetData){

                Utils.extend(finder,{
                    _widgetData : {},
                    getWidgetData : function(name){
                        return this._widgetData[name];
                    },
                    getWidgetCallback : function(widgetName){
                        var me = this;
                        return function(){
                            return  _widgetCallBack[widgetName].apply(me,[me,$widget].concat(Array.prototype.slice.call(arguments,0)))
                        }
                    }
                })

            }
            var pro = _widgetData[name];
            if(!pro){
                return null;
            }
            pro = finder._widgetData[name];
            if(!pro){
                pro = _widgetData[name];
                pro = finder._widgetData[name] = $.type(pro) == 'function' ? pro : Utils.clone(pro);
            }

            pro.root($widget.ufui().getBodyContainer());

            pro.initContent(finder,$widget);
            if(!pro._preventDefault){
                pro.initEvent(finder,$widget);
            }

            pro.width &&  $widget.width(pro.width);

        },
        createEditor: function (id, opt) {
        },
        createToolbar: function (options, editor) {
        }
    }
})());