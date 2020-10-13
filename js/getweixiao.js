if(getParaValueFromUrl("wxcode")){//微校跳转链接回来后执行
	console.log(new Date().toLocaleString())
	localStorage.setItem("wxcodeTime",new Date().toLocaleString())
  doWeixiaoLogin(window.location.href.split("?")[0]);
}
function initWeixiao(pageName) {
	var ua = navigator.userAgent.toLowerCase();

	if (ua.match(/MicroMessenger/i) != "micromessenger") {
		console.log("Not Open in Wechat, redirect to H5 use phone number and password to login system");
	} else {
		var cardNumber=store.get(system_config.weixiao_cardnumber);

		if(isCanNotAccess(cardNumber)){
			if(!isCanNotAccess(store.get(system_config.wx_user_openid))){
				postJson(system_config.interface_wx_host_url+"/getWeixiaoInfoByUserOpenIdWithoutToken.do",
						{"userOpenId":store.get(system_config.wx_user_openid)},
					function(json) {
						if (json.resultCode == 200) {//已经登录过的用户
							storeWeixiaoUserInfo(json);
						}else{
							doWeixiaoLogin(pageName);
						}
				});
			}else{
				alert("请先关注公众号！");
			}
		}else{
			doBizMain();
		}
	}
}

function doWeixiaoLogin(pageName){
	if (isCanNotAccess(getParaValueFromUrl("wxcode"))) {// 第一次需要授权跳转
		redirectToWeixiaoLoginPage(pageName,"","");
	} else { // 跳转回来
		var cardNumber=store.get(system_config.weixiao_cardnumber);
		if(isCanNotAccess(cardNumber)){		
			var theWxCode = getParaValueFromUrl("wxcode");
			// console.log("微校code",theWxCode)
			if(!isCanNotAccess(theWxCode)){//wxcode不为空
					postJson("/api/wx/v02/card/number",
							{"wxcode":theWxCode,"userOpenId":store.get(system_config.wx_user_openid),"redirectUri":pageName},
						function(json) {
							//alert(JSON.stringify(json));
							if (json.resultCode == 200) {//完全获取到用户信息
								storeWeixiaoUserInfo(json);
								mui.toast('获取微信信息成功！正在支付，请稍后');
								console.log("获取微信信息成功！",json)
							}else{
								// alert("获取微校信息失败");
								mui.alert(json.resultMessage, '获取微校信息失败', function() {

								});
							}
					});				
			}
		}
	}	
}

function redirectToWeixiaoLoginPage(pageName,infoScope,state){
	var theWXURL = "";theWXURL += "https://open.wecard.qq.com/connect/oauth/authorize?app_key=3D68B972BC3DD221&response_type=code&scope=snsapi_base&ocode=1014714333&redirect_uri="
	theWXURL += encodeURI(pageName);
	// alert(theWXURL);
	window.location = theWXURL;
}

function storeWeixiaoUserInfo(json){
	store.set(system_config.weixiao_cardnumber,json.cardNumber);
	// store.set(system_config.weixiao_name,json.name);
	$("#cardNumber").text(json.cardNumber);

	//获取到微校卡号后唤起微校支付
	var para = localStorage.getItem("weixiaoRturnFunctionPara")
	if(para=="weixiao"){
		payTrolleyByMode("weixiao");//购物车微校支付
	}else{
		doBuyPackage(para);//套餐微校支付
	}
}