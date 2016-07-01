<?php
header('Content-Type: application/json; charset=utf-8');

function readFolderDirectory($dir)
{
	$files = scandir($dir);
	$dirsGot=array();
    foreach ($files as $file) {
		if (in_array($file, array(".",".."))) continue;
		if(is_dir($dir . '/' . $file)){
			$dirsGot[$file] = readFolderDirectory($dir."\\".$file);
		}else{
			$fileType="FILE";
			if(strrpos($file,"_")!=0)
				$fileType="TEMPLATE";
				
			$dirsGot[$file] = $fileType;
		}
	}
	return $dirsGot;
}

$source = dirname(__FILE__);

$dirsGot = readFolderDirectory($source);

echo json_encode($dirsGot);

?>

