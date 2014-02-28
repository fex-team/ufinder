UF.registerUI('list',

    function (name) {
        var me = this,
            $list = $.ufuilist(),
            ufList = $list.ufui();

        var $preCliskFile,
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
            },
            execOpen = function (path) {
                var file = me.dataTree.getFileInfo(path);
                if (file.read && !file.locked) {
                    me.execCommand('open', path);
                }
            };

        //双击文件夹
        $list.delegate('.ufui-file', 'dblclick', function (e) {
            var ufFile = $(this).ufui();
            if (ufFile.getType() == 'dir') {
                execOpen(ufFile.getPath());
            }
        });

        //点击选文件
        $list.delegate('.ufui-file', 'click', function (e) {

            var $file = $(this);
            //点击选中文件
            var ufFile = $(this).ufui(),
                state = ufFile.active();

            if (e.shiftKey) {
                //按住shift,直点击文件
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
                //按住ctrl,直点击文件
                ufFile.active(!state);

                !state && ($preCliskFile = $file);
                updateSelection();
            } else {

                //直接点击文件
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

        $list.on('click', function (e) {
            var target = e.target || e.srcElement;
            if (target && target == $list.children()[0]) {
                clearAllSelectedFiles();
                updateSelection();
            }
        });

        /* 打开目录 */
        me.on('listfile', function (type, filelist) {
            ufList.clearItems();
            $.each(filelist, function (i, file) {
                ufList.addItem({
                    type: file.type,
                    title: file.name,
                    path: file.path,
                    pers: (file.write ? 'w' : 'nw') + (file.read ? 'r' : 'nr')
                });
            });
        });

        /* 新增文件 */
        me.on('addfiles', function (type, files) {
            $.each($.isArray(files) ? files : [files], function (k, file) {
                ufList.addItem({
                    type: file.type,
                    title: file.name,
                    path: file.path,
                    pers: (file.write ? 'w' : 'nw') + (file.read ? 'r' : 'nr')
                });
            });
        });

        /* 重命名文件 */
        me.on('renamefile', function (type, path, file) {
            ufList.removeItem(path).addItem({
                type: file.type,
                title: file.name,
                path: file.path,
                pers: (file.write ? 'w' : 'nw') + (file.read ? 'r' : 'nr')
            });
            var ufFile = ufList.getItem(file.path);
            ufFile && ufFile.active(true);
        });

        /* 删除文件 */
        me.on('removefiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                ufList.isItemInList(path) && ufList.removeItem(path);
            });
        });

        /* 选中文件 */
        me.on('selectfiles', function (type, paths) {
            clearAllSelectedFiles();
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.active(true);
            });
            updateSelection();
        });

        /* 锁文件 */
        me.on('lockfiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(true);
            });
        });

        /* 解锁文件 */
        me.on('unlockfiles', function (type, paths) {
            $.each($.isArray(paths) ? paths : [paths], function (i, path) {
                var ufFile = ufList.getItem(path);
                ufFile && ufFile.disabled(false);
            })
        });

        return $list;
    }
);
