<?php
header('Content-Type: application/json; charset=utf-8');

$source = dirname(__FILE__);
$files = scandir($source);

$dirsGot=array();
foreach ($files as $file) {
    if (in_array($file, array(".",".."))) continue;
	if(is_dir($source . '/' . $file))
		$dirsGot[] = $file;
}
echo json_encode($dirsGot);

?>