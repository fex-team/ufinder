<?php
return array(
    'ROOT' => './files/',
    'write' => true,
    'read' => true,
    'upload' => array(
        "savePath" => "upload/" ,             //存储文件夹
        "maxSize" => 1000 ,                   //允许的文件最大尺寸，单位KB
        "allowFiles" => array( ".gif" , ".png" , ".jpg" , ".jpeg" , ".bmp" )  //允许的文件格式
    )
);
?>