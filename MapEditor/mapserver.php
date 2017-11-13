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
    $oper = $_POST['operation'];

    $logfile = fopen("debug_log.txt", "a");
    fwrite($logfile, "1. MapName is :" . $mapName . "\n");
    fwrite($logfile, "2. MapHeight is :" . $mapHeight . "\n");
    fwrite($logfile, "3. MapWidth is :" . $mapWidth . "\n");
    fwrite($logfile, "4. Operation is :" . $oper . "\n");

    $finalMapData = "";
    for ($height = 0; $height < $mapHeight; $height++)
    {
        $one_row = "";
        for ($width = 0; $width < $mapWidth; $width++)
        {
            $one_row = $one_row . $data[$height * $mapWidth + $width];
        }
        fwrite($logfile, $one_row . "\n");
        $finalMapData = $finalMapData . $one_row;
    }
    

	//connect to the server
	$sqlconn = mysqli_connect("localhost", "root", "superman29", "myweb");
    if (!$sqlconn)
    {
        fwrite($logfile, "Create mysqli_connect failed.\n");
        fclose($logfile);
        mysqli_close($sqlconn);

        //response
        return;
    }

    if ($oper === "save")
    {
        //save 语句
        $query = "INSERT INTO brick_game_map_info (MapName, Width, Height, MapData) VALUES ('$mapName', '$mapWidth', '$mapHeight', '$finalMapData')";
        fwrite($logfile, "Query string is:" . $query . "\n");
        //操作
        if (!mysqli_query($sqlconn, $query))
        {
            fwrite($logfile, "mysql query save info failed.\n");
            fclose($logfile);
            mysqli_close($sqlconn);
            return;
        }
        //response
        mysqli_close($sqlconn);
        fclose($logfile);
        return;
    }
    else if ($oper === "get")
    {
        fclose($logfile);
    }
    else
    {

    }

    fclose($logfile);
?>