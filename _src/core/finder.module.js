UF.extendClass(Finder, {
    _initModules: function () {

        var modulesPool = UF.getModules();

        this._commands = {};
        this._query = {};
        this._modules = {};

        var me = this,
            i, name, module, moduleDeals, dealCommands, dealEvents;

        for (name in modulesPool) {
            if (!modulesPool.hasOwnProperty(name)) continue;

            //执行模块初始化，抛出后续处理对象
            moduleDeals = modulesPool[ name ].call(me);
            this._modules[name] = moduleDeals;
            if (moduleDeals.init) {
                moduleDeals.init.call(me, this._options);
            }

            //command加入命令池子
            dealCommands = moduleDeals.commands;
            for (var cmd in dealCommands) {
                me._commands[cmd.toLowerCase()] = dealCommands[cmd];
            }

            //设置模块默认配置项
            if (moduleDeals.defaultOptions) {
                me.setDefaultOptions(moduleDeals.defaultOptions);
            }

            //绑定事件
            dealEvents = moduleDeals.events;
            if (dealEvents) {
                for (var type in dealEvents) {
                    me.on(type, dealEvents[ type ]);
                }
            }

            //添加模块的快捷键
            if (moduleDeals.shortcutKeys) {
                me.addShortcutKeys(moduleDeals.shortcutKeys)
            }

        }
    }
});