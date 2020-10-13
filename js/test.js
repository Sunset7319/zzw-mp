$(document).ready(function(){
	
	enlargeFontSizeCorrect();
	doBizMain();
})

function doBizMain(){//所有的业务方法写到这里
	mui.init();
	OpenMidas.init("release");
	loadMyInfo();
	loadMyTrollyList();
}

function loadMyInfo(){
	var userOpenId=store.get(system_config.wx_user_openid);
    var headPortraitUrl = store.get(system_config.wx_user_headimgurl);
    var userName = store.get(system_config.wx_user_nickname);
    console.log(headPortraitUrl);
    let oneHtml = '';
    oneHtml += '<img src="'+headPortraitUrl+'">'
    oneHtml += '<span class="userName">'+userName+'</span>'
    $("#headPortrait").append(oneHtml);
    
    
	postJson(system_config.interface_biz_host_url+"/getMyBalanceWithoutToken.do",
			{"userOpenId":userOpenId},
		function(json) {
			if (json.resultCode == 200) {//完全获取到用户信息
				if(!isCanNotAccess(json.balance)){
					$(".content-tab-money").text(getSubtotalMoney(json.balance));
				}
			}
	});    
  postJson(system_config.interface_biz_host_url+"/listBizStoreAccountWithoutToken.do",
			{"userOpenId":userOpenId,"storeId":store.get(system_config.user_selected_store)},
		function(json) {
			if (json.resultCode == 200) {
				if (!json.list[0]) {
					$("#business")[0].style.display = "none"
				} else {
					$("#business")[0].style.display = "block"
				}
			}
	}); 
    $("#myMoney").click(function(){
    	window.location="./changeDetails.html";
    });
    
    $("#myOrders").click(function(){
    	window.location="./myOrder.html";
    });
    $("#business").click(function(){
    	window.location="http://www.zzwct.com/h5/";
    });
    
    $("#myStorage").click(function(){
    	localStorage.clear();
    	if(isCanNotAccess(store.get(system_config.wx_user_nickname))){
			mui.alert("清除成功！", '提示', function() {
				window.location="./index.html?20200828";
			});
    	}
    });
}

