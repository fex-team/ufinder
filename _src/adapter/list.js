UF.registerUI('list',
    function(name) {
        var me = this,
            $list = $.ufuilist();
//        var $selector = $.ufuiselector;

        me.on('listfile', function(type, filelist){
            var uflist = $list.ufui();
            uflist.clearItems();
            $.each(filelist, function(i, file){
                var $file = $.ufuifile({
                    type: file.type,
                    title: file.name,
                    path: file.path
                });

                $file.click(function(){
                    //TODO 文件的点击事件
                });

                if(file.type == 'dir') {
                    $file.on('dblclick', function(){
                        me.execCommand('open', file.path);
                    });
                }

                uflist.addItem($file);
            });
        });

        return $list;
    }
);
