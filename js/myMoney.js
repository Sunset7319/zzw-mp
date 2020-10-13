$(document).ready(function(){
	enlargeFontSizeCorrect();
	doBizMain();
})

function doBizMain(){//所有的业务方法写到这里
	mui.init();
	
	OpenMidas.init("release");
	
	loadMyInfo();

	$(".commodity").click(function(){
		//mui.alert("即将开放，敬请期待！");
		
		var theChargeFee=$(this).attr("title");
		postJson(system_config.interface_biz_host_url+"/chargeBizOrderWithoutToken.do",
				{"userOpenId":store.get(system_config.wx_user_openid),"totalFee":theChargeFee},
			function(json) {
				if (json.resultCode == 200) {//完全获取到用户信息
					var theNonceStr = json.nonceStr;
					var theTimeStamp =json.timeStamp;
					var appId = json.wxId;
					var thePkg = "prepay_id=" + json.prepayId;
					var theSign = json.sign;


					WeixinJSBridge.invoke('getBrandWCPayRequest', {
						"appId" : appId,
						"timeStamp" : theTimeStamp,
						"nonceStr" : theNonceStr,
						"package" : thePkg,
						"signType" : "MD5",
						"paySign" : theSign
					}, function(res) {
						WeixinJSBridge.log(res.err_msg);
						if (res.err_msg == "get_brand_wcpay_request:ok") {
							loadMyInfo();
						} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
							deleteMyOrder(json.id);
							mui.alert("您已经取消充值!", '充值操作', function() {});
						} else {
							mui.alert(JSON.stringify(res), '充值操作', function() {});
						}
					});
				}else{
					mui.alert(json.resultMessage, '充值操作', function() {});
				}
		});
	});
}

function loadMyInfo(){
	var userOpenId=store.get(system_config.wx_user_openid);
    
	postJson(system_config.interface_biz_host_url+"/getMyBalanceWithoutToken.do",
			{"userOpenId":userOpenId},
		function(json) {
			if (json.resultCode == 200) {//完全获取到用户信息
				if(!isCanNotAccess(json.balance)){
					$(".userBalance").text(getSubtotalMoney(json.balance));
				}
			}
	});
	
	
}
