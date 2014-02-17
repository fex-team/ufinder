UF.registerUI('tree',
    function(name) {
        var me = this;
        var $tree = $.ufuitree();

        $tree.delegate('.ufui-list-item', 'click', function(){

        });

        return $tree;
    }
);
