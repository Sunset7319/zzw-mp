$(document).ready(function(){
	enlargeFontSizeCorrect();
	doBizMain();
})

function doBizMain(){//所有的业务方法写到这里
	mui.init();
	
	OpenMidas.init("release");
	
	loadMyBalanceLogInfo();

}

function loadMyBalanceLogInfo(){
	var userOpenId=store.get(system_config.wx_user_openid);
	var queryParaJson={"userOpenId":userOpenId};
	queryParaJson.pageSize=1000;
	queryParaJson.pageNo=1;
	
	postJson(system_config.interface_biz_host_url+"/listPortalUserBalanceLogWithoutToken.do",
			queryParaJson,
		function(json) {
			console.log(json);
			
			if (json.resultCode == 200) {//完全获取到用户信息
				$("#theDataListDiv").empty();
				
				$.each(json.list,function (index, oneData) {
					var oneHtml='';
					oneHtml+='';
					oneHtml+='<div class="changeContent">';
					oneHtml+='<div class="change-body">';
					if (oneData.money > 0) {
						oneHtml+='	<p class="change-priceGreen">'+getSubtotalMoney(oneData.money)+'</p>';
					}else{
						oneHtml+='	<p class="change-priceRed">'+getSubtotalMoney(oneData.money)+'</p>';
					}
					
					oneHtml+='	<p class="change-txt">'+oneData.detailed+'</p>';
					oneHtml+='	<p class="change-date">'+formatDateToStrWithoutSecend(oneData.createTime)+'</p>';
					oneHtml+='</div>';
					oneHtml+='</div>';
					$("#theDataListDiv").append(oneHtml);
				});
			}
	});  
}