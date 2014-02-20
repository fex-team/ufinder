UF.registerUI('list',

    function(name) {
        var me = this,
            $list = $.ufuilist();
//        var $selector = $.ufuiselector;

        var $preCliskFile,
            getPathsFormView = function() {
                var paths = [];
                $list.find('.ufui-file.ufui-active').each(function(i, item){
                    paths.push($(item).attr('data-path'));
                });
                return paths;
            },
            updateSelection = function(){
                me.setSelectedFiles(getPathsFormView());
            },
            clearAllSelectedFiles = function($except){
                $list.find('.ufui-file').not($except).each(function(){
                    $(this).ufui().active(false);
                });
            };

        //点击选文件
        $list.delegate('.ufui-file', 'click', function(e){

            var $file = $(this);
            //点击选中文件
            var uffile = $(this).ufui(),
                state = uffile.active();

            if(e.shiftKey) {
                //按住shift,直点击文件
                var $start, $end, $current, endIndex;
                if($file.index() > $preCliskFile.index()) {
                    $start = $preCliskFile;
                    $end = $file;
                } else {
                    $start = $file;
                    $end = $preCliskFile;
                }
                endIndex = $end.index();

                $current = $start;
                while($current.length) {
                    $current.ufui().active(true);
                    $current = $current.next();
                    if($current.index() > endIndex) break;
                }
                updateSelection();
            } else if(e.ctrlKey || e.metaKey) {
                //按住ctrl,直点击文件
                uffile.active(!state);

                !state && ($preCliskFile = $file);
                updateSelection();
            } else {

                //直接点击文件
                if( (!state && getPathsFormView().length > 0) || (state && getPathsFormView().length > 1) ) {
                    clearAllSelectedFiles($file);
                    uffile.active(true);
                } else {
                    uffile.active(!state);
                }

                uffile.active() && ($preCliskFile = $file);
                updateSelection();
            }
        });

        $list.on('click', function(e){
            var target = e.target || e.srcElement;
            if(target && target == $list.children()[0]) {
                clearAllSelectedFiles();
                updateSelection();
            }
        });

        /* 打开目录 */
        me.on('listfile', function(type, filelist){
            var uflist = $list.ufui();
            uflist.clearItems();
            $.each(filelist, function(i, file){
                var $file = $.ufuifile({
                    type: file.type,
                    title: file.name,
                    path: file.path
                });

                /* 双击打开文件夹 */
                if(file.type == 'dir') {
                    $file.on('dblclick', function(){
                        me.execCommand('open', file.path);
                    });
                }

                uflist.addItem($file);
            });
        });

        /* 打开目录 */
        me.on('newfile mkdir', function(type, file){
            var uflist = $list.ufui(),
                $file = $.ufuifile({
                    type: file.type,
                    title: file.name,
                    path: file.path
                });

            /* 双击打开文件夹 */
            if(file.type == 'dir') {
                $file.on('dblclick', function(){
                    me.execCommand('open', file.path);
                });
            }

            uflist.addItem($file);
        });

        /* 重命名文件 */
        me.on('renamefile', function(type, path, file){
            $list.find('.ufui-file[data-path="' + path + '"]').ufui()
                .setPath(file.path).setType(file.type).setTitle(file.name);
        });

        /* 删除文件 */
        me.on('removefiles', function(type, paths){
            $.each(paths, function(i, path){
                $list.find('.ufui-file[data-path="' + path + '"]').remove();
            });
        });

        /* 选中文件 */
        me.on('selectfiles', function(type, paths){
            me.setSelectedFiles(paths);
            $.each(paths, function(i, path){
                $list.find('.ufui-file[data-path="' + path + '"]').ufui().active();
            });
        });

        return $list;
    }
);
