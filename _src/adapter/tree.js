UF.registerUI('tree',
    function(name) {
        var me = this,
            $tree = $.ufuitree(),
            ufTree = $tree.ufui(),
            addLeaf = function(file){
                if(file.type == 'dir') {
                    if(!ufTree.isLeafInTree(file.path)) {
                        ufTree.addLeaf( $.ufuileaf({
                            type: file.type,
                            title: file.name,
                            path: file.path
                        }) );
                    }
                }
            };

        addLeaf(me.dataTree.getFileByPath('/'));

        $tree.delegate('.ufui-leaf-title', 'click', function(){
            var path = $(this).parent().parent().attr('data-path'),
                file = me.dataTree.getFileByPath(path);
            if(file.getAttr('read') && file.locked()) {
                me.execCommand('open', path);
            }
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
            if(file.type != 'dir') return;
            var $leaf = ufTree.getLeaf(path),
                ufLeaf = $leaf && $leaf.ufui();
            if(ufLeaf.getPath().replace(/\/[^\/]+\/?$/, '') != path.replace(/\/[^\/]+\/?$/, '')) {
                $leaf.remove();
                addLeaf(file);
            } else {
                ufLeaf.setType(file.type).setTitle(file.name);
            }
        });

        /* 删除文件 */
        me.on('removefiles', function(type, paths){
            $.each(paths, function(i, path){
                var file = uf.dataTree.getFileByPath(path);
                if(file.type == 'dir') {
                    ufTree.removeLeaf(file.path);
                }
            });
        });

        return $tree;
    }
);
