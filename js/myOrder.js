$(document).ready(function(){
	enlargeFontSizeCorrect();
	doBizMain();
})

function doBizMain(){//所有的业务方法写到这里
	mui.init();
	
	OpenMidas.init("release");
	
	loadMyOrders();

	loadMyTrollyList();
}

function loadMyOrders(){
	var searchJson={"userOpenId":store.get(system_config.wx_user_openid),"pageSize":100};
	loadMyOrdersFromApi(searchJson);
}

function loadMyOrdersFromApi(searchJson){
	postJson(system_config.interface_biz_host_url+"/listMyOrderWithoutToken.do",
			searchJson,
		function(json) {
			console.log(json);
			if (json.resultCode == 200) {
				if(json.list.length>0){
					$.each(json.list,function(index,oneData){
						var menu = '';
						for(var i=0;i<oneData.productVoList.length;i++){
							menu+='	<div class="order-info-center-commodity">';
							menu+='		<div class="order-info-center-commodity-info">';
							menu+='				<img src='+oneData.productVoList[i].imageUrl+'>';
							menu+='				<span>'+oneData.productVoList[i].name+'</span>';
							menu+='		</div>';
							menu+='		<div class="order-info-center-commodity-num">x'+oneData.productVoList[i].theNum+'</div>';
							menu+='		<div class="order-info-center-commodity-price">'+getSubtotalMoney(oneData.productVoList[i].price)+'</div>';
							menu+='	</div>';
						}
						var deliverOrderList = '';
						for(var j=0;j<oneData.userOrderVoList.length;j++){
							if(oneData.todayOrderNumber){
								if(oneData.userOrderVoList.length==1){
									deliverOrderList += oneData.userOrderVoList[j].deliverOrder+"(C"+oneData.todayOrderNumber+")"
								}else{
									if(j==oneData.userOrderVoList.length-1){
										deliverOrderList += oneData.userOrderVoList[j].deliverOrder+"(C"+oneData.todayOrderNumber+")"
									}else{
										deliverOrderList += oneData.userOrderVoList[j].deliverOrder+"(C"+oneData.todayOrderNumber+")"+","
									}
								}
							}else{
								if(oneData.userOrderVoList.length==1){
									deliverOrderList += oneData.userOrderVoList[j].deliverOrder
								}else{
									if(j==oneData.userOrderVoList.length-1){
										deliverOrderList += oneData.userOrderVoList[j].deliverOrder
									}else{
										deliverOrderList += oneData.userOrderVoList[j].deliverOrder +","
									}
								}
							}
						}
						var oneHtml='';
						oneHtml+='<div class="order-info" onclick="toOrderDetail('+oneData.serNum+')">';
						oneHtml+='<div class="order-info-header">';
						oneHtml+='	<img src='+oneData.userOrderVoList[0].restaurantImage+' class="order-info-header-shopIcon">';
						oneHtml+='	<span class="order-info-header-shopName">'+oneData.userOrderVoList[0].restaurantName+'</span>';
						oneHtml+='	<span class="order-info-header-shopOrderTime">'+formatDateToStrNoYear(oneData.createTime)+'</span>';
						oneHtml+='	<span class="order-info-header-shopMealNumber">';
						if(oneData.deliverStatus=="ON_THE_WAY"){
							oneHtml+='正出餐';
						}else if(oneData.deliverStatus=="DELIVERED"){
							oneHtml+='请取餐';
						}else if(oneData.deliverStatus=="CONFIRMED"||oneData.deliverStatus=="CLOSED"){
							oneHtml+='已关单';
						}
						
						oneHtml+='<span>(取餐号:'+deliverOrderList+')</span></span>';
						oneHtml+='</div>';
						oneHtml+='<div class="order-info-center">';
						oneHtml+=menu;
						// oneHtml+='	<div class="order-info-center-commodity">';
						// oneHtml+='		<div class="order-info-center-commodity-info">';
						// oneHtml+='				<img src="">';
						// oneHtml+='				<span></span>';
						// oneHtml+='		</div>';
						// oneHtml+='		<div class="order-info-center-commodity-num">x1</div>';
						// oneHtml+='		<div class="order-info-center-commodity-price"></div>';
						// oneHtml+='	</div>';
						oneHtml+='	<div class="order-info-center-commodityTotal">共'+oneData.productVoList.length+'份餐品，合计：<span>';
						if(!isCanNotAccess(oneData.totalFee)&&!isCanNotAccess(oneData.balance)){
							oneHtml+=getSubtotalMoney(oneData.totalFee+oneData.balance);
						}else if(!isCanNotAccess(oneData.totalFee)){
							oneHtml+=getSubtotalMoney(oneData.totalFee);
						}else if(!isCanNotAccess(oneData.totalFee)){
							oneHtml+=getSubtotalMoney(oneData.balance);
						}
						oneHtml+='</span></div>';
						oneHtml+='</div>';
						oneHtml+='<div class="order-info-footer">';
						oneHtml+='	<div class="order-info-footer-process">';
						oneHtml+='		<div class="order-info-footer-process1">';
						oneHtml+='				<span class="mui-icon iconfont el-icon-ch-dui"></span>';
						if(oneData.payTime=="PAY_NOW"){
							oneHtml+='				<div class="order-info-footer-process1-font">已支付</div>';
						}else if(oneData.payTime=="PAY_YUE"){
							oneHtml+='				<div class="order-info-footer-process1-font">余额支付</div>';
						}else{
							oneHtml+='				<div class="order-info-footer-process1-font"><font color="red">现场支付</font></div>';
						}
						oneHtml+='		</div>';
						oneHtml+='		<div class="order-info-footer-process2">';
						oneHtml+='				<div class="order-info-footer-process2-window">'+oneData.deliverAddress+'</div>';
						oneHtml+='				<div class="order-info-footer-process2-font">取餐窗口</div>';
						oneHtml+='		</div>';
						oneHtml+='	</div>';
						oneHtml+='</div>';
						oneHtml+='</div>';	
						$("#myOrderList").append(oneHtml);
					});					
				}else{
					var emptyHtml='';
					emptyHtml+='<div class="order-not">';
					emptyHtml+='<div class="order-not-font">订单空空如也</div>';
					emptyHtml+='<button class="order-not-button"  onclick="gotoIndexPage()">去下一单</button>';
					emptyHtml+='</div>';
					$("#myOrderList").html(emptyHtml);
				}
				
			}
	});	
}

function toOrderDetail(orderSerNum){
	window.location="orderDetail.html?orderSerNum="+orderSerNum+"&v="+new Date().getTime();
}

function gotoIndexPage(){
	window.location.href="index.html?20200828";
}

function getSubtotalMoney(thePrice){
	return '￥'+parseFloat(thePrice/100).toFixed(2)+'元';
}

