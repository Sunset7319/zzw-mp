function initWeixin(pageName) {
	var ua = navigator.userAgent.toLowerCase();

	if (ua.match(/MicroMessenger/i) != "micromessenger") {
		console.log("Not Open in Wechat, redirect to H5 use phone number and password to login system");
		window.location=replaceUrl(pageName,system_config.mp_url,system_config.h5_url);		
	} else {
		var userOpenId=store.get(system_config.wx_user_openid);
		if(isCanNotAccess(userOpenId)){
			doWeixinLogin(pageName);
		}else{
			$("#userOpenId").text(userOpenId);
			var userNickname=store.get(system_config.wx_user_nickname);
			if(isCanNotAccess(userNickname)){//获取用户信息失败，重新获取
				getUserInfoByOpenId(userOpenId,"","",pageName);
			}
		}
	}
	
}

function doWeixinLogin(pageName){
	if (isCanNotAccess(getParaValueFromUrl("code"))) {// 第一次需要授权跳转
		redirectToWeixinLoginPage(pageName,"snsapi_base","base");
	} else { // 跳转回来
		var theCode = getParaValueFromUrl("code");
		var visitState=getParaValueFromUrl("state");
		
		postJson(system_config.interface_wx_host_url+"/getUserOpenIdFromCodeWithoutToken.do",
				{"code":theCode,"state":visitState},
			function(json) {
				console.log(JSON.stringify(json));
				if (json.resultCode == 200) {
					//获得userOpenId后一定要存储，否则会死循环
					store.set(system_config.wx_user_openid,json.userOpenId);
					$("#userOpenId").text(json.userOpenId);
					getUserInfoByOpenId(json.userOpenId,json.accessToken,json.state,pageName);
				}else{
					console.log("系统错误");
				}
		});

	}	
}

function redirectToWeixinLoginPage(pageName,infoScope,state){
	var theWXURL = "";
	theWXURL += "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx29bbe398287f33c0&redirect_uri=";
	if(pageName.startsWith("http://www.zzwct.com")||pageName.startsWith("https://www.zzwct.com")){
		theWXURL += encodeURI(pageName);
	}else{
		theWXURL += encodeURI("http://www.zzwct.com/forward.html?tourl="+pageName);
	}
	theWXURL += "&response_type=code&scope="+infoScope+"&state="
			+ state + "#wechat_redirect";
	window.location = theWXURL;
}

function getUserInfoByOpenId(userOpenId,accessToken,state,pageName) {
	postJson(system_config.interface_wx_host_url+"/getUserInfoByUserOpenIdWithoutToken.do",
			{"userOpenId":userOpenId,"accessToken":accessToken,"state":state},
		function(json) {
			if (json.resultCode == 200) {//完全获取到用户信息
				storeWeixinUserInfo(json,pageName);
			}
	});
}


function storeWeixinUserInfo(json,pageName){
	store.set(system_config.wx_user_nickname,json.nickname);
	store.set(system_config.wx_user_headimgurl,json.headimgurl);
	store.set(system_config.wx_user_country,json.country);
	store.set(system_config.wx_user_province,json.province);
	store.set(system_config.wx_user_sex,json.sex);
	store.set(system_config.wx_user_language,json.language);
}


