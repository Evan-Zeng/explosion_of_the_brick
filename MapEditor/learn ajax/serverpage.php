<?php
	#直接在firefox上刷新php， $_POST['data'] 是不会有值的
    $myfile = fopen("testfile.txt", "a");
    fwrite($myfile, "\n0:" . file_get_contents("php://input") . "\n");
    $data = $_POST['data'];

    $nnn = json_decode($data);

    fwrite($myfile, "4:data from xx is :" . $data . "!!!zczc\n");
    #fwrite($myfile, "5:post nnn =" . $nnn->{'data'} . "!!!zczc\n");
    #fwrite($myfile, "5:post nnn[0] =" . $nnn->{'data'}[0][2] . "!!!zczc\n");
    #fwrite($myfile, "5:post nnn[1] =" . $nnn->{'data'}[1][0] . "!!!zczc\n");
    fwrite($myfile, "5:post nnn[0][2] =" . $nnn[0][2] . "!!!zczc\n");
    
    phpinfo();
	
	foreach ($variable as $key) {
		echo $key;
		fwrite($myfile, "dsfwe");
	}
?>

<!DOCTYPE html>
<html>
<head>
	<title>hhh</title>
</head>
<body>
	<h>hi</h>
</body>
</html>