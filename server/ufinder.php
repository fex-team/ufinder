<?php

$PATH = './files/';

$cmd = $_GET['cmd'];
$target = $_GET['target'];

switch($cmd){
    case 'ls':
        if(isset($_GET['target'])) $target = $_GET['target'];
        else $target = '';
        $list = listFile($target, $PATH);
        echo getJson('0', 'success', array('files' => $list));
        break;
    case 'rename':
        $name = $_GET['name'];
        $res = rename($PATH.$target, $PATH.$name);
        if($res) {
            echo getJson('0', 'success', array('file' => getFileInfo($name, $PATH)));
        } else {
            echo getJson('1', 'error', array('file' => getFileInfo($target, $PATH)));
        }
        break;
    case 'rm':
        $name = $_GET['name'];
        if(is_dir($PATH.$target)) {
            $res = rmdir($PATH.$target);
        } else {
            $res = unlink($PATH.$target);
        }
        if($res) {
            echo getJson('0', 'success');
        } else {
            echo getJson('1', 'error', array('file' => getFileInfo($target, $PATH)));
        }
        break;
    case 'touch':
//        sleep(3);
        if(!file_exists($PATH.$target)) {
            $res = file_put_contents($PATH.$target, '');
        } else {
            $res = true;
        }
        if($res) {
            echo getJson('0', 'success', array('file' => getFileInfo($target, $PATH)));
        } else {
            echo getJson('1', 'error', array('file' => getFileInfo($target, $PATH)));
        }
        break;
    case 'mkdir':
        $res = mkdir($PATH.$target);
        if($res) {
            echo getJson('0', 'success', array('file' => getFileInfo($target, $PATH)));
        } else {
            echo getJson('1', 'error', array('file' => getFileInfo($target, $PATH)));
        }
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

function getJson($state, $message, $data = null){
    $output = array();
    $output['state'] = $state;
    $output['message'] = $message;
    if($data) $output['data'] = $data;
    return json_encode($output);
}

?>