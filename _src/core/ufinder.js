var UFinder =
    window.UF =
        window.UFinder = function () {
            var instanceMap = {}, instanceId = 0;
            return {
                version: '1.0.0',
                createFinder: function (renderTarget, options) {
                    options = options || {};
                    options.renderTo = Utils.isString(renderTarget) ? document.getElementById(renderTarget) : renderTarget;
                    var finder = new Finder(options);
                    this.addFinder(options.renderTo, finder);
                    return finder;
                },
                addFinder: function (target, finder) {
                    var id;
                    if (typeof ( target ) === 'string') {
                        id = target;
                    } else {
                        id = target.id || ( "UF_INSTANCE_" + instanceId++ );
                    }
                    instanceMap[id] = finder;
                },
                getFinder: function (target, options) {
                    var id;
                    if (typeof ( target ) === 'string') {
                        id = target;
                    } else {
                        id = target.id || ( "UF_INSTANCE_" + instanceId++ );
                    }
                    return instanceMap[id] || this.createFinder(target, options);
                },
                //挂接多语言
                LANG: {}
            };
        }();