UF.extendClass(Finder, {
    _initModules: function () {
        var modulesPool = UFinder.getModules();
        var modulesToLoad = this._options.modules || Utils.keys(modulesPool);

        this._commands = {};
        this._query = {};
        this._modules = {};

        var i, name, module, moduleDeals, dealCommands, dealEvents;

        var me = this;
        for (i = 0; i < modulesToLoad.length; i++) {
            name = modulesToLoad[ i ];

            if (!modulesPool[ name ]) continue;

            //执行模块初始化，抛出后续处理对象
            moduleDeals = modulesPool[ name ].call(me);
            this._modules[ name ] = moduleDeals;

            if (moduleDeals.init) {
                moduleDeals.init.call(me, this._options);
            }

            //command加入命令池子
            dealCommands = moduleDeals.commands;
            for (var name in dealCommands) {
                this._commands[ name.toLowerCase() ] = new dealCommands[ name ];
            }

            //绑定事件
            dealEvents = moduleDeals.events;
            if (dealEvents) {
                for (var type in dealEvents) {
                    me.on(type, dealEvents[ type ]);
                }
            }

            if (moduleDeals.defaultOptions) {
                this.setDefaultOptions(moduleDeals.defaultOptions);
            }
            //添加模块的快捷键
            if (moduleDeals.shortcutKeys) {
                this.addShortcutKeys(moduleDeals.shortcutKeys)
            }

        }
    }
});