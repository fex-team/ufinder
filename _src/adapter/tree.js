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
            },
            openDir = function (path) {
                var info = me.dataTree.getFileInfo(path);
                if (info.read && !me.dataTree.isFileLocked(path)) {
                    me.execCommand('open', path);
                }
            };

        /* 点击目录执行打开命令 */
        $tree.delegate('.ufui-leaf-expand,.ufui-leaf-folder,.ufui-leaf-title', 'click', function () {
            var $target = $(this),
                $detail = $target.parent(),
                $leaf = $detail.parent(),
                path = $leaf.attr('data-path'),
                info = me.dataTree.getFileInfo(path);
            if (info.read && !me.dataTree.isFileLocked(path)) {
                if ($target.hasClass('ufui-leaf-expand')) {
                    if (!$detail.hasClass('ufui-leaf-detail-closed')) {
                        me.execCommand('list', path);
                    }
                } else {
                    me.execCommand('open', path);
                }
            }
        });

        /* 初始化根节点 */
        me.on('dataReady', function (type, info) {
            ufTree.setRoot({
                type: info.type,
                title: 'Root',
                path: info.path
            });
        });

        /* 打开目录 */
        me.on('listFile', function (type, filelist) {
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
            var ufLeaf = ufTree.getItem(path);
            if (ufLeaf) {
                ufTree.removeItem(path);
                addItem(file);
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
