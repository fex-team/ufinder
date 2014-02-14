var Finder = UF.Finder = UF.createClass('Finder', {
    constructor: function (options) {
        this._initEvents();
        this._initFinder();
        this._initModules();

        this.fire('ready');
    },
    _initFinder: function () {
        this.dataTree = new DataTree(this);
        this.selection = new Selection(this);
        this.proxy = new Proxy(this);
    }
});