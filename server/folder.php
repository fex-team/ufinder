<?php

$PATH = './files/';

$action = $_GET['a'];
$target = $_GET['target'];

switch($action){
    case 'ls':
        if(isset($_GET['target'])) $target = $_GET['target'];
        else $target = '';
        $list = listFile($target, $PATH);
        echo getJson('0', 'success', array('files' => $list));
        break;
    case 'rename':
        $newname = $_GET['newname'];
        $res = rename($PATH.$target, $PATH.$newname);
        echo getJson('0', 'success', array('newname' => $newname, 'list' => listFile($PATH)));
        break;
    default:
        echo 'unknow action';
        break;
}

function listFile($dir, $PATH){
    if ($handle = opendir($PATH.$dir)){
        $output = array();
        while (false !== ($item = readdir($handle))){
            if ($item != "." && $item != ".."){
                $output[] = getFileInfo($item, $PATH);
            }
        }
        closedir($handle);
        return $output;
    }else{
        return false;
    }
}

function getFileInfo($filename, $PATH){
    $filepath = $PATH.$filename;
    $stat = stat($filepath);
    $info = array(
//        'hash' => substr(md5($filepath),8,16),
        'name' => $filename,
//        'isdir' => is_dir($filename),
        'type' => filetype($filepath),
        'read' => is_readable($filepath),
        'write' => is_writable($filepath),
        'time' => filemtime($filepath),
//        'dev' => $stat['dev'],
//        'ino' => $stat['ino'],
        'mode' => decoct($stat['mode']),
//        'nlink' => $stat['nlink'],
//        'uid' => $stat['uid'],
//        'gid' => $stat['gid'],
//        'rdev' => $stat['rdev'],
        'size' => $stat['size'],
//        'atime' => $stat['atime'],
//        'mtime' => $stat['mtime'],
//        'ctime' => $stat['ctime'],
//        'blksize' => $stat['blksize'],
//        'blocks' => $stat['blocks']
    );
    return $info;
}

function getJson($state, $message, $data){
    $output = array();
    $output['state'] = $state;
    $output['message'] = $message;
    $output['data'] = $data;
    return json_encode($output);
}

?>