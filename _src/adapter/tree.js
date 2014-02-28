UF.registerUI('tree',
    function (name) {
        var me = this,
            $tree = $.ufuitree(),
            ufTree = $tree.ufui(),
            addItem = function (info) {
                if (info.type == 'dir') {
                    if (!ufTree.isItemInTree(info.path)) {
                        ufTree.addItem({
                            type: info.type,
                            title: info.name,
                            path: info.path
                        });
                    }
                }
            };

        /* 初始化根节点 */
        addItem(me.dataTree.getFileInfo('/'));

        /* 点击目录执行打开命令 */
        $tree.delegate('.ufui-leaf-title', 'click', function () {
            var path = $(this).parent().parent().attr('data-path'),
                info = me.dataTree.getFileInfo(path);
            if (info.read && me.dataTree.isFileLocked(path)) {
                me.execCommand('open', path);
            }
        });

        /* 打开目录 */
        me.on('listfile', function (type, filelist) {
            $.each(filelist, function (i, file) {
                addItem(file);
            });
        });

        /* 打开目录 */
        me.on('addfiles', function (type, files) {
            $.each($.isArray(files) ? files : [files], function (k, file) {
                addItem(file);
            });
        });

        /* 重命名文件 */
        me.on('renamefile', function (type, path, file) {
            if (file.type != 'dir') return;
            var $leaf = ufTree.getItem(path),
                ufLeaf = $leaf && $leaf.ufui();
            if (ufLeaf && ufLeaf.getPath().replace(/\/[^\/]+\/?$/, '') != path.replace(/\/[^\/]+\/?$/, '')) {
                $leaf.remove();
                addItem(file);
            } else {
                ufLeaf.setType(file.type).setTitle(file.name);
            }
        });

        /* 删除文件 */
        me.on('removefiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                ufTree.isItemInTree(path) && ufTree.removeItem(path);
            });
        });

        return $tree;
    }
);
