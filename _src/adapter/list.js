UF.registerUI('list',

    function (name) {
        var me = this,
            $list = $.ufuilist(),
            ufList = $list.ufui(),
            $preCliskFile,
            addFile = function (filelist) {
                var currentPath = me.getCurrentPath();
                $.each($.isArray(filelist) ? filelist : [filelist], function (k, file) {
                    if (Utils.getParentPath(file.path) == currentPath) {
                        var type = file.name.substr((file.name.lastIndexOf('.') + 1) || file.name.length);
                        ufList.addItem({
                            type: file.type == 'dir' ? 'dir':type,
                            title: file.name,
                            path: file.path,
                            pers: (file.write ? 'w' : 'nw') + (file.read ? 'r' : 'nr')
                        });

                        if('gif bmp png jpg jpeg'.split(' ').indexOf(type) != -1) {
                            var realPath = me.serverOption.realRootUrl + file.path;
                            ufList.getItem(file.path).setPreviewImg(realPath);
                        }
                    }
                });
            },
            getPathsFormView = function () {
                var paths = [];
                $list.find('.ufui-file.ufui-active').each(function (i, item) {
                    paths.push($(item).attr('data-path'));
                });
                return paths;
            },
            updateSelection = function () {
                me.setSelectedFiles(getPathsFormView());
            },
            clearAllSelectedFiles = function ($except) {
                $list.find('.ufui-file').not($except).each(function () {
                    $(this).ufui().active(false);
                });
            };

        /* 双击文件夹 */
        $list.delegate('.ufui-file', 'dblclick', function (e) {
            var ufFile = $(this).ufui();
            if (ufFile.getType() == 'dir') {
                var path = ufFile.getPath(),
                    file = me.dataTree.getFileInfo(path);
                if (file.read && !file.locked) {
                    me.execCommand('open', path);
                }
            }
        });

        /* 点击选文件 */
        $list.delegate('.ufui-file', 'click', function (e) {

            var $file = $(this);
            /* 点击选中文件 */
            var ufFile = $(this).ufui(),
                state = ufFile.active();

            if (e.shiftKey && $preCliskFile) {
                /* 按住shift,直点击文件 */
                var $start, $end, $current, endIndex;
                if ($file.index() > $preCliskFile.index()) {
                    $start = $preCliskFile;
                    $end = $file;
                } else {
                    $start = $file;
                    $end = $preCliskFile;
                }
                endIndex = $end.index();

                $current = $start;
                while ($current.length) {
                    $current.ufui().active(true);
                    $current = $current.next();
                    if ($current.index() > endIndex) break;
                }
                updateSelection();
            } else if (e.ctrlKey || e.metaKey) {
                /* 按住ctrl,直点击文件 */
                ufFile.active(!state);

                !state && ($preCliskFile = $file);
                updateSelection();
            } else {

                /* 直接点击文件 */
                if ((!state && getPathsFormView().length > 0) || (state && getPathsFormView().length > 1)) {
                    clearAllSelectedFiles($file);
                    ufFile.active(true);
                } else {
                    ufFile.active(!state);
                }

                ufFile.active() && ($preCliskFile = $file);
                updateSelection();
            }
        });

        /* 去除选区 */
        $list.on('click', function (e) {
            var target = e.target || e.srcElement;
            if (target && target == $list.children()[0]) {
                clearAllSelectedFiles();
                updateSelection();
            }
        });

        /* 目录改变 */
        me.on('currentPathChange', function (type, path) {
            if ($list.attr('data-path') != path) {
                $list.attr('data-path', path);
                ufList.clearItems();
                addFile(me.dataTree.listDirFileInfo(path));
            }
        });



        /* 新增文件 */
        me.on('addFiles', function (type, files) {
            addFile(files);
        });

        /* 重命名文件 */
        me.on('updateFile', function (type, path, info) {
            ufList.isItemInList(path) && ufList.removeItem(path);
            addFile(info);
        });

        /* 删除文件 */
        me.on('removeFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                ufList.isItemInList(path) && ufList.removeItem(path, 300);
            });
        });

        /* 选中文件 */
        me.on('selectFiles', function (type, paths) {
            clearAllSelectedFiles();
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.active(true);
            });
            updateSelection();
        });

        /* 锁文件 */
        me.on('lockFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(true);
            });
        });

        /* 解锁文件 */
        me.on('unlockFiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(false);
            })
        });

        return $list;
    }
);
