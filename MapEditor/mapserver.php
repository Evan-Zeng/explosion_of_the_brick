<?php
	$thefile = fopen("testmapsave.txt", "a");
	$data = json_decode($_POST['data']);
	fwrite($thefile, "the input data is " . file_get_contents("php://input") . "\n");
	fwrite($thefile, "the data[0] is " . $data[0] . "\n");
	fwrite($thefile, "the data[439] is " . $data[439] . "\n");
?>

<!DOCTYPE html>
<html>
<head>
	<title>Map server</title>
</head>
<body>
	<h1>hi</h1>
</body>
</html>