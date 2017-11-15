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
	
    $logfile = fopen("debug_log.txt", "a");
    if (isset($_POST['MapName']))
    {
        $mapName = $_POST['MapName'];
        fwrite($logfile, "1. MapName is :" . $mapName . "\n");
    }
    if (isset($_POST['MapHeight']))
    {
        $mapHeight = $_POST['MapHeight'];
        fwrite($logfile, "2. MapHeight is :" . $mapHeight . "\n");
    }
    if (isset($_POST['MapWidth']))
    {
        $mapWidth = $_POST['MapWidth'];
        fwrite($logfile, "3. MapWidth is :" . $mapWidth . "\n");
    }
    if (isset($_POST['operation']))
    {
        $oper = $_POST['operation'];
        fwrite($logfile, "4. Operation is :" . $oper . "\n");
    }
    if (isset($_POST['data']))
    {
        $data = json_decode($_POST['data']);
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

    $query = "SELECT * FROM brick_game_map_info WHERE MapName='$mapName'";
    fwrite($logfile, "Query select from string is:" . $query . "\n");
    $res = mysqli_query($sqlconn, $query);

    //TODO: 把save封装成一个函数
    if ($oper === "save")
    {
        
        if (mysqli_num_rows($res) > 0)
        {
            $query = "DELETE FROM brick_game_map_info WHERE MapName='$mapName'";
            if (!mysqli_query($sqlconn, $query))
            {
                fwrite($logfile, "Delete the exist map failed.\n");
                fclose($logfile);
                mysqli_close($sqlconn);
                return;
            }

            fwrite($logfile, "Delete the exist map succeed.\n");
        }

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

        //save 语句
        $query = "INSERT INTO brick_game_map_info (MapName, Width, Height, MapData) VALUES ('$mapName', '$mapWidth', '$mapHeight', '$finalMapData')";
        fwrite($logfile, "Query string is:" . $query . "\n");
        //操作
        if (!mysqli_query($sqlconn, $query))
        {
            fwrite($logfile, "mysql query save info failed.\n");
            fclose($logfile);
            echo "错误描述: " . mysqli_error($sqlconn); 
            mysqli_close($sqlconn);
            return;
        }
        //response
        echo "ok, save over";
        echo "ok, save over2222";
        mysqli_close($sqlconn);
        fclose($logfile);
        return;
    }
    else if ($oper === "get")
    {
        if (mysqli_num_rows($res) <= 0)
        {
            echo "result=-1";
            mysqli_close($sqlconn);
            fclose($logfile);
            return;
        }

        $get_map_info_result=mysqli_fetch_array($res);

        fwrite($logfile, "Get map info from database.\n");
        fwrite($logfile, "mapname = " . $get_map_info_result['MapName'] . ".\n");
        fwrite($logfile, "Width = " . $get_map_info_result['Width'] . ".\n");
        fwrite($logfile, "Height = " . $get_map_info_result['Height'] . ".\n");

        $responsetxt = "responsedata=" . $get_map_info_result['MapData'];
        echo $responsetxt;

        mysqli_close($sqlconn);
        fclose($logfile);
        return;
    }
    else
    {

    }
    fclose($logfile);
?>