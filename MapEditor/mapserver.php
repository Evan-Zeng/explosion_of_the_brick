<?php
    /*
    数据库的map
        brick_game_map_info

        int     Id      主键
        varchar name    名字
        int     serial  序号 unique
        int     width   长度
        int     height  高度
        varchar mapdata 数据
    */

	#'data' 是和 mapeditor约定好的变量名字

    //获取地图的名字
    //获取地图长和宽
    //组装$data成一个字符串
	$data = json_decode($_POST['data']);
    $mapName = $_POST['MapName'];
    $mapHeight = $_POST['MapHeight'];
    $mapWidth = $_POST['MapWidth'];

    $file = fopen("debug_log.txt", "a");
    fwrite($file, "1. MapName is :" . $mapName . "\n");
    fwrite($file, "2. MapHeight is :" . $mapHeight . "\n");
    fwrite($file, "3. MapWidth is :" . $mapWidth . "\n");

    for ($height = 0; $height < $mapHeight; $height++)
    {
        $one_row = "";
        for ($width = 0; $width < $mapWidth; $width++)
        {
            $one_row = $one_row . $data[$height * $mapWidth + $width];
        }
        fwrite($file, $one_row . "\n");
    }
    

	//connect to the server
	#$sqlconn = mysqli_connect("localhost", "root", "superman29", "");
?>