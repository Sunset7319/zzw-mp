$(document).ready(function(){
	var theStoreId=getParaValueFromUrl("storeId");
	if(isCanNotAccess(theStoreId)){
		doBizMain(2);
	}else{
		doBizMain(theStoreId);
	}
})

var listOneHasData=false;
var listTwoHasData=false;
var thePlayStatus=false;

var firstEmptyDefaultName="取餐号";
var secendEmptyDefaultName="排队号1";
var thirdEmptyDefaultName="排队号2";

function doBizMain(storeId){
	postJson(system_config.interface_biz_host_url+"/listWindowOneWithoutToken.do?storeId="+storeId,
			{"storeId":storeId},
		function(json) {
			if(json.resultCode==200){
				
				var dataLength=json.list.length;
				listOneHasData=dataLength>0?true:false;

				//数据清空时，清除显示
				if(dataLength==0){
					$("#readyNum").html(firstEmptyDefaultName);
					$("#readyNext1").html(secendEmptyDefaultName);
					$("#readyNext2").html(thirdEmptyDefaultName);

				}else if(dataLength==1){
					var oneData=json.list[0];
					var firstReady=false;
					if(oneData.status==2){
						firstReady=true;
					}
					if(firstReady){
						$("#readyNum").html(getShowName(oneData));
						$("#readyNext1").html(secendEmptyDefaultName);
						$("#readyNext2").html(thirdEmptyDefaultName);
					}else{
						$("#readyNum").html(firstEmptyDefaultName);
						$("#readyNext1").html(getShowName(oneData));
						$("#readyNext2").html(thirdEmptyDefaultName);
					}
				}else if(dataLength==2){
					var oneData=json.list[0];
					var firstReady=false;
					if(oneData.status==2){
						firstReady=true;
					}
					if(firstReady){
						$("#readyNum").html(getShowName(oneData));
						$("#readyNext1").html(getShowName(json.list[1]));
						$("#readyNext2").html(thirdEmptyDefaultName);
					}else{
						$("#readyNum").html(firstEmptyDefaultName);
						$("#readyNext1").html(getShowName(oneData));
						$("#readyNext2").html(getShowName(json.list[1]));
					}					
				}else if(dataLength>=3){
					var oneData=json.list[0];
					var firstReady=false;
					if(oneData.status==2){
						firstReady=true;
					}
					if(firstReady){
						$("#readyNum").html(getShowName(oneData));
						$("#readyNext1").html(getShowName(json.list[1]));
						$("#readyNext2").html(getShowName(json.list[2]));
					}else{
						$("#readyNum").html(firstEmptyDefaultName);
						$("#readyNext1").html(getShowName(oneData));
						$("#readyNext2").html(getShowName(json.list[1]));
					}						
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
	// if(json.payType==4){//其他支付方式
	// 	nameTxt+="未";
	// }
	if(json.todayOrderNumber){//有拆单
		nameTxt+="(C"+json.todayOrderNumber+")";
	}
	return nameTxt;
}

function getFoodName(json){
	if(json.foodName.indexOf("·")>0){
		return json.foodName.substr(0,json.foodName.indexOf("·"));
	}else{
		var foodNames=json.foodName.split(",");
		// if(foodNames.length==1){
		// 	return json.foodName.substr(0,5);
		// }else{
		// 	return json.foodName.substr(0,5)+"共"+(foodNames.length)+"碗";
		// }
		if (json.ext1 == "soup") {
			if(foodNames.length==1){
				return json.foodName.substr(0,5)+"-汤";
			}else{
				return json.foodName.substr(0,5)+"共"+(foodNames.length)+"碗"+"-汤";
			}
		}else{
			if(foodNames.length==1){
				return json.foodName.substr(0,5);
			}else{
				return json.foodName.substr(0,5)+"共"+(foodNames.length)+"碗";
			}
		}
	}
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
