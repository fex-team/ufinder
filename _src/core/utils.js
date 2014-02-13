var Utils = UFinder.Utils = {

};

$.each(['String', 'Function', 'Array', 'Number', 'RegExp', 'Object', 'Boolean'], function (k, v) {
    Utils['is' + v] = function (obj) {
        return Object.prototype.toString.apply(obj) == '[object ' + v + ']';
    };
});