function Init()
{
	var btn_stagemode = document.getElementById("btn_stagemode");
	btn_stagemode.onclick = function()
	{
		console.log("hi~~~");
		window.location.href = "StageMode.php?t=" + Math.random();
	}
}

Init();