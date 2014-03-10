UF.registerUI('list',

    function (name) {
        var me = this,
            $list = $.ufuilist(),
            ufList = $list.ufui(),
            $preCliskFile,
            singleClickTimer,
            singleClickTarget,
            addFile = function (filelist) {
                var currentPath = me.getCurrentPath();
                $.each($.isArray(filelist) ? filelist : [filelist], function (k, file) {
                    if (Utils.getParentPath(file.path) == currentPath) {
                        var type = Utils.getPathExt(file.path);
                        ufList.addItem({
                            type: file.type == 'dir' ? 'dir' : type,
                            title: file.name,
                            path: file.path,
                            pers: (file.write ? 'w' : 'nw') + (file.read ? 'r' : 'nr')
                        });

                        if (Utils.isImagePath(file.path)) {
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

        /* 双击文件 */
        $list.delegate('.ufui-file', 'dblclick', function (e) {
            var ufFile = $(this).ufui(),
                path = ufFile.getPath();
            if (ufFile.getType() == 'dir') {
                var file = me.dataTree.getFileInfo(path);
                if (file.read && !file.locked) {
                    me.execCommand('open', path);
                }
            } else {
                if (Utils.isImagePath(path)) {
                    me.execCommand('lookimage', path);
                } else if (Utils.isCodePath(path)) {
                    me.execCommand('lookcode', path);
                } else if (Utils.isWebPagePath(path)) {
                } else {
                    me.execCommand('download', path);
                }
            }
        });

        /* 点击选文件 */
        $list.delegate('.ufui-file', 'click', function (e) {

            /* 解决双击单个文件时,不选中问题 */
            if(singleClickTimer && singleClickTarget == e.target) {
                return;
            } else {
                singleClickTimer = setTimeout(function(){
                    singleClickTimer = 0;
                }, 500);
                singleClickTarget = e.target;
            }

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
                if (ufFile) {
                    ufFile.active(true);

                    /* 滚动到选中文件 */
//                    var $c = $list.find('.ufui-list-container').scrollTop(ufFile.root().offset().top - 3);
                }
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
            });
        });

        /* 文件进入重命名 */
        me.on('renameFileTitle', function (type, path, callback) {
            var ufFile = ufList.getItem(path);
            if (ufFile) {
                ufFile.editabled(true, function (name) {
                    callback(name, function (isSuccess) {
                        /* 重命名失败 */
                        if (!isSuccess) {
                            var file = me.dataTree.getFileInfo(path);
                            if (file) {
                                ufFile.setTitle(file.name);
                            }
                        }
                    });
                });
            }
        });

        /* 进入新建文件 */
        me.on('newFileTitle', function (type, filetype, callback) {
            var tmpName = filetype == 'dir' ? '新建文件夹' : '新建文件',
                tmpPath = me.getCurrentPath() + tmpName,
                tmpUfFile;
            addFile({
                type: filetype,
                path: tmpPath,
                name: tmpName,
                read: true,
                write: true
            });
            tmpUfFile = ufList.getItem(tmpPath);
            tmpUfFile.editabled(true, function (name) {
                callback(name, function (isSuccess) {
                    ufList.removeItem(tmpPath);
                });
            });
        });

        return $list;
    }
);
