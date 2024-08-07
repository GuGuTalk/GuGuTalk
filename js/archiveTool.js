$().ready(function () {
    //临时的导出编辑内容
    $("#knopiji").on("click", "#dccd", function () {
        getTempJson().then(res => {
            console.log(res);
            if(res==undefined||$.isEmptyObject(res.boxJson)){
                alert("没有数据");
                return;
            }
            var blob = new Blob([JSON.stringify(res)], { type: "text/plain;charset=utf-8" });
            var link = document.createElement('a');
            link.download = '当前编辑内容';
            link.href = URL.createObjectURL(blob);
            link.click();
        })
    })
    //临时的导入编辑内容
    $("#knopiji").on("click", "#drcd", function () {
        var link = document.createElement("input");
        var jq = $(link);
        var reader = new FileReader();
        var imgObj;
        jq.attr({ "type": "file", "accept": "text/plain" });
        jq.on("change", function () {
            var imgP = $(this);
            imgObj = imgP[0].files[0];
            reader.onload = function (e) {
                var content = e.target.result;
                console.log(content);
                if (confirm("导入存档会导致当前编辑内容被替换，是否导入？")) {
                    if (content.indexOf("boxJson") >= 0) {
                        var json = JSON.parse(content);
                        LSupdateTempJson(json).then(res => {
                            loadBoxData();
                        })
                    } else {
                        alert("文件格式错误");
                    }
                }
            };
            reader.readAsText(imgObj);

        })

        jq.click();
    })
    //临时的导出存档
    $("#knopiji").on("click", "#dccds", function () {
        
        getBoxArray().then(res => {
            console.log(res);
            if(res==undefined||$.isEmptyObject(res)){
                alert("没有数据");
                return;
            }
            var blob = new Blob([JSON.stringify(res)], { type: "text/plain;charset=utf-8" });
            var link = document.createElement('a');
            link.download = '全部存档';
            link.href = URL.createObjectURL(blob);
            link.click();
        })
    })
    //临时的导入存档
    $("#knopiji").on("click", "#drcds", function () {
        var link = document.createElement("input");
        var jq = $(link);
        var reader = new FileReader();
        var imgObj;
        jq.attr({ "type": "file", "accept": "text/plain" });
        jq.on("change", function () {
            var imgP = $(this);
            imgObj = imgP[0].files[0];
            reader.onload = function (e) {
                var content = e.target.result;
                if (confirm("导入存档会导致当前全部存档内容被替换，是否导入？")) {
                    if (content.indexOf("boxJson") >= 0) {
                        var json = JSON.parse(content);
                        LSupdateBoxJson(json);
                        window.location.reload();
                    } else {
                        alert("文件格式错误");
                    }
                }
            };
            reader.readAsText(imgObj);

        })

        jq.click();
    })
})
