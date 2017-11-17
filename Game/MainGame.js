function Init()
{
	var btn_stagemode = document.getElementById("btn_stagemode");
	btn_stagemode.onclick = function()
	{
		window.location.href = "StageMode.php?t=" + Math.random();
	}

	console.log("Init Main Game over.");
}

Init();