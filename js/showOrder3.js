$(document).ready(function(){
	var theStoreId=getParaValueFromUrl("storeId");
	if(isCanNotAccess(theStoreId)){
		doBizMain(2);
	}else{
		doBizMain(theStoreId);
	}
})

var firstEmptyDefaultName="取餐号";
var secendEmptyDefaultName="排队号1";
var thirdEmptyDefaultName="排队号2";
var fourEmptyDefaultName="排队号3";
var fiveEmptyDefaultName="排队号4";
var sixEmptyDefaultName="排队号5";
var sevenEmptyDefaultName="排队号6";

function doBizMain(storeId){
	postJson(system_config.interface_biz_host_url+"/listWindowOneWithoutToken.do?storeId="+storeId,
			{"storeId":storeId},
		function(json) {
			if(json.resultCode==200){
				var oneData=json.list[0];
				if(json.list.length==0){
					$("#readyNext0").html(firstEmptyDefaultName);
					$("#readyNext1").html(secendEmptyDefaultName);
					$("#readyNext2").html(thirdEmptyDefaultName);
					$("#readyNext3").html(fourEmptyDefaultName);
					$("#readyNext4").html(fiveEmptyDefaultName);
					$("#readyNext5").html(sixEmptyDefaultName);
					$("#readyNext6").html(sevenEmptyDefaultName);
				}
				if(json.list.length==1){
					$("#readyNext0").html(getShowName(json.list[0]));
					$("#readyNext1").html(secendEmptyDefaultName);
					$("#readyNext2").html(thirdEmptyDefaultName);
					$("#readyNext3").html(fourEmptyDefaultName);
					$("#readyNext4").html(fiveEmptyDefaultName);
					$("#readyNext5").html(sixEmptyDefaultName);
					$("#readyNext6").html(sevenEmptyDefaultName);
				}
				if(json.list.length==2){
					$("#readyNext0").html(getShowName(json.list[0]));
					$("#readyNext1").html(getShowName(json.list[1]));
					$("#readyNext2").html(thirdEmptyDefaultName);
					$("#readyNext3").html(fourEmptyDefaultName);
					$("#readyNext4").html(fiveEmptyDefaultName);
					$("#readyNext5").html(sixEmptyDefaultName);
					$("#readyNext6").html(sevenEmptyDefaultName);
				}
				if(json.list.length==3){
					$("#readyNext0").html(getShowName(json.list[0]));
					$("#readyNext1").html(getShowName(json.list[1]));
					$("#readyNext2").html(getShowName(json.list[2]));
					$("#readyNext3").html(fourEmptyDefaultName);
					$("#readyNext4").html(fiveEmptyDefaultName);
					$("#readyNext5").html(sixEmptyDefaultName);
					$("#readyNext6").html(sevenEmptyDefaultName);
				}
				if(json.list.length==4){
					$("#readyNext0").html(getShowName(json.list[0]));
					$("#readyNext1").html(getShowName(json.list[1]));
					$("#readyNext2").html(getShowName(json.list[2]));
					$("#readyNext3").html(getShowName(json.list[3]));
					$("#readyNext4").html(fiveEmptyDefaultName);
					$("#readyNext5").html(sixEmptyDefaultName);
					$("#readyNext6").html(sevenEmptyDefaultName);
				}
				if(json.list.length==5){
					$("#readyNext0").html(getShowName(json.list[0]));
					$("#readyNext1").html(getShowName(json.list[1]));
					$("#readyNext2").html(getShowName(json.list[2]));
					$("#readyNext3").html(getShowName(json.list[3]));
					$("#readyNext4").html(getShowName(json.list[4]));
					$("#readyNext5").html(sixEmptyDefaultName);
					$("#readyNext6").html(sevenEmptyDefaultName);
				}
				if(json.list.length==6){
					$("#readyNext0").html(getShowName(json.list[0]));
					$("#readyNext1").html(getShowName(json.list[1]));
					$("#readyNext2").html(getShowName(json.list[2]));
					$("#readyNext3").html(getShowName(json.list[3]));
					$("#readyNext4").html(getShowName(json.list[4]));
					$("#readyNext5").html(getShowName(json.list[5]));
					$("#readyNext6").html(sevenEmptyDefaultName);
				}
				if(json.list.length==7){
					$("#readyNext0").html(getShowName(json.list[0]));
					$("#readyNext1").html(getShowName(json.list[1]));
					$("#readyNext2").html(getShowName(json.list[2]));
					$("#readyNext3").html(getShowName(json.list[3]));
					$("#readyNext4").html(getShowName(json.list[4]));
					$("#readyNext5").html(getShowName(json.list[5]));
					$("#readyNext6").html(getShowName(json.list[6]));
				}
				//语音播报
        if(oneData.deliverOrder!=sessionStorage.getItem("mealNumber")){
          voiceAnnouncements(oneData.deliverOrder)
				} 
			}
	});
	
}

function getShowName(json){
	var nameTxt=json.deliverOrder;
	if(json.todayOrderNumber){//有拆单
		nameTxt+="(C"+json.todayOrderNumber+")";
	}
	return nameTxt;
}

//语音播报
function voiceAnnouncements(str){
  //百度
  var str2 = str+ "号请取餐"
  var url = "https://tts.baidu.com/text2audio?cuid=baike&lan=ZH&ctp=1&pdt=301&vol=9&rate=32&per=0&tex="   + encodeURI(str2);
  // var url = "http://tts.baidu.com/text2audio?lan=zh&ie=UTF-8&text=" + encodeURI(str2);        // baidu
  var n = new Audio(url);
  n.src = url;
  n.play();
  sessionStorage.setItem("mealNumber",str)
}
