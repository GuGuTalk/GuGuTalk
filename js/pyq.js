$().ready(function () {
  var roleArray;
  var roleImgArray = new Array();
  var chooseAvatar = {
    roleId: 9999,
    //roleId
    //imgId
    //path
    //roleName
  };
  var ImgOrExpObj; //图片/表情包的位置
  var imgScale = 1;
  var uploadImg_scale = 0.2;
  var boxJsonArray = new Array();
  var cen = 1;
  var isR = false;
  var kqOptions = {};
  var yhzObj = {};
  var expressionCount = 1;
  var device;
  /**
   * 窗口宽度
   */
  var windowWidth;
  /**
   * 选中的头像图片id
   */
  var thisRoleImg;
  /**
   * 切换引航者发言，存储超弦体角色头像数据
   */
  var tempRoleImg;
  var Keys = "GuGuTalk";
  Init();
  //键盘按下事件
  $(document).keydown(function (event) {
    if (event.ctrlKey) {
      moveSelection(event.keyCode);
    }
    event.stopPropagation();
  });
  /**
   * 键盘移动底部头像选择
   * @param {*} d 左/右
   */
  function moveSelection(d) {
    var array = $(".conAvataar");
    var m;
    for (let i = 0; i < array.length; i++) {
      var a = $(array[i]);
      if (a.hasClass("imgd")) {
        m = a;
        break;
      }
    }
    switch (d) {
      case 186:
        if (m.prev().length == 0) {
          $(array[array.length - 1]).click();
        } else {
          m.prev().click();
        }

        break;
      case 222:
        if (m.next().length == 0) {
          $(array[0]).click();
        } else {
          m.next().click();
        }

        break;
      default:
        break;
    }
  }

  /**
   * 读取自定义设置
   */
  function LoadSetOptions() {
    //移动端访问
    var userAgent = navigator.userAgent;
    loadSetList().then((res) => {
      if (res != undefined) {
        kqOptions = res;
        updateSetList(res);
      }
    });
    // 判断是否包含移动设备关键字，例如 "Android"、"iPhone"、"iPad" 等
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      )
    ) {
      // 在移动端执行的代码
      console.log("移动端访问");
      device = "Mobile";
      $("#ALLPM").parent().addClass("n");
      $(".bodyN").addClass("margin0");
    } else {
      // 在非移动端执行的代码
      console.log("非移动端访问");
      device = "PC";
    }
  }

  //gugutalk边上的小提示
  $(".whDiv1").click(function () {
    var a = confirm(
      `部分浏览器无法保存生成的图片，目前已查明的有uc、夸克、小米自带浏览器\n点击确定刷新浏览器缓存,可以解决大部分问题`
    );
    if (a) {
      window.location.reload(true);
    }
  });
  $(".send").click(function () {
    wirte();
  });
  $("#text").keydown(function (event) {
    //var msgInput=$(this).val()
    //兼容Chrome和Firefox
    event = event ? event : window.event ? window.event : "";
    var keyCode = event.keyCode
      ? event.keyCode
      : event.which
        ? event.which
        : event.charCode;
    if (event.shiftKey && event.keyCode == 13) {
      //ctrl+enter换行
      $(this).css("height", $(this).css("height") + 24); // 获取textarea数据进行 换行
    } else if (event.ctrlKey && event.keyCode == 13) {
      //发送旁白
      aside();
      event.preventDefault(); //禁止回车的默认换行
    } else if (keyCode == 13) {
      //enter发送
      wirte();
      event.preventDefault(); //禁止回车的默认换行
    }
  });

  function wirte() {
    var json = new Object();
    $("#text").css("height", "1.35rem");
    var text = $("#text").val();
    var a = $("div[class*='roleOverall']");
    if (text != "") {
      json = getRoleJson("txt");
      newTalk = createHtml(json);
      insertOrContinue(newTalk, json);
      var text = document.getElementById("text");
      autoTextarea(text); // 调用
    }
  }

  //
  /**
   * 传入参数，根据情况插入对话或者继续对话
   * @param newObj 插入的对话对象
   * @param {*} talk 生成的html
   */
  function insertOrContinue(newTalk, newObj) {
    var list = {
      roleId: newObj.roleId,
      imgId: newObj.imgId,
      content: newTalk.content,
      type: newObj.type,
      index: newObj.index,
      name: newObj.name,
      base64: newObj.base64,
      path: newObj.path,
      date: newObj.date,
    };
    $(".yufuyg").addClass("disNoneD");
    var that = $(".editOpen");
    if (that.length == 0) {
      $(".pyq_liuyansDiv").append(newTalk.allStr);
      ToBtm();
      boxJson(list);
      
    } else {
      var index = that.data("index");
      var previousArray = new Array();
      var afterArray = new Array();
      for (let i = 0; i < boxJsonArray.length; i++) {

        if (boxJsonArray[i].index == index) {
          console.log(i);
          previousArray = boxJsonArray.slice(0, i);
          previousArray.push(list);
          afterArray = boxJsonArray.slice(i, boxJsonArray.length);
          boxJsonArray = previousArray.concat(afterArray);
          break;
        }
      }
      insertTalk(boxJsonArray);
      that.before(newTalk.allStr);
    }
    $("#text").val("");
    cen++;
  }
  //传入参数生成html
  /**
   * 传入一个对象
   * new objec{
   *
   * }
   * @param {*} listOne  参数类
   */
  function createHtml(listOne) {
    var type; //1:继续 2:插入
    var editOpen = $(".editOpen").prev().find(".gu");
    var lastDc = $("#box").children().last(".dc").find(".gu");
    var tdc;

    //var replyTdc;
    if ($(".editOpen").length == 0) {
      type = 1;
      tdc = lastDc;
      //replyTdc = replylastDc;
    } else {
      type = 2;
      tdc = editOpen;
      //replyTdc = replyEditOpen;
    };

    if (!$(".dsugvbgdcy").length > 0) {
      $("#box").append(createLiuyanDiv());
    }
    var contentStr = "";
    var str = "";
    switch (listOne.type) {
      case "Expression":
        contentStr += ` <img src="${listOne.content}" alt="" srcset="" class="allExpression" />`
        break;
      case "img":
        var imgstr = "";
        var yby = listOne.content;
        yby.forEach(function (val, index, yby) {
          imgstr += `<div class="opkmi uunilij"><img src="${val}" alt="" srcset="" /></div>`;
        });
        contentStr += `<div class="content_img">${imgstr}</div>`;
        break;
      case "txt":
        contentStr += listOne.content
        break;
      default:
        break;
    }
    listOne.content = contentStr;
    var html = {
      allStr: createContentHtml(listOne),
      content: contentStr
    }
    return html;
  }
  function createContentHtml(contentStr) {
    var a = "data:image";
    var newTalk = `<div class="liuyan dc" data-index="${contentStr.index
      }" data-imgId="${contentStr.imgId}"
                    data-roleId="${contentStr.roleId}">
                    <div class="liuyan_left">
                      <img src="${contentStr.base64.indexOf(a) >= 0
        ? dataURItoBlob(contentStr.base64)
        : contentStr.path
      }" alt="" srcset="" class="liuyan_tx" />
                      <div class="liuyan_leftools">
                        <img src="images/pyq/icon/叉.png" alt="" title="删除这条留言"
                          srcset="" class="deleteLiuyan" />
                        <img src="images/pyq/icon/替换图片.png" alt="" title="替换发言人"
                          srcset="" class="replyLiuyanRole uybt" />
                      </div>
                    </div>
                    <div class="liuyan_right">
                      <div class="liuyan_nameAndDate">
                        <div class="liuyan_name pyq_name">${contentStr.name}</div>
                        <div class="liuyan_date statistics fontTip" contenteditable="true"
                          spellcheck="false" data-type="date">
                          ${contentStr.date}
                        </div>
                      </div>
                      <div class="liuyan_content statistics fontTip" contenteditable="true"
                        spellcheck="false" data-type="content">
                        ${contentStr.content}
                      </div>
                      <div class="liuyan_imgbtn">
                        <img src="images/pyq/icon/表情.png" alt="" title="发表情"
                          srcset="" class="imgExpression" />
                        <img src="images/pyq/icon/图片.png" alt="" title="发图片"
                          srcset="" class="imgUpload" />
                      </div>
                    </div>
                    <div class="dfsdfYHZ">
                      <div class="chooseDivYHZ">
                        <input type="checkbox" name="iptChoose" id=""
                          class="iptChooseYHZ ipt" />
                      </div>
                    </div>
                  </div>`;
    return newTalk;
  }
  //获取新建角色类型
  function getNewRoleType(id) {
    var json = roleArray;
    var type;
    for (let index = 0; index < json.length; index++) {
      if (id == json[index].id) {
        type = json[index].description;
        break;
      }
    }
    return type;
  }
  //滚动条到最底部
  function ToBtm() {
    $("#box").addClass("height100");
    var scrollHeight = $("#box").prop("scrollHeight") + 9999;
    $("#box").scrollTop(scrollHeight);
  }
  $("#box").on("input", ".statistics", function () {
    var ele = $(this);
    console.log(ele);
    updateBoxOne(ele.parents(".dc").data("index"), ele[0], ele.data("type"));
  });
  /**
   * 抽出获取发言角色json
   * @param {*} type 类型
   * @returns
   */
  function getRoleJson(type) {
    var avatars = $("img[class*='imgd']");
    if (avatars.length <= 0) {
      alert("请选择发言角色");
      return;
    }
    var json = new Object();
    var text = $("#text").val();
    var obj;
    var value;
    var base64;
    obj = chooseAvatar;
    value = obj.roleId;
    base64 = getBase64(obj.roleId);
    json.index = cen.toString();
    json.content = text;
    if (value == "9999") {
      json.roleId = "9999";
      json.mark = "9999";
    } else {
      (json.roleId = obj.roleId.toString()),
        (json.imgId = obj.imgId.toString()),
        (json.name = obj.name),
        (json.content = text),
        (json.mark = obj.mark);
      if (obj.roleId != undefined) {
        json.base64 = "";
        json.path = obj.path;
      } else {
        if (
          getNewRoleType(obj.roleId) == "newRole" ||
          getNewRoleType(obj.roleId) == null
        ) {
          json.base64 = base64;
        }
        json.path = obj.path;
      }
    }
    json.date = getHm();
    json.type = type;

    return json;
  }

  //base64转blob
  function dataURItoBlob(base64Data) {
    var byteString;
    if (base64Data.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(base64Data.split(",")[1]); //base64 解码
    else {
      byteString = unescape(base64Data.split(",")[1]);
    }
    var mimeString = base64Data.split(",")[0].split(":")[1].split(";")[0]; //mime类型 -- image/png

    // var arrayBuffer = new ArrayBuffer(byteString.length); //创建缓冲数组
    // var ia = new Uint8Array(arrayBuffer);//创建视图
    var ia = new Uint8Array(byteString.length); //创建视图
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    var blob = new Blob([ia], {
      type: mimeString,
    });
    var url = URL.createObjectURL(blob);
    return url;
  }
  //加载未删除数据
  function loadBoxData() {
    getTempJson().then((res) => {
      $("#box").html("");
      boxJsonArray = res.boxJson;
      var str = `<div class="pyqTopDiv dc" data-roleId="${boxJsonArray[0].roleId}" data-imgId="${boxJsonArray[0].imgId}" data-index="${boxJsonArray[0].index}">
										<div class="pyqTopDiv_leftImg">
											<img src="${boxJsonArray[0].path}" alt="" srcset=""  class="liuyan_tx"/>
											<div class="liuyan_leftools">
												<img src="images/pyq/icon/替换图片.png" alt="" title="替换发言人" srcset=""
													class="replyLiuyanRole uybt" />
											</div>
										</div>
										<div class="pyqTopDiv_right">
											<div class="pyqTopDiv_right_name pyq_name">
												${boxJsonArray[0].name}
											</div>
											<div class="pyqTopDiv_right_content liuyan_content statistics fontTip" contenteditable="true"
												spellcheck="false"  data-type="content">
												${boxJsonArray[0].content}
											</div>
											<div class="content_btm">
												<div class="content_btm_pathAndimgbtn">
													<div class="content_btm_path statistics fontTip" contenteditable="true"
														spellcheck="false" data-type="address">
														${boxJsonArray[0].address}
													</div>
													<div class="content_btm_imgbtn">
														<img src="images/pyq/icon/表情.png" alt="" title="发表情" srcset=""
															class="imgExpression" />
														<img src="images/pyq/icon/图片.png" alt="" title="发图片" srcset=""
															class="imgUpload" />
													</div>
												</div>

												<div class="content_btm_dateAndTip">
													<div class="content_btm_date liuyan_date statistics fontTip" contenteditable="true"
														spellcheck="false" data-type="date">
														${boxJsonArray[0].date}
													</div>
													<div class="content_btm_Tip statistics fontTip" contenteditable="true"
														spellcheck="false" data-type="tip1">
														${boxJsonArray[0].tip1}
													</div>
												</div>
											</div>
										</div>
									</div>`;
      $("#box").append(str);
      console.log(boxJsonArray);
      if (boxJsonArray.length > 1) {
        $("#box").append(createLiuyanDiv());

        var tempArr = [];
        for (let i = 1; i < boxJsonArray.length; i++) {
          tempArr.push(parseInt(boxJsonArray[i].index));
          var newTalk = createContentHtml(boxJsonArray[i]);
          $(".pyq_liuyansDiv").append(newTalk);
        }
        cen = $.isEmptyObject(tempArr) ? 0 : Math.max.apply(null, tempArr) + 1;
        ToBtm();
      }
      showTips();
    });
  }
  /**
   * 生成下部dsugvbgdcy
   * @returns 
   */
  function createLiuyanDiv() {
    return `<div class="dsugvbgdcy">
                        <div class="pyq_liuyans">
                          <div class="left_img">
                            
                          </div>
                          <div class="pyq_liuyansDiv">
                          </div></div></div>`;
  }
  //重置角色名称
  $("#ReName").click(function () {
    var a = confirm("确定要重置全部角色名称吗？");
    if (a) {
      deleteRoleCopy().then((res) => {
        //window.location.reload();
        Init();
      });
    }
  });
  //跳转到新网址
  function toNewPath() {
    var url = window.location.href;
    //console.log(url);
    if (url.indexOf("gugutack.com") == -1) {
      if (confirm("是否跳转新站点，当前数据无法保存")) {
        window.location.replace("http://gugutack.com/index.html");
      }
    }
  }
  /**
   * 页面加载完成
   */
  function Initd() {
    $(".overlay").addClass("disNoneD");
    $(".donut").addClass("disNoneD");
    $(".bodyN").removeClass("opacity05");
    LoadSetOptions();
  }
  /**
   * 显示图标功能介绍
   */
  function showTips() {
    console.log($(".dsugvbgdcy").length, "1111111")
    if ($(".dsugvbgdcy").length == 0) {
      $(".yufuyg").removeClass("disNoneD");
      console.log(device);
      if (device == "PC") {
        $(".opuuji").removeClass("disNoneD");
      } else {
        $(".opuuji").addClass("disNoneD");
      }
    } else {
      $(".yufuyg").addClass("disNoneD");
      $(".opuuji").addClass("disNoneD");
    }
  }
  /**
   * 拖动内容，滚动条滚动，横向
   *@param {string} parent 需要拖动的面板的定位父级
   * @param {string} container 需要拖动的面板
   */
  function dragMoveX(parent, container) {
    var flag;
    var downX;
    var scrollLeft;
    //鼠标按下
    $(parent).on("mousedown", container, function (event) {
      flag = true;
      downX = event.clientX;
      scrollLeft = $(this).scrollLeft();
    });
    //鼠标移动
    $(container).on("mousemove", function (event) {
      event.stopPropagation();
      if (flag) {
        var moveX = event.clientX;
        var scrollX = moveX - downX;
        // console.log("moveX" + moveX);
        // console.log("scrollX" + scrollX);
        if (scrollX < 0 && scrollLeft > 0) {
          $(this).scrollLeft(scrollLeft - scrollX);
        } else {
          $(this).scrollLeft(scrollLeft - scrollX);
        }
      }
    });
    //鼠标释放
    $(container).on("mouseup", function (event) {
      flag = false;
      event.stopPropagation();
    });
    /**
     * 注意：与 mouseout 事件不同，mouseleave 事件只有在鼠标指针离开被选元素时被触发，mouseout 事件在鼠标指针离开任意子元素时也会被触发。参见页面底部演示实例。
     * 所以：如果mouseout的子元素存在溢出，并添加了超出加滚动，那么刚进入也会触发该事件，所以这里就不能使用。
     * */
    //鼠标移出元素
    $(container).on("mouseleave", function (event) {
      event.stopPropagation();
      flag = false;
      if (event.pageX < 0 || event.pageX > document.body.offsetWidth) {
        flag = false;
      }
    });
  }

  /**
   * 初始化
   */
  function Init() {
    toNewPath();
    Initd();

    $("#knopiji").html("");
    $.getJSON("data/roles.json", function (data) {
      $.getJSON("data/imagese.json", function (dataImg) {
        data.forEach((item) => {
          item.imgURl = "images/roleImages/" + item.imgURl + ".png";
          item.belongsImgURL =
            "images/roleImages/" + item.belongsImgURL + ".webp";
          item.open = false;
          item.avatarArray = "";
        });
        createRoleArrayCopy(data).then((res) => {
          roleArray = res;

          //循环展示角色
          var html = "";
          var b = "";
          var Aa = `<div class='centerRoleArraybtn n no_copy'>`;
          var aa = `</div>`;
          for (let index = 0; index < roleArray.length; index++) {
            $(".center").append(
              "<div class='sonbsc'><div class='xq' data-id='" +
              roleArray[index].id +
              "'><div class='wwww'><img crossOrigin='anonymous' src='" +
              roleArray[index].imgURl +
              "' alt='' height=75px; width=75px; class='sdad'><span class='roleName'>" +
              roleArray[index].roleName +
              "</span><a href='javascript:;' class='adb'><img src='images/updateName.png' class='updateName' alt='' srcset=''></a></div><img src='" +
              roleArray[index].belongsImgURL +
              "' class='ddddddddddd' alt='' srcset=''></div></div>"
            );
            var roleImgs = new Array();
            var b = "";
            if (roleArray[index].description == "newRole") {
              var obj = {
                choose: false,
                id: roleArray[index].id,
                imagePath: roleArray[index].imgURl,
                imgName: roleArray[index].roleName,
                mark: roleArray[index].roleName,
                path: roleArray[index].imgURl,
              };
              roleImgs.push(obj);
              b += `<img data-mark="${obj.mark}" class='conImg imgb' data-imgid='${obj.id}'  data-roleId='${obj.roleId}' data-open='${obj.choose}' title='${obj.imgName}' src=' ${obj.path}' crossOrigin='anonymous' alt='' srcset=''>`;
            } else {
              dataImg.forEach((item) => {
                if (item.roleId == roleArray[index].id) {
                  item.mark = item.imagePath;
                  item.path = "images/roleImages/" + item.imagePath + ".png";
                  item.choose = false;
                  roleImgs.push(item);
                  b += `<img data-mark="${item.mark}" class='conImg imgb' data-imgid='${item.id}'  data-roleId='${item.roleId}' data-open='${item.choose}' title='${item.imgName}' src=' ${item.path}' crossOrigin='anonymous' alt='' srcset=''>`;
                }
              });
            }
            html += `<div class='sonbsc'><div class='xq' data-id='${roleArray[index].id}'><div class='wwww'><img crossOrigin='anonymous' src='${roleArray[index].imgURl}' alt='' height=75px; width=75px; class='sdad'><span class='roleName'>${roleArray[index].roleName}</span><a href='javascript:;' class='adb'><img src='images/updateName.png' class='updateName' alt='' srcset=''></a></div><img src='${roleArray[index].belongsImgURL}' class='ddddddddddd' alt='' srcset=''></div>${Aa}${b}${aa}</div>`;
            roleArray[index].avatarArray = roleImgs;
          }
          //console.log(roleArray);
          $("#knopiji").html(html);
          dragMoveX("#knopiji", ".centerRoleArraybtn");
          LoadAvatar().then((res) => {
            if (res != undefined) {
              thisRoleImg = res.chooseImgId;
              roleImgArray = res.AvatarArray;
              var conImg = $(".conImg");
              for (let index = 0; index < roleImgArray.length; index++) {
                for (let i = 0; i < conImg.length; i++) {
                  if ($(conImg[i]).data("imgid") == roleImgArray[index].imgId) {
                    $(conImg[i]).toggleClass("imgb bj");
                    $(conImg[i]).parent().siblings(".xq").addClass("qx");
                    break;
                  }
                }
              }
              btnAvatars();
              $(".conAvataar").each(function () {
                if ($(this).data("imgid") == thisRoleImg) {
                  $(this).click();
                }
              });
            }
          });
          LoadSetOptions();
        });
      });
    });
    ExpressionInit();
    loadBoxData();
  }

  //点击选取头像加入到下方准备
  $("#knopiji").on("click", ".conImg", function (e) {
    $(this).toggleClass("imgb bj");
    if ($(this).parent().children().is(".bj")) {
      $(this).parent().siblings(".xq").addClass("qx");
    } else {
      $(this).parent().siblings(".xq").removeClass("qx");
    }
    roleAvatarClick($(this));
    e.stopPropagation();
  });
  //删除自定义角色事件
  $("#knopiji").on("click", ".ddddddddddd", function (e) {
    var id = $(this).parents().filter(".xq").data("id");
    for (let index = 0; index < roleArray.length; index++) {
      if (
        roleArray[index].description == "newRole" &&
        roleArray[index].id == id
      ) {
        deleteRole(roleArray[index].id, e);
        break;
      }
    }
  });
  //点击展开角色头像
  $("#knopiji").on("click", ".xq", function (e) {
    var dom = $(this).next();
    var id = $(this).data("id");
    roleArray.forEach((item) => {
      if (item.id == id) {
        if (item.open) {
          item.open = false;
          dom.css("display", "none");
        } else {
          item.open = true;
          dom.css("display", "flex");
        }
      }
    });
  });
  /**
   * 修改对话
   */
  $("#knopiji").on("click", ".updateName", function (e) {
    updateName(this, e);
    e.stopPropagation();
  });
  //重置选中角色头像
  function ReCheckAvatar() {
    var avatars = $("img[class*='imgd']");
    for (let index = 0; index < avatars.length; index++) {
      $(avatars[index]).attr("class", "conAvataar zz");
    }
  }
  //修改角色名字
  function updateName(d, e) {
    var newName = prompt("请输入新名称");
    if (newName !== null && newName != " ") {
      var id = $(d).parent().parent().parent().data("id");
      var copyList = roleArray;
      for (let index = 0; index < copyList.length; index++) {
        if (copyList[index].id == id) {
          copyList[index].roleName = newName;

          //ReCheckAvatar();

          break;
        }
      }
      updateRoleName(copyList);
      setTimeout(() => {
        Init();
      }, 500);

      $(d).parent().siblings("span").html(newName);
    }
  }
  //初始化表情包
  function ExpressionInit() {
    $(".imgContent").html("");
    var st = "";
    var a = "";
    var ele = $(".yhivdfbs");
    switch (expressionCount) {
      case 1:
        st = "data/Expression.json";
        a = "images/Expression/";
        break;
      case 2:
        st = "data/roleExpression.json";
        a = "images/roleExpression/";
        break;
      case 3:
        st = "data/dExpression.json";
        a = "images/dExpression/";
        break;
      default:
        break;
    }
    $.getJSON(st, function (data) {
      data.forEach((element) => {
        element.expressionName = a + element.expressionName;
      });
      for (let i = 0; i < data.length; i++) {
        $(".imgContent").append(
          "<img src='" +
          data[i].expressionName +
          "' alt='' srcset='' class='hgfhdft'>"
        );
        $(".imgContent")
          .children()
          .eq(i)
          .click(function () {
            ExpressionSend($(this));
          });
      }
    });
  }
  //表情包点击发送
  function ExpressionSend(e) {
    var imgObj = e.attr("src");
    var typeData = ImgOrExpObj.data("type");
    var newTalk = "";
    var json = getRoleJson("Expression");
    json.content = imgObj;
    if (typeData != undefined) {
      newTalk = createHtml(json);
      insertOrContinue(newTalk, json);
    } else {
      ImgOrExpObj.parents(".dc").find(".liuyan_content").append(
        `<img src="${imgObj}" alt="" srcset="" class="allExpression" />`
      );
      for (let index = 0; index < boxJsonArray.length; index++) {
        if (boxJsonArray[index].index == ImgOrExpObj.parents(".dc").data("index")) {
          boxJsonArray[index].content = ImgOrExpObj.parents(".dc").find(".liuyan_content").html();
          break;
        }
      }
      updateTempJson(boxJsonArray);
    }

    closeExpression();
  }

  //角色头像点击事件
  function roleAvatarClick(e) {
    $("#js").removeClass("border2sy");
    roleImgArray = new Array();
    var avatars = $("img[class*='bj']");
    for (var i = 0; i < avatars.length; i++) {
      var newObj = {
        roleId: $(avatars[i]).data("roleid"),
        imgId: $(avatars[i]).data("imgid"),
        imgPath: $(avatars[i]).attr("src"),
        mark: $(avatars[i]).data("mark"),
      };
      roleImgArray.push(newObj);
    }
    if (e.is(".bj")) {
      thisRoleImg = e.data("imgid");
    } else {
      thisRoleImg = "";
    }
    var a = {
      chooseImgId: thisRoleImg,
      AvatarArray: roleImgArray,
    };
    updateAvatar(a);
    btnAvatars();
    $(".conAvataar").each(function () {
      if ($(this).data("imgid") == thisRoleImg) {
        $(this).click();
      }
    });
  }
  //生成底部备选头像列表
  function btnAvatars() {
    $(".bottomImgs").html("");
    var txt = "";
    roleImgArray.forEach((item) => {
      txt =
        txt +
        "<img data-name=" +
        item.mark +
        " class='conAvataar zz' data-roleid='" +
        item.roleId +
        "' data-imgId='" +
        item.imgId +
        "' src='" +
        item.imgPath +
        "' srcset=''>";
    });
    $(".bottomImgs").html(txt);
    dragMoveX(".bottom1", ".bottomImgs");
  }
  //点击选取底部备选头像
  $(".bottom1").on("click", ".conAvataar", function () {
    if ($("#js").is(".border2sy")) {
      var imgid = $(this).data("imgid");
      var temp = new Array();
      roleImgArray.forEach((item) => {
        if (imgid != item.imgId) {
          temp.push(item);
        }
      });
      roleImgArray = temp;

      $(this).remove();
      if (roleImgArray == "") {
        $("#js").removeClass("border2sy");
      }
      $(".conImg").each(function () {
        if ($(this).data("imgid") == imgid) {
          $(this).toggleClass("imgb bj");
          if (!$(this).siblings().is(".bj")) {
            $(this).parent().siblings(".xq").removeClass("qx");
          }
        }
      });
      return;
    }

    $(this).toggleClass("zz");
    $(this).siblings().addClass("zz");
    if ($(this).hasClass("imgd")) {
      $(this).removeClass("imgd");
      thisRoleImg = "";
    } else {
      $(".conAvataar").each(function () {
        $(this).removeClass("imgd");
      });
      $(this).addClass("imgd");
      thisRoleImg = $(this).data("imgid");
      var obj = {
        roleId: $(this).data("roleid"),
        imgId: $(this).data("imgid"),
        path: $(this).attr("src"),
      };
      var roleName = "";
      var list = roleArray;
      for (let i = 0; i < list.length; i++) {
        if (
          (obj.roleId == "undefined" && obj.imgId == list[i].id) ||
          list[i].id == obj.roleId
        ) {
          roleName = list[i].roleName;
        }
      }
      obj.mark = $(this).data("name");
      obj.name = roleName;
      chooseAvatar = obj;
    }
    var a = {
      chooseImgId: thisRoleImg,
      AvatarArray: roleImgArray,
    };
    updateAvatar(a);
  });
  /**
   * 通过id获取base64头像
   * @param {*} id
   * @returns
   */
  function getBase64(id) {
    var base64;
    json = roleArray;
    for (let index = 0; index < json.length; index++) {
      if (json[index].id == id) {
        base64 = json[index].imgURl;
        break;
      }
    }
    return base64;
  }
  //切分文本长度
  function getActualWidthOfChars(text, options = {}) {
    const { size = 18, family = "none" } = options;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    ctx.font = `${size}px ${family}`;
    const metrics = ctx.measureText(text);
    const actual =
      Math.abs(metrics.actualBoundingBoxLeft) +
      Math.abs(metrics.actualBoundingBoxRight);
    return Math.max(metrics.width, actual);
  }
  //删除留言
  $("#box").on("click", ".deleteLiuyan", function () {
    if (confirm("确定要删除这条留言吗？")) {
      var index = $(this).parents(".dc").data("index");
      for (let i = 0; i < boxJsonArray.length; i++) {
        if (boxJsonArray[i].index == index) {
          boxJsonArray.splice(i, 1);
          updateTempJson(boxJsonArray);
          $(this).parents(".dc").remove();
          break;
        }
      }
      if (boxJsonArray.length < 2) {
        $(".dsugvbgdcy").remove();
        showTips();
      }
    }
  });
  //删除当前gugutalk
  $("#delAll").click(function () {
    if ($("#box").html() != "") {
      if (confirm("确定要删除当前内容吗？")) {
        deleteTempJson();
        loadBoxData();
        showTips();
      }
    }
  });
  //发送图片
  $(".right").on("click", ".imgUpload", function () {
    var that = $(this);
    var link = document.createElement("input");
    var jq = $(link);
    jq.attr({
      type: "file",
      accept: "image/*",
      multiple: "multiple",
    });
    jq.on("change", function () {
      var imgP = $(this);
      var imgObj = imgP[0].files;
      console.log(imgObj);
      //压缩图片
      compressImg(imgObj, uploadImg_scale).then((res) => {
        console.log(res);
        var array = new Array();
        $.each(res, function (i, item) {
          array.push(item.afterSrc);
        });
        var json = getRoleJson("img");
        json.content = array;
        //console.log($(this).data("type"), `$(this).data("type")`);
        if (that.data("type") == undefined) {
          var imgstr = "";
          array.forEach(function (val, index, array) {
            imgstr += `<div class="opkmi uunilij"><img src="${val}" alt="" srcset="" /></div>`;
          });
          that.parents(".dc").find(".liuyan_content")
            .append(
              `<div class="content_img">${imgstr}</div>`
            );
          for (let index = 0; index < boxJsonArray.length; index++) {
            if (boxJsonArray[index].index == that.parents(".dc").data("index")) {
              boxJsonArray[index].content = that.parents(".dc").find(".liuyan_content").html();
              break;
            }
          }
          updateTempJson(boxJsonArray);
        } else {
          var newTalk = createHtml(json);
          insertOrContinue(newTalk, json);
        }
      });
    });
    jq.click();
  });
  //打开设置列表
  $("#setList").click(function () {
    $("#knopiji").html("");
    loadSetList().then((res) => {
      console.log("res", res);
      if (res != undefined) {
        var html = `<div class="setList">
              <div>字体大小<input type="text" id="guFont-size" value="${res.guFont_size}" placeholder="数字，默认1.2">rem</div>
              <div style="opacity: 0.5;">背景颜色<input type="text" name="" id="guBackColor" value="${res.guBackColor}"
                  placeholder="white、#ffffff、rgb(0,0,0)" readonly="readonly">
                <div style="display:inline;" class="whDiv whDiv2 layui-icon layui-icon-tips-fill"></div>
              </div>
              <div>旁白字体大小<input type="text" name="" id="guAsideFont-size" value="${res.guAsideFont_size}" placeholder="数字，默认1.1">rem</div>
              <div>下载图片清晰度等级<input type="text" name="" id="loadImg-scale" value="${res.loadImg_scale}" placeholder="1-4，不要乱填！"></div>
              <div>上传图片清晰度<input type="text" name="" id="uploadImg-scale" value="${res.uploadImg_scale}" placeholder="0-1">
                <div style="display:inline;" class="whDiv whDiv3 layui-icon layui-icon-tips-fill"></div>
              </div>
               <div>水印内容<input type="text" name="" id="waterContent" value="${res.water.content}"  placeholder="为空则不开启水印"></div>
              <div>水印颜色<input type="text" name="" id="waterColor" value="${res.water.color}"placeholder="默认白色">
              <div style="display:inline;" class="whDiv whDiv2 layui-icon layui-icon-tips-fill"></div>
              </div>
              <div><button type="button" id="setSave">保存</button></div>
              <div><button type="button" id="setRe">重置</button></div>
              <div><button type="button" id="reBmAvatar">重置底部备选头像列表</button></div>
              <h2>存档相关</h2>
              <div class="uuujkih">
                <div>
                  <div><button type="button" id="dccd">导出编辑内容</button></div>
                  <div><button type="button" id="drcd">导入编辑内容</button></div>
                </div>
                <div>
                  <div><button type="button" id="dccds">导出存档列表</button></div>
                  <div><button type="button" id="drcds">导入存档列表</button></div>
                </div>
              </div>
                 <h3>导入gugutalk读取内容</h3><span>测试功能！</span>
            
            </div>`;
        // <div><button type="button" id="drgugu">导入guguTalk</button></div>
        $("#knopiji").append(html);
      }
    });
  });
  //导入gugutalk 目前不可用
  $("#knopiji").on("click", "#drgugu", function () {
    if (confirm("导入内容会使当前编辑内容消失！")) {
      var link = $(`<input type="file" accept="image/*" name="" id="">`);
      link.on("change", function () {
        console.log(2);
        var imgP = $(this);
        var imgObj = imgP[0].files[0];
        var reader = new FileReader(); //读取文件的方法 初始化
        reader.onload = () => {
          var img = new Image();
          img.onload = () => {
            var height = $("#iuyhbuiy").prop("height");
            var width = $("#iuyhbuiy").prop("width");
            $("#iuyhbuiy").prop({
              width: width,
              height: height,
            });
            console.log(width, height);
            $("#ca").prop({
              width: width,
              height: height,
            });
            var canvas = $("#ca")[0].getContext("2d");
            canvas.drawImage(img, 0, 0);
            var imgInfo = canvas.getImageData(0, 0, width, height);
            $("#iuyhbuiy").remove();
            $("#ca").remove();
            try {
              boxJsonArray = decryption(imgInfo.data);
              alert("导入成功,请等待页面加载\n长时间处于加载状态请刷新页面");
              addTalk(boxJsonArray);
              //页面等待动画
              $("#app").addClass("opacity05");
              $(".donut").removeClass("disNoneD");
              $(".donut").css("opacity", "1");
              $(".overlay").removeClass("disNoneD");
              setTimeout(function () {
                loadBoxData();
                $("#app").removeClass("opacity05");
                $(".donut").addClass("disNoneD");
                $(".overlay").addClass("disNoneD");
                $("#box").css("width", "auto");
              }, 2000);
            } catch {
              alert("导入失败,请刷新页面");
              window.location.reload();
            }
          };
          img.src = reader.result;
          var height = `<img src="${dataURItoBlob(
            reader.result
          )}" id="iuyhbuiy" alt="" srcset="">`;
          $("#box").append(height);
          var canDom = `<div><canvas width="100" height="100" id="ca"></canvas></div>`;
          $("#box").append(canDom);
        };

        reader.readAsDataURL(imgObj);
      });
      link.click();
    }
  });
  $("#knopiji").on("click", ".whDiv3", function () {
    alert("自定义角色头像清晰度/发送图片清晰度");
  });
  //颜色格式提示
  $("#knopiji").on("click", ".whDiv2", function () {
    alert(
      "支持颜色格式如下,例：\n英文单词：white\n16进制：#FFFFFF\nrgb格式：rgb(255,247,225)逗号必须是英文半角符号"
    );
  });
  //保存设置参数
  $("#knopiji").on("click", "#setSave", function () {
    try {
      var guFont_size = $("#guFont-size").val();
      var guBackColor = $("#guBackColor").val();
      var guAsideFont_size = $("#guAsideFont-size").val();
      var loadImg_scale = $("#loadImg-scale").val();
      var uploadImg_scale = $("#uploadImg-scale").val();
      var waterContent = $("#waterContent").val().trim();
      var waterColor = $("#waterColor").val();
      var options = {
        guFont_size: guFont_size,
        guBackColor: guBackColor,
        guAsideFont_size: guAsideFont_size,
        loadImg_scale: loadImg_scale,
        uploadImg_scale: uploadImg_scale,
        water: {
          content: waterContent,
          color: waterColor,
        },
      };
      setOption(options);
      updateSetList(options);
      alert("设置保存成功");
      window.location.reload();
    } catch (error) {
      alert("设置保存失败");
    }
  });
  /**
   * 启用修改后的设置
   * @param {*} options
   */
  function updateSetList(options) {
    //对话样式
    $(".roleRemarkDivSpan").css({
      "font-size": options.guFont_size + "rem",
    });
    //背景颜色
    $(".right").css({
      "background-color": options.guBackColor,
    });
    $("#box").css({
      "background-color": options.guBackColor,
    });
    //旁白字体大小
    $(".pangbaiSpan").css({
      "font-size": options.guAsideFont_size + "rem",
    });
    //下载图片清晰度
    imgScale = options.loadImg_scale;
    //上传图片清晰度
    uploadImg_scale = options.uploadImg_scale;
  }
  //重置设置列表
  $("#knopiji").on("click", "#setRe", function () {
    var options = {
      guFont_size: "1.2",
      guBackColor: "white",
      guAsideFont_size: "1.1",
      loadImg_scale: "1",
      uploadImg_scale: "0.2",
      water: {
        content: "",
        color: "rgb(230,230,230)",
      },
    };
    setOption(options);
    $("#guFont-size").val(options.guFont_size);
    $("#guBackColor").val(options.guBackColor);
    $("#guAsideFont-size").val(options.guAsideFont_size);
    $("#loadImg-scale").val(options.loadImg_scale);
    $("#uploadImg-scale").val(options.uploadImg_scale);
    $("#waterContent").val(options.water.content);
    $("#waterColor").val(options.water.color);
    updateSetList(options);
    alert("重置成功");
    Init();
  });
  //重置底部头像列表
  $("#knopiji").on("click", "#reBmAvatar", function () {
    reSet();
  });
  /**
   * 重置底部备选头像列表
   */
  function reSet() {
    DeleteAvatar();
    window.location.reload();
  }
  /**
   * 将编辑内容写入图片
   * @param {*} dataUrl 图片地址
   * @param {*} width 图片宽度
   * @param {*} height 图片高度
   * @param {*} n 选中的信息下标数组
   */
  function encryption(dataUrl, width, height, n) {
    var canDom = `<div><canvas width="${width}" height="${height}" id="ca"></canvas></div>`;
    $("#box").append(canDom);
    var ctx = $("#ca")[0];
    var canvas = ctx.getContext("2d");
    //定义图片
    var img = new Image();
    img.onload = () => {
      canvas.drawImage(img, 0, 0);
      var imgInfo = canvas.getImageData(0, 0, width, height);
      //获取当前选中内容的二进制格式
      var array = new Array();
      if ($.isEmptyObject(n)) {
        array = boxJsonArray;
      } else {
        for (let i = 0; i < n.length; i++) {
          array.push(boxJsonArray[n[i]]);
        }
      }
      var jsonstr = JSON.stringify(array);
      var tempJsonStr = strToBinary(jsonstr);
      for (let m = 1; m < tempJsonStr.length + 1; m++) {
        try {
          var a = imgInfo.data[m * 4 - 1].toString().split("");
          switch (tempJsonStr.charAt(m - 1)) {
            case "1":
              a[a.length - 1] = 1;
              break;
            case "0":
              a[a.length - 1] = 2;
              break;
            default:
              a[a.length - 1] = 0;
              break;
          }
          imgInfo.data[m * 4 - 1] = parseInt(a.join(""));
          if (m == tempJsonStr.length) {
            imgInfo.data[(m + 2) * 4 - 1] = imgScale;
            imgInfo.data[(m + 1) * 4 - 1] = 0;
            break;
          }
        } catch {
          domtoimage
            .toPng($("#box")[0], {
              scale: imgScale,
              height: height,
              width: width,
            })
            .then(function (dataUrl) {
              var link = document.createElement("a");
              link.download = "gugutalk.png";
              link.href = dataUrl;
              //插入当前编辑内容
              link.click();
              //还原替换发言人按钮
              $(".iptChoose").removeClass("chooseNone");
              $(".iptChooseYHZ").removeClass("chooseNone");
              $(".zt_cz").removeClass("disNoneD");
              $("#app").removeClass("opacity05");
              $(".donut").addClass("disNoneD");
              $(".overlay").addClass("disNoneD");
              $("#box").css("width", "auto");
              //loadBoxData();
              //ToBtm();
            });
        }
      }
      canvas.putImageData(imgInfo, 0, 0);
      var link = document.createElement("a");
      link.download = "gugutalk.png";
      link.href = ctx.toDataURL();
      //插入当前编辑内容
      link.click();
      //还原替换发言人按钮
      loadBoxData();
      ToBtm();
      //decryption(imgInfo.data);
    };
    console.log(3);
    img.src = dataUrl;
  }
  /**
   * 页面加载动画
   */
  function jiazai() {
    $("#app").addClass("opacity05");
    $(".donut").removeClass("disNoneD");
    $(".donut").css("opacity", "1");
    $(".overlay").removeClass("disNoneD");
  }
  /**
   * 页面加载完成
   */
  function jazaiwancheng() {
    $("#app").removeClass("opacity05");
    $(".donut").addClass("disNoneD");
    $(".overlay").addClass("disNoneD");
  }
  //解密图像数据
  function decryption(data) {
    var d = "";
    for (let i = 0; i < data.length; i++) {
      if (data[i] == 0) {
        break;
      }
      if (i != 0) {
        var a = data[i * 4 - 1].toString().split("");
        switch (a[a.length - 1]) {
          case "0":
            d += " ";
            break;
          case "1":
            d += "1";
            break;
          case "2":
            d += "0";
            break;
        }
      }
    }
    var str = binaryToStr(d);
    console.log(str);
    var json = $.parseJSON(str);
    return json;
  }
  //将二进制字符串转换成Unicode字符串
  function binaryToStr(str) {
    var result = [];
    var list = str.split(" ");
    for (var i = 0; i < list.length; i++) {
      var item = list[i];
      var asciiCode = parseInt(item, 2);
      var charValue = String.fromCharCode(asciiCode);
      result.push(charValue);
    }
    result.splice(result.length - 1, 1);
    console.log(result);
    return result.join("");
  }

  $("#test").click(function () {
    console.log(strToBinary(JSON.stringify(boxJsonArray)));
  });
  /**
   * 将字符串转换成二进制形式，中间用空格隔开
   * @param {*} str 传入字符串
   * @returns 二进制字符串
   */
  function strToBinary(str) {
    var result = [];
    var list = str.split("");
    for (var i = 0; i < list.length; i++) {
      if (i != 0) {
        result.push(" ");
      }
      var item = list[i];
      var binaryStr = item.charCodeAt().toString(2);
      result.push(binaryStr);
      //result.push(" ");
    }
    return result.join("");
  }
  /**
   * 截图保存
   */
  $("#save").click(function () {
    //隐藏替换发言人按钮
    hiddenIcon();
    //页面等待动画
    $("#app").addClass("opacity05");
    $(".donut").removeClass("disNoneD");
    $(".donut").css("opacity", "1");
    $(".overlay").removeClass("disNoneD");
    $("#box").css("width", "500px");
    //$("#box").removeClass("height100");
    $(".iptChoose").addClass("chooseNone");
    $(".iptChooseYHZ").addClass("chooseNone");
    $("[type='checkbox']").prop("checked", false);
    $(".zt_cz").addClass("disNoneD");
    $(".dc").removeClass("editOpen"); //document.getElementById('box')
    //追加图片水印
    if (kqOptions.water.content != "") {
      $("#box").append(`<div class=" waterMarkDiv">
<img src="images/w1.png" alt="" srcset="">
<div style="color:${kqOptions.water.color};">@${kqOptions.water.content}</div>
</div>`);
      $(".dsugvbgdcy").addClass("fyuvtyhf"); //清除底部边距
    }
    setTimeout(function () {
      var n = new Array();
      var scrollHeight = $("#box").prop("scrollHeight");
    var scrollWidth = $("#box").prop("scrollWidth");
      domtoimage
        .toPng($("#box")[0], {
          scale: imgScale,
          height: scrollHeight,
          width: scrollWidth,
        })
        .then(function (dataUrl) {
          //encryption(dataUrl, scrollWidth * imgScale, scrollHeight * imgScale, n);
          var link = document.createElement("a");
          link.download = "gugutalk.png";
          link.href = dataUrl;
          //插入当前编辑内容
          link.click();
          $(".iptChoose").removeClass("chooseNone");
          $(".iptChooseYHZ").removeClass("chooseNone");
          $(".zt_cz").removeClass("disNoneD");
          $("#app").removeClass("opacity05");
          $(".donut").addClass("disNoneD");
          $(".overlay").addClass("disNoneD");
          $("#box").css("width", "auto");
          $(".dsugvbgdcy").removeClass("fyuvtyhf"); //还原底部边距

          loadBoxData();
          ToBtm();
        });
    }, 500)

  });
  /**
   * 截图时隐藏图标
   */
  function hiddenIcon() {
    $(".uybt").addClass("disNoneD");//替换图标
    $(".deleteLiuyan").addClass("disNoneD");//删除图标
    $("#box .imgExpression").addClass("disNoneD");//表情包
    $("#box .imgUpload").addClass("disNoneD");//图片
    $("[class~=fontTip]").removeClass("fontTip");//清除背景色提示
    $("[class~=uunilij]").removeClass("uunilij");
  }
  /**
   * 检测是否已展开存档列表，展开则刷新
   */
  function reLoadLeftArchive() {
    if ($(".sonbsc").length <= 0) {
      LoadArchive($("#knopiji"), 2);
    }
  }
  //创建新系列
  $(".newArchive").click(function () {
    Archive().then((res) => {
      LoadArchive($(".oldArchive"), 1);
      reLoadLeftArchive();
    });
  });
  //点击存档按钮打开存档页面
  $("#ArchiveSave").click(function () {
    LoadArchive($(".oldArchive"), 1);
    $(".archiveList").toggleClass("n");
  });
  //点击展开角色列表
  $("#RoleList").click(function () {
    Init();
  });
  //点击展开一级存档列表
  $("#ArchiveList").click(function () {
    LoadArchive($("#knopiji"), 2);
  });
  //点击展开二级存档
  $("#knopiji").on("click", ".AL-ArchiveOne", function (e) {
    $(this)
      .parents()
      .filter(".AL-Series")
      .find(".AL-OneChildList")
      .toggleClass("n");
    e.stopPropagation();
  });
  //点击读取存档
  $("#knopiji").on("click", ".dxx", function (e) {
    try {
      var id = $(this).find(".AL-imgTools").data("id");
      var cid = $(this).find(".AL-imgTools").data("cid");
      var title = $(this).find(".word-wrap").html();
      //console.log(id,cid,title);
      if (confirm("是否读取" + title)) {
        updateArchive(id, cid);
        //页面等待动画
        jiazai();
        //稍微等几秒
        setTimeout(function () {
          jazaiwancheng();
          loadBoxData();
          alert("读取完成");
        }, 1500);
      }
    } catch (error) {
      alert("读取失败");
    }

    e.stopPropagation();
  });
  //点击关闭存档
  $(".archiveGb").click(function () {
    $(this).parents().filter(".archiveList").toggleClass("n");
  });
  //点击修改标题
  $("#knopiji").on("click", ".AL-updateTitle", function (e) {
    var title = $(this)
      .parents()
      .filter(".AL-TitleDiv")
      .find(".AL-Title")
      .html();
    var id = $(this).parent().data("id");
    var cid = $(this).parent().data("cid");
    var newTitle = prompt("修改标题《" + title + "》为");
    if (newTitle != null && newTitle != "") {
      if (id == cid)
        updateTitle(id, newTitle).then((res) => {
          $(this)
            .parents()
            .filter(".AL-TitleDiv")
            .find(".AL-Title")
            .html(newTitle);
        });
      else
        updateTitle(id, newTitle, cid).then((res) => {
          $(this)
            .parents()
            .filter(".AL-TitleDiv")
            .find(".AL-Title")
            .html(newTitle);
        });
    }
    e.stopPropagation();
  });
  //删除存档
  $("#knopiji").on("click", ".AL-deleteArchive", function (e) {
    var id = $(this).parent().data("id");
    var cid = $(this).parent().data("cid");
    var title = $(this)
      .parents()
      .filter(".AL-TitleDiv")
      .find(".AL-Title")
      .html();
    if (id == cid) {
      if (confirm("是否删除《" + title + "》系列")) {
        deleteBoxArrayById(id).then((res) => {
          LoadArchive($("#knopiji"), 2);
        });
      }
    } else {
      if (confirm("是否删除《" + title + "》该存档")) {
        deleteBoxArrayChild(id, cid).then((res) => {
          LoadArchive($("#knopiji"), 2);
        });
      }
    }
    e.stopPropagation();
  });
  //存档页面点击系列展开存档
  $(".oldArchive").on("click", ".AL-ArchiveOne", function () {
    $(this).siblings().filter(".AL-OneChildList").toggleClass("n");
  });
  //存档页面根据id插入存档
  $(".oldArchive").on("click", ".AL-insertSeries", function (e) {
    var id = $(this).parent().data("id");
    var title = $(this)
      .parents()
      .filter(".AL-TitleDiv")
      .find(".AL-Title")
      .html();
    if ($(".dc").length > 0) {
      if (confirm("是否将当前gugutalk插入《" + title + "》系列")) {
        var newtitle = prompt("请输入标题,为空则生成默认标题");
        insertArchive(id, newtitle).then((res) => {
          $(this).parents().filter(".AL-Series").find(".AL-OneChildList")
            .append(`<div class="AL-TitleDiv">
                <div class="AL-Title word-wrap mhhh">${res.ctitle}</div>
                <div class="AL-imgTools" data-id="${res.id}" data-cid="${res.cid}">
                <img src="/images/replace.png" alt="" srcset="" class="AL-replaceArchive">
                </div>
              </div>`);
          reLoadLeftArchive();
        });
      }
    }
    e.stopPropagation();
  });
  //存档页面替换存档按钮
  $(".oldArchive").on("click", ".AL-replaceArchive", function () {
    var id = $(this).parent().data("id");
    var cid = $(this).parent().data("cid");
    var title = $(this)
      .parents()
      .filter(".AL-TitleDiv")
      .find(".AL-Title")
      .html();
    if (confirm("是否使用当前gugutalk替换《" + title + "》存档")) {
      var newtitle = prompt("是否修改标题，为空则不修改");
      if (newtitle != null) {
        replaceArchive(id, cid, newtitle).then((res) => {
          reLoadLeftArchive();
          $(this).parents().filter(".AL-TitleDiv").find(".mhhh").html(newtitle);
        });
      }
    }
  });
  /**
   * 加载存档
   * @param {*} obj jquery对象
   * @param {*} type 1:存档 2:展开存档列表
   */
  function LoadArchive(obj, type) {
    getBoxArray().then((res) => {
      obj.html("");
      var html = "";
      switch (type) {
        case 1:
          var a = "";
          var tempB = `<div class="AL-OneChildList n">`;
          var tempA = `</div>`;
          $.each(res, function (i, m) {
            var b = "";
            $.each(m.boxJsonArrays, function (t, n) {
              b += `<div class="AL-TitleDiv">
                            <div class="AL-Title word-wrap mhhh">${n.ctitle}</div>
                            <div class="AL-imgTools" data-id="${m.id}" data-cid="${n.cid}">
                            <img src="/images/replace.png" alt="" srcset="" class="AL-replaceArchive">
                            </div>
                          </div>`;
            });
            var c = `<div class="AL-ArchiveOne">
                        <div class="AL-TitleDiv">
                          <div class="AL-Title mhh">${m.title}</div>
                          <div class="AL-imgTools" data-id="${m.id}" data-cid="${m.id}">
                          <img src="/images/insert.png" alt="" srcset="" class="AL-insertSeries">
                          </div>
                        </div>
                      </div>`;
            a += `<div class="AL-Series">` + c + tempB + b + tempA + `</div>`;
          });
          obj.html(a);
          return;
          break;
        case 2:
          if (res == undefined) {
            alert("当前没有存档");
          } else {
            if (res.length == 0) {
              alert("当前没有存档");
            }
          }
          var a = "";
          var tempB = `<div class="AL-OneChildList n">`;
          var tempA = `</div>`;
          $.each(res, function (i, m) {
            var b = "";
            $.each(m.boxJsonArrays, function (t, n) {
              b += `<div class="AL-TitleDiv dxx">
                            <div class="AL-Title word-wrap">${n.ctitle}</div>
                            <div class="AL-imgTools" data-id="${m.id}" data-cid="${n.cid}">
                              <img src="/images/updateName.png" alt="" srcset="" class="AL-updateTitle">
                              <img src="/images/gb.png" alt="" srcset="" class="AL-deleteArchive">
                            </div>
                          </div>`;
            });
            var c = `<div class="AL-ArchiveOne">
                        <div class="AL-TitleDiv">
                          <div class="AL-Title">${m.title}</div>
                          <div class="AL-imgTools" data-id="${m.id}" data-cid="${m.id}">
                            <img src="/images/updateName.png" alt="" srcset="" class="AL-updateTitle">
                            <img src="/images/gb.png" alt="" srcset="" class="AL-deleteArchive">
                          </div>
                        </div>
                      </div>`;
            a += `<div class="AL-Series">` + c + tempB + b + tempA + `</div>`;
          });
          obj.append(a);
          return;
          break;
        default:
          break;
      }
    });
  }
  //图片压缩
  /**
   * 压缩方法
   * @param {string} file 文件
   * @param {Number} quality  0~1之间
   */
  function compressImg(file, quality) {
    if (file[0]) {
      return Promise.all(Array.from(file).map((e) => compressImg(e, quality))); // 如果是 file 数组返回 Promise 数组
    } else {
      return new Promise((resolve) => {
        const reader = new FileReader(); // 创建 FileReader
        reader.onload = ({ target: { result: src } }) => {
          const image = new Image(); // 创建 img 元素
          image.onload = async () => {
            const canvas = document.createElement("canvas"); // 创建 canvas 元素
            canvas.width = image.width;
            canvas.height = image.height;
            canvas
              .getContext("2d")
              .drawImage(image, 0, 0, image.width, image.height); // 绘制 canvas
            const canvasURL = canvas.toDataURL("image/jpeg", quality);
            const buffer = atob(canvasURL.split(",")[1]);
            let length = buffer.length;
            const bufferArray = new Uint8Array(new ArrayBuffer(length));
            while (length--) {
              bufferArray[length] = buffer.charCodeAt(length);
            }
            const miniFile = new File([bufferArray], file.name, {
              type: "image/jpeg",
            });
            resolve({
              file: miniFile,
              origin: file,
              beforeSrc: src,
              afterSrc: canvasURL,
              beforeKB: Number((file.size / 1024).toFixed(2)),
              afterKB: Number((miniFile.size / 1024).toFixed(2)),
            });
          };
          image.src = src;
        };
        reader.readAsDataURL(file);
      });
    }
  }

  //全选
  $("#selectAll").click(function () {
    selectAllOrReSelectAll(1);
    hiddenDrop_down();
  });
  //反选
  $("#reSelectAll").click(function () {
    selectAllOrReSelectAll(2);
    hiddenDrop_down();
  });
  /**
   * 选择方式
   * @param {*} type 1:全选 2反选
   */
  function selectAllOrReSelectAll(type) {
    var selectBox = $(":checked[type='checkbox']");
    var allBox = $("[type='checkbox']");
    var noSelectBox = $("[type='checkbox']:not(:checked)");
    switch (type) {
      case 1:
        if (selectBox.length == allBox.length) {
          selectBox.prop("checked", false);
          $(".dc").removeClass("editOpen");
        } else {
          allBox.prop("checked", true);
          $("#box>.dc:first")
            .addClass("editOpen")
            .siblings()
            .removeClass("editOpen");
        }

        break;
      case 2:
        allBox.each(function () {
          $(this).click();
        });
        break;
      default:
        break;
    }
  }
  //创建角色
  $("#newRole").click(function () {
    var roleName = prompt(
      "请输入角色姓名\n新建角色有点小问题，出现问题请刷新页面TAT",
      ""
    );
    if (roleName != null && roleName != "") {
      var link = document.createElement("input");
      var jq = $(link);
      jq.attr({
        type: "file",
        accept: "image/*",
      });
      jq.on("change", function () {
        var json = new Object();
        var imgP = $(this);
        var imgObj = imgP[0].files[0];
        compressImg(imgObj, uploadImg_scale).then((res) => {
          //compressImg方法见附录
          var url = res.afterSrc;
          json.id = parseInt(getNowTime());
          json.roleName = roleName;
          json.description = "newRole";
          json.imgURl = url;
          newRoleSave(json);
        });
      });
    }
    jq.click();
  });
  //保存新建角色
  function newRoleSave(ele) {
    ele.belongsImgURL = "images/gb.png";
    roleArray.unshift(ele);
    jiazai();
    createNewRoleArray(ele);
    setTimeout(function () {
      jazaiwancheng();
      Init();
      //window.location.reload();
    }, 500);

    //window.location.reload();
  }
  //删除自定义角色
  function deleteRole(id, e) {
    var c = confirm("确认要删除吗？");
    if (c) {
      jiazai();
      deleteNewRoleById(id);
      setTimeout(function () {
        jazaiwancheng();
        Init();
      }, 500);
    }

    e.stopPropagation();
  }
  //上一个表情包
  $(".ToT").click(function (e) {
    expressionCount = expressionCount == 1 ? 3 : --expressionCount;
    ExpressionInit();
    e.stopPropagation();
  });
  //下一个表情包
  $(".ToB").click(function (e) {
    expressionCount = expressionCount == 3 ? 1 : ++expressionCount;
    ExpressionInit();
    e.stopPropagation();
  });
  //打开表情包
  $(".right").on("click", ".imgExpression", function () {
    $(".Gallery").toggleClass("n");
    try {
      ImgOrExpObj = $(this);
      console.log(ImgOrExpObj, ImgOrExpObj.data("type"));
    } catch (error) { }
  });
  //打开/关闭设置列表
  $("#updateSet").click(function () {
    $(".Gallery").toggleClass("disNoneD");
  });
  $(".gb").click(function (e) {
    closeExpression();
  });
  //关闭表情包
  function closeExpression() {
    $(".Gallery").addClass("n");
  }
  //获取图片地址
  function getInputURL(file) {
    var url = null;
    if (window.createObjcectURL != undefined) {
      url = window.createOjcectURL(file);
    } else if (window.URL != undefined) {
      url = window.URL.createObjectURL(file);
    } else if (window.webkitURL != undefined) {
      url = window.webkitURL.createObjectURL(file);
    }
    return url;
  }
  var text = document.getElementById("text");

  autoTextarea(text); // 调用

  function autoTextarea(elem, extra, maxHeight) {
    extra = extra || 0;
    var maxHeight = 0;
    var isFirefox = !!document.getBoxObjectFor || "mozInnerScreenX" in window,
      isOpera = !!window.opera && !!window.opera.toString().indexOf("Opera"),
      addEvent = function (type, callback) {
        elem.addEventListener
          ? elem.addEventListener(type, callback, false)
          : elem.attachEvent("on" + type, callback);
      },
      getStyle = elem.currentStyle
        ? function (name) {
          var val = elem.currentStyle[name];
          if (name === "height" && val.search(/px/i) !== 1) {
            var rect = elem.getBoundingClientRect();

            return (
              rect.bottom -
              rect.top -
              parseFloat(getStyle("paddingTop")) -
              parseFloat(getStyle("paddingBottom")) +
              "px"
            );
          }

          return val;
        }
        : function (name) {
          return getComputedStyle(elem, null)[name];
        },
      minHeight = parseFloat(getStyle("height"));

    elem.style.resize = "none";

    var change = function () {
      var scrollTop,
        height,
        padding = 0,
        style = elem.style;

      if (elem._length === elem.value.length) return;

      elem._length = elem.value.length;

      if (!isFirefox && !isOpera) {
        padding =
          parseInt(getStyle("paddingTop")) +
          parseInt(getStyle("paddingBottom"));
      }

      scrollTop = document.body.scrollTop || document.documentElement.scrollTop;

      elem.style.height = minHeight + "px";

      if (elem.scrollHeight > minHeight) {
        if (maxHeight && elem.scrollHeight > maxHeight) {
          height = maxHeight - padding;

          style.overflowY = "auto";
        } else {
          height = elem.scrollHeight - padding;

          style.overflowY = "hidden";
        }

        style.height = height + extra + "px";

        scrollTop += parseInt(style.height) - elem.currHeight;

        document.body.scrollTop = scrollTop;

        document.documentElement.scrollTop = scrollTop;

        elem.currHeight = parseInt(style.height);
      }
    };

    addEvent("propertychange", change);

    addEvent("input", change);

    addEvent("focus", change);

    change();
  }

  function boxJson(json) {
    boxJsonArray.push(json);
    addTalk(boxJsonArray);
  }

  //计算字节长度-弃用
  // function getLength() {
  //     if (localStorage.getItem('boxJson') != null && localStorage.getItem('boxJson') != '') {
  //         var str = localStorage.getItem('boxJson');
  //         var length = localStorage.getItem('boxJson').length;
  //         var init = length;
  //         for (var i = 0; i < init; i++) {
  //             if (str.charCodeAt(i) > 255) {
  //                 length++;
  //             }
  //         }
  //         var strLength = length;
  //         var changdu = parseFloat(strLength / 1000).toFixed(2) > 1000 ? parseFloat(strLength / 1000000).toFixed(2) + "MB" : parseFloat(strLength / 1000).toFixed(2) + "KB";
  //         $('.stringLength').html(changdu);
  //     }
  // }
  /**
   * 实时修改聊天记录
   * @param {*} index
   * @param {*} text
   */
  function updateBoxOne(index, ele, type) {
    // var keyLen;
    // var valLen;
    // var keys;
    for (let i = 0; i < boxJsonArray.length; i++) {
      if (boxJsonArray[i].index == index) {
        $.each(boxJsonArray[i], function (key, val) {
          if (key == type) {
            if (type == "content") {
              boxJsonArray[i][key] = ele.innerHTML;
            } else {
              boxJsonArray[i][key] = ele.innerText;
            }

          }
        })
        break;
      }
    }
    console.log(boxJsonArray);
    updateTempJson(boxJsonArray);
  }
  //点击显示/隐藏头像和名字
  $("#box").on("click", ".divImg", function (e) {
    ShowOrHidden($(this), e);
  });
  //替换发言人头像
  $("#box").on("click", ".uybt", function (e) {
    e.stopPropagation();
    if (chooseAvatar.roleId == 9999) return;
    var t = $(this).parents(".dc");
    var json = getRoleJson("txt");
    json.date = t.find(".liuyan_date").html();
    var index = t.data("index");
    json.index = index;
    t.find(".liuyan_tx").prop("src", json.path);
    t.find(".pyq_name").html(json.name);
    t.attr("data-roleId", json.roleId)
    t.attr("data-imgId", json.imgId)
    for (let i = 0; i < boxJsonArray.length; i++) {
      if (t.data("index") == boxJsonArray[i].index) {
        boxJsonArray[i].roleId = json.roleId;
        boxJsonArray[i].imgId = json.imgId;
        boxJsonArray[i].path = json.path;
        boxJsonArray[i].name = json.name;
        break;
      }
    }
    insertTalk(boxJsonArray);
  });
  //抽出头像显示隐藏方法
  //点击头像
  function ShowOrHidden(obj, e) {
    var tNs = obj.parents().filter(".dc").prev().find(".gu").data("names");
    var tN = obj.parents().filter(".dc").prev().find(".gu").data("name");
    var bNs = obj.parents().filter(".gu").data("names");
    var bN = obj.parents().filter(".gu").data("name");
    var isT = obj.parents().filter(".dc").prev().find(".gu").data("isyhz");
    var isB = obj.parents().filter(".gu").data("isyhz");
    // console.log("上一个names:", tNs, "上一个name:", tN);
    // console.log("这一个names:", bNs, "这一个name:", bN);
    if (tNs == bNs && bN == tN && isT == isB) {
      if (obj.find("img").is(".width0")) {
        obj.find(".xvb").removeClass("replaceAvatar");
        obj.find(".roleImg").removeClass("width0");
        obj.next().find(".roleNameSpan").removeClass("width0");
        obj.parents().filter(".gu").toggleClass("roleOverallTopMargin");
        obj.next().find(".qp").removeClass("qpW");
        obj.find(".ugbhgjh").removeClass("disNoneD");
      } else {
        obj.find(".roleImg").addClass("width0");
        obj.find(".xvb").addClass("replaceAvatar");
        obj.next().find(".roleNameSpan").addClass("width0");
        obj.parents().filter(".gu").toggleClass("roleOverallTopMargin");
        obj.next().find(".qp").addClass("qpW");
        obj.find(".ugbhgjh").addClass("disNoneD");
      }
    }
  }

  //点击开启移出备选头像队列
  $("#js").click(function () {
    $(this).toggleClass("border2sy");
  });
  /**
   * 获取时分
   */
  function getHm() {
    let now = new Date();
    let hour = now.getHours(); //获取当前小时数(0-23)
    let minute = now.getMinutes(); //获取当前分钟数(0-59)
    let nowTime = "";
    nowTime = fillZero(hour) + ":" + fillZero(minute);
    return nowTime;
  }

  function getNowTime() {
    let now = new Date();
    let year = now.getFullYear(); //获取完整的年份(4位,1970-????)
    let month = now.getMonth() + 1; //获取当前月份(0-11,0代表1月)
    let today = now.getDate(); //获取当前日(1-31)
    let hour = now.getHours(); //获取当前小时数(0-23)
    let minute = now.getMinutes(); //获取当前分钟数(0-59)
    let second = now.getSeconds(); //获取当前秒数(0-59)
    let nowTime = "";
    nowTime =
      year +
      fillZero(month) +
      fillZero(today) +
      fillZero(hour) +
      fillZero(minute) +
      fillZero(second);
    return nowTime;
  }

  function fillZero(str) {
    var realNum;
    if (str < 10) {
      realNum = "0" + str;
    } else {
      realNum = str;
    }
    return realNum.toString();
  }

  //选中对话触发横线
  $("#box").on("click", ".ipt", function (e) {
    var list = $(":checked[class*='ipt']");
    for (let index = 0; index < $(".ipt").length; index++) {
      if ($(list[index]).is(":checked")) {
        $(list[index])
          .parents()
          .filter(".dc")
          .addClass("editOpen")
          .siblings()
          .removeClass("editOpen");
        break;
      }
    }
    console.log($(":checked[class='ipt']").length);
    if (
      $(this).is(":checked") != true &&
      $(":checked[class*='ipt']").length < 1
    ) {
      $(".dc").removeClass("editOpen");
    }
  });
  //网页全屏
  $("#ALLPM").click(function () {
    $(".bodyN").toggleClass("margin0");
  });
  //#region layui事件
  layui.use(["form", "laydate", "util"], function () {
    var layer = layui.layer;
    var form = layui.form;
    form.on("switch(isYHZ)", function (data) {
      // layer.msg('开关 checked：' + (this.checked ? 'true' : 'false'), {
      //     offset: '6px'
      // });
      if (this.checked) {
        $(".YHZTXdiv").removeClass("disNoneD");
      } else {
        $(".YHZTXdiv").addClass("disNoneD");
      }
      isR = this.checked;
    });
  });
  //#endregion

  //#region 小屏幕时触发事件
  //点击显示/关闭左侧工具栏
  $(".topimg").click(function () {
    var leftObj = $(".left");
    leftObj.is(".disNone")
      ? leftObj.removeClass("disNone")
      : leftObj.addClass("disNone");
  });
  //点击显示/关闭角色列表
  $("#qh").click(function () {
    var centerObj = $(".center");
    var rightObj = $(".right");
    // if ($(".center").css("width") == '0') {
    if (centerObj.is(".width00")) {
      centerObj.addClass("width100");
      centerObj.removeClass("width00");
      rightObj.addClass("width00");
      rightObj.removeClass("width100");
    } else {
      centerObj.addClass("width00");
      centerObj.removeClass("width100");
      rightObj.addClass("width100");
      rightObj.removeClass("width00");
    }
  });
  //#endregion
});
