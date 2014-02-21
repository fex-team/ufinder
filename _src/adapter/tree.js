UF.registerUI('tree',
    function(name) {
        var me = this,
            $tree = $.ufuitree(),
            ufTree = $tree.ufui(),
            addLeaf = function(file){
                if(file.type == 'dir') {
                    ufTree.addLeaf( $.ufuileaf({
                        type: file.type,
                        title: file.name,
                        path: file.path
                    }) );
                }
            };

        $tree.delegate('.ufui-leaf-title', 'dblclick', function(){
            me.execCommand('open', $(this).parent('.ufui-leaf').attr('data-path'));
        });

        /* 打开目录 */
        me.on('listfile', function(type, filelist){
            $.each(filelist, function(i, file){
                addLeaf(file);
            });
        });

        /* 打开目录 */
        me.on('mkdir', function(type, file){
            addLeaf(file);
        });

        /* 重命名文件 */
        me.on('renamefile', function(type, path, file){
            var $leaf = ufTree.getLeaf(path),
                ufLeaf = $leaf.ufui();
            if(ufLeaf.path != path) {
                $leaf.remove();
                $leaf = ufTree.addLeaf( $.ufuileaf({
                    type: file.type,
                    title: file.name,
                    path: file.path
                }) );
                ufLeaf.addLeaf($leaf);
            } else {
                ufLeaf.setType(file.type).setTitle(file.name);
            }
        });

        /* 删除文件 */
        me.on('removefiles', function(type, paths){
            $.each(paths, function(i, path){
            });
        });

        return $tree;
    }
);
