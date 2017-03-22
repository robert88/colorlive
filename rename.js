var wake = require("D:/newProject/jsweb/toolLib/fileWake.js")
srcDir = "D:/colorlive/images/icon";
var files = wake.findFile(srcDir, true);
for(var i=0;i<files.length;i++){
	if(~files[i].indexOf("最大")){
		wake.copy(files[i],files[i].replace("最大",""))
	}

}
