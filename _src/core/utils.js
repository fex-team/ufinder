var Utils = UFinder.Utils = {
    argsToArray: function (args, index) {
        return Array.prototype.slice.call(args, index || 0);
    },
    regularDirPath: function (path) {
        return path.replace(/([^\/])$/, '$1/').replace(/^([^\/])/, '/$1');
    },
    getParentPath: function (path) {
        return path.replace(/[^\/]+\/?$/, '');
    },
    getPathExt: function (path) {
        var index = path.lastIndexOf('.');
        return path.substr((index == -1 ? path.length : index) + 1);
    },
    isImagePath: function (path) {
        return path && 'png gif bmp jpg jpeg'.split(' ').indexOf(Utils.getPathExt(path)) != -1;
    },
    isCodePath: function (path) {
        return path && 'txt md json js css html htm xml php asp jsp'.split(' ').indexOf(Utils.getPathExt(path)) != -1;
    },
    extend: function (t, s, b) {
        if (s) {
            for (var k in s) {
                if (!b || !t.hasOwnProperty(k)) {
                    t[k] = s[k];
                }
            }
        }
        return t;
    },
    clone: function (source, target) {
        var tmp;
        target = target || {};
        for (var i in source) {
            if (source.hasOwnProperty(i)) {
                tmp = source[i];
                if (typeof tmp == 'object') {
                    target[i] = Utils.isArray(tmp) ? [] : {};
                    Utils.clone(source[i], target[i]);
                } else {
                    target[i] = tmp;
                }
            }
        }
        return target;
    },
    loadFile: (function () {
        var tmpList = [];

        function getItem(doc, obj) {
            try {
                for (var i = 0, ci; ci = tmpList[i++];) {
                    if (ci.doc === doc && ci.url == (obj.src || obj.href)) {
                        return ci;
                    }
                }
            } catch (e) {
                return null;
            }

        }

        return function (doc, obj, fn) {
            var item = getItem(doc, obj);
            if (item) {
                if (item.ready) {
                    fn && fn();
                } else {
                    item.funs.push(fn);
                }
                return;
            }
            tmpList.push({
                doc: doc,
                url: obj.src || obj.href,
                funs: [fn]
            });
            if (!doc.body) {
                var html = [];
                for (var p in obj) {
                    if (p == 'tag')continue;
                    html.push(p + '="' + obj[p] + '"');
                }
                doc.write('<' + obj.tag + ' ' + html.join(' ') + ' ></' + obj.tag + '>');
                return;
            }
            if (obj.id && doc.getElementById(obj.id)) {
                return;
            }
            var element = doc.createElement(obj.tag);
            delete obj.tag;
            for (var p in obj) {
                element.setAttribute(p, obj[p]);
            }
            element.onload = element.onreadystatechange = function () {
                if (!this.readyState || /loaded|complete/.test(this.readyState)) {
                    item = getItem(doc, obj);
                    if (item.funs.length > 0) {
                        item.ready = 1;
                        for (var fi; fi = item.funs.pop();) {
                            fi();
                        }
                    }
                    element.onload = element.onreadystatechange = null;
                }
            };
            element.onerror = function () {
                throw new Error('The load ' + (obj.href || obj.src) + ' fails,check the url');
            };
            doc.getElementsByTagName("head")[0].appendChild(element);
        };
    })()
};

$.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Boolean'], function (k, v) {
    Utils['is' + v] = function (obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    };
});