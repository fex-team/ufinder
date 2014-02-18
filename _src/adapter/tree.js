UF.registerUI('tree',
    function(name) {
        var me = this;
        var $tree = $.ufuitree();

        me.on('listfile', function(type, filelist){
            $tree.ufui().setData(filelist);
        });

        $tree.delegate('.ufui-tree-item', 'dblclick', function(){
            me.execCommand('open', $(this).attr('data-path'));
        });

        return $tree;
    }
);
