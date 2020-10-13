$(document).ready(function(){
	enlargeFontSizeCorrect();
	doBizMain();
})

function doBizMain(){//所有的业务方法写到这里
	mui.init();
	if(isCanNotAccess(getParaValueFromUrl("id"))){
		$("#showErrDiv").show();
		$(".app").hide();
	}else{
		loadLottery();
	}
}

 function loadLottery(params) {
	 for (let i = 0; i < 4; i++) {
		$(".lotteryEgg")[i].addEventListener("click", function(){
			postJson(system_config.interface_biz_host_url + "/lotteryOrderWithoutToken.do",
					{ "orderId": getParaValueFromUrl("id"),"userOpenId":store.get(system_config.wx_user_openid)},
					function (json) {
						
						if(json.resultCode==200){
							$(".congratulations").text("恭喜您！！！");
							$(".reward-label").text("获得"+json.giftDesc+"，已存入您的余额");								
						}else if(json.resultCode==201){
							$(".congratulations").text("很不幸！！！");
							$(".reward-label").text("今日奖品已派完，请明日再来！");							
						}else{
							$(".congratulations").text("运行错误！！！");
							$(".reward-label").text(json.resultMessage);
						}
						$(".winningMask").css({"display":"block"});
						
			});
		});
		 
	 }
	
 }