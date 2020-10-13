$(document).ready(function () {
	enlargeFontSizeCorrect();
	doBizMain();
});


function doBizMain() {//所有的业务方法写到这里
	mui.init();
	loadOrderDetailInfo();//加载最近的产品信息
	if(store.get(system_config.user_selected_store)==2){
		// getActivityPrice();
		// $("#circletxt").show();
		// $("#circlecen").show();
	}else{
		// $("#circletxt").hide();
		// $("#circlecen").hide();
		
	}
}

var theTimeTaskId;


function getActivityPrice() {
	var searchJson = { "userOpenId": store.get(system_config.wx_user_openid) };
	postJson(system_config.interface_biz_host_url + "/totalPriceActivity.do",
		searchJson,
		function (json) {
			if (json.resultCode == 200) {
				let Price = json.surplusPrice;
				if (json.surplusPrice >= 10000) {
					$("#circlecen").css("display","none");
				} else {
					$("#thspirce").append(Price / 100);
				}
			} else {
				console.log("系统错误");
			}
		});
}

function loadOrderDetailInfo() {
	var theOrderSerNum = getParaValueFromUrl("orderSerNum");
	if (!isCanNotAccess(theOrderSerNum)) {
		postJson(system_config.interface_biz_host_url + "/getOrderBySerNumWithoutToken.do",
			{ "serNum": theOrderSerNum },
			function (json) {
				if (json.resultCode == 200) {
					if(json.payTime=="PAY_NEXT"){
						$("#payTimeTxt").html("<font color='red'>需现场支付</font>");
					}else if(json.payTime=="PAY_YUE"){
						$("#payTimeTxt").html("余额支付");
					}else if(json.payTime=="PAY_NOW"){
						if(json.balance>0){
							$("#payTimeTxt").html("混合支付");
						}else{
							$("#payTimeTxt").html("微信支付");
						}
					}
					if (!isCanNotAccess(json.userOrderVoList) && !isCanNotAccess(json.userOrderVoList.length) && json.userOrderVoList.length > 0) {
						$("#orderDetailProductList").empty();
						for (var i = 0; i < json.productVoList.length; i++) {
							var productList = '';
							productList += '<div class="orderDetail-orderInfo-commodity-shop2">';
							productList += '				<div class="orderDetail-orderInfo-commodity-shop2-left">';
							productList += '					<img src=' + json.productVoList[i].imageUrl + ' class="orderDetail-orderInfo-commodity-img">';
							productList += '					<span  class="orderDetail-orderInfo-commodity-shop2-name">' + json.productVoList[i].name + '</span>';
							productList += '				</div>';
							productList += '				<div class="orderDetail-orderInfo-commodity-shop2-right">	';
							productList += '					<span class="orderDetail-orderInfo-commodity-shop2-num">x' + json.productVoList[i].theNum + '</span>';
							if(json.productVoList[i].price>0){
								productList += '					<span class="orderDetail-orderInfo-commodity-shop2-price" id="orderProductPrice">' + getSubtotalMoney(json.productVoList[i].price) + '</span>';
							}
							productList += '				</div>';
							productList += '			</div>';
							$("#orderDetailProductList").append(productList);
						}
						for (var j = 0; j < json.userOrderVoList.length; j++) {
							if(json.userOrderVoList.length==1){
								if(json.todayOrderNumber){
									$("#orderNumber").append(json.userOrderVoList[j].deliverOrder+"(C"+json.todayOrderNumber+")");
								}else{
									$("#orderNumber").append(json.userOrderVoList[j].deliverOrder);
								}
							}else{
								let a ;
								if(json.todayOrderNumber){
									if(j==json.userOrderVoList.length-1){
										a = json.userOrderVoList[j].deliverOrder+"(C"+json.todayOrderNumber+")"
									}else{
										a = json.userOrderVoList[j].deliverOrder+"(C"+json.todayOrderNumber+")"+",<br>"
									}
									$("#orderNumber").append(a);
								}else{
									if(j==json.userOrderVoList.length-1){
										a = json.userOrderVoList[j].deliverOrder
									}else{
										a = json.userOrderVoList[j].deliverOrder+","
									}
									$("#orderNumber").append(a);
								}
							}
						}
						$("#orderId").text(json.userOrderVoList[0].id);
						$("#orderCreateTime").text(formatDateToStr(json.userOrderVoList[0].createDate));
						if (!isCanNotAccess(json.deliverAddress)) {
							$("#orderWindowNumber").text(json.deliverAddress);
						}else{
							$("#orderWindowNumber").text("2");
						}
						if(json.balance>=0){
							$("#orderPaidPrice").text(getSubtotalMoney(json.totalFee+json.balance));
						}else{
							$("#orderPaidPrice").text(getSubtotalMoney(json.totalFee));
						}
						$("#orderDetail-prompt").text("TIPS：请留意屏幕上的排队信息，不要错过取餐时间");
						$("#theLoadImg").hide();
						if (!isCanNotAccess(theTimeTaskId)) {
							clearInterval(theTimeTaskId);
						}
					} else {
						$("#orderDetail-prompt").text("系统正在分单派单中，请稍后，马上更新");
						$("#theLoadImg").show();
						if (isCanNotAccess(theTimeTaskId)) {
							theTimeTaskId = window.setInterval("loadOrderDetailInfo()", 1000);
						}
					}
					
					// if(store.get(system_config.user_selected_store)==3
					// 		&&json.payStatus=="PAID"&&json.giftStatus!=1&&json.showBonus){
					// 	var lotHtml='';
						
					// 	lotHtml+='<div onclick="gotoLottery(\''+json.id+'\')" style="height:80px;vertical-align:middle;">';
					// 	lotHtml+='<img src="./img/dan.jpg" alt="" style="height:80px;">';
					// 	lotHtml+='<span style="line-height: 80px;">砸金蛋抽奖机会</span>';
					// 	lotHtml+='</div>';

					// 	$("#circletxt").html(lotHtml);
					// 	$("#circletxt").show();

					// }
					
				}
			});
	} else {
		mui.alert("页面加载错误！");
	}
}

function getSubtotalMoney(thePrice) {
	return '￥' + parseFloat(thePrice / 100).toFixed(2) + '元';
}


function gotoLottery(id){
	window.location="./lottery.html?id="+id;
}
