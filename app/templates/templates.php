<?php
ini_set('memory_limit', '-1');
set_time_limit(0);
header('Content-Type: application/json; charset=utf-8');

function readFolderDirectory($base,$current/*,$dirsGot*/)
{	
	$dir=$base.$current;
	$files = scandir($dir);
	//if(is_null($dirsGot)){
		$dirsGot=array();
	//}
    foreach ($files as $file) {
		if (in_array($file, array(".",".."))) continue;
		if(is_dir($dir . '/' . $file)){
			//$dirsGot[] = readFolderDirectory($base,$current."\\".$file,$dirsGot);
			$dirsGot=array_merge($dirsGot,readFolderDirectory($base,$current."\\".$file,$dirsGot));
		}else{
			$fileGot=array();
			$fileType="file";
			if(strrpos($file,"_")!=0){
				$fileType="template";
			}
			$fileGot[$fileType]=str_replace( "\\","/",($current."\\".$file));
				
			$dirsGot[] = $fileGot;
		}
	}
	return $dirsGot;
}

$source = dirname(__FILE__);

if(isset($_GET["filter"])){
	$source=$source.'/'.$_GET["filter"];
}

$files = scandir($source);
$dirsGot=array();
foreach ($files as $file) {
	if (in_array($file, array(".",".."))) continue;
	
	if(is_dir($source . '/' . $file)){
	
		$template=array();
		$template["name"]=$file;
		$templates=array();
		$templates=readFolderDirectory($source."\\".$file,"");
		$template["files"] = $templates;
		
		$dirsGot[]=$template;
		
	}
}

echo json_encode($dirsGot);

?>

