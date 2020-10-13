$(document).ready(function(){
	initWeixin(window.location.href);
})


function doBizMain(){//所有的业务方法写到这里
	mui.init();
	console.log("start load page biz data");
	loadOrderDetailInfo();//加载最近的产品信息
	loadCustomerServiceNumber();
}

function loadOrderDetailInfo(){
	var theOrderId=getParaValueFromUrl("orderId");
	if(!isCanNotAccess(theOrderId)){
		postJson(system_config.interface_biz_host_url+"/getBizOrderWithoutToken.do",
				{"id":theOrderId},
			function(json) {
					if (json.resultCode == 200) {
						$("#deliverName").val(json.deliverName);
						$("#deliverPhone").val(json.deliverPhone);
						$("#deliverPhone").attr("href","tel:"+json.deliverPhone);
						$("#deliverPhone").attr("color","blue");
						$("#ext1").val(json.ext1);
						$("#deliverAddress").val(json.deliverAddress);
						
						var allItems=JSON.parse(json.productDetailJson);
						
						$.each(allItems,function(index,prodJson){
							var oneItemStr='';
							oneItemStr+='<div class="productItem">';
							oneItemStr+='<div class="mui-row" style="background:#fff">';
							oneItemStr+='	<div class="mui-col-sm-6 mui-col-xs-9">';
							oneItemStr+='		<img src="'+prodJson.icon+'" id="goods-icon" />';
							oneItemStr+='		<div id="goods-name" style="width:40%">'+prodJson.name+'</div>';
							oneItemStr+='		<div id="goods-price">'+'&nbsp;&nbsp;￥'+parseFloat(prodJson.price/100).toFixed(2)+'元/'+prodJson.unit;
							if(!isCanNotAccess(prodJson.specification)){
								oneItemStr+='('+prodJson.specification+')';
							}
							oneItemStr+='      </div>';
							oneItemStr+='	</div>';
							oneItemStr+='	<div class="mui-col-sm-6 mui-col-xs-3">';
							oneItemStr+='		<div class="goods-totle">';
							oneItemStr+='			<span id="quantity">'+prodJson.quantity+'</span><span id="goods-unit">'+prodJson.unit+'</span>';
							oneItemStr+='		</div>';
							oneItemStr+='	</div>';
							oneItemStr+='	<div id="unitPrice" style="display:none">'+prodJson.price+'</div>';
							oneItemStr+='</div>';
							oneItemStr+='<div class="mui-row" style="background:#fff">';
							oneItemStr+='	<div id="goods-subtotal">小计： ';
							oneItemStr+='	<span id="goods-subtotal-weight">'+getSubtotalWeight(prodJson.quantity,prodJson.specification)+'</span>';
							oneItemStr+='	<span id="goods-subtotal-money">'+getSubtotalMoney(prodJson.quantity,prodJson.price)+'</span>';
							oneItemStr+='	</div>';
							oneItemStr+='</div>';
							oneItemStr+='</div>';
							$("#products").append(oneItemStr);
						});

						$("#theTotalPriceTxt").text('￥'+parseFloat(json.totalFee/100.0).toFixed(2)+'元');
						$("#theTotalPriceFen").text(json.totalFee);
						
						if(json.payTime=="PAY_NEXT"){
							$("#payTime").text("先收货后付款，下次订单前支付！");
							//$("#confirmCancelDiv").show();
							$("#confirmCancel").click(function(){
								confirmCancelOrder(theOrderId);
							});							
						}else{
							$("#payTime").text("先付款后收货，两清不挂账！");
						}
						
						if(json.payStatus=="PAID"){
							if(json.orderStatus=="DRAWBACKED"){
								$("#payStatusTxt").text("已退款");
							}else{
								$("#payStatusTxt").text("已支付");
							}
						}else{
							$("#payStatusTxt").text("未支付");
						}
						
						if(json.deliverStatus=="DELIVERED"||json.deliverStatus=="CONFIRMED"){
							$("#confirmDeliver").hide();
							if(json.deliverStatus=="DELIVERED"){
								$("#deliverStatusTxt").text("已送货");
							}else{
								$("#deliverStatusTxt").text("已确认收货");
							}
						}else{
							$("#deliverStatusTxt").text("送货中");
							$("#confirmDeliver").show();
							$("#confirmDeliver").click(function(){
								delivered(theOrderId);
							});
						}
						
						if(json.orderStatus=="ON_GOING"){
							$("#orderStatusTxt").text("进行中");
							
						}else if(json.orderStatus=="APPLY_CANCEL"){//
							$("#orderStatusTxt").text("申请废单");
							//$("#confirmCancelDiv").show();
							$("#confirmCancel").click(function(){
								confirmCancelOrder(theOrderId);
							});
						}else if(json.orderStatus=="CANCELED"){//
							$("#orderStatusTxt").text("订单已废");

						}else if(json.orderStatus=="APPLY_DRAWBACK"){//
							$("#orderStatusTxt").text("申请退款");
							$("#confirmDrawbackDiv").show();
							$("#confirmDrawback").click(function(){
								confirmDrawbackOrder(theOrderId);
							});
						}else if(json.orderStatus=="DRAWBACKED"){//
							$("#orderStatusTxt").text("已退款");
						}
						
						
					}else{
						console.log("系统错误");
					}
		});		
	}
}


function delivered(theOrderId){
	$("#confirmDeliver").hide();
	var orderJson={"id":theOrderId,"userOpenId":store.get(system_config.wx_user_openid)};
	postJson(system_config.interface_biz_host_url+"/deliveredBizOrderWithoutToken.do",
			orderJson,
		function(json) {
			if (json.resultCode == 200) {
				$("#deliverStatusTxt").text("已送货");
			}else{
				$("#confirmDeliver").show();
				mui.alert(json.resultMessage, '操作结果', function() {});
			}
	});			
}

function confirmCancelOrder(theOrderId){
	$("#confirmCancel").hide();
	var orderJson={"id":theOrderId,"userOpenId":store.get(system_config.wx_user_openid)};
	postJson(system_config.interface_biz_host_url+"/confirmCancelBizOrderWithoutToken.do",
			orderJson,
		function(json) {
			if (json.resultCode == 200) {
				$("#confirmCancelDiv").hide();
				$("#orderStatusTxt").text("废单成功！");
			}else{
				$("#confirmCancel").show();
				$("#orderStatusTxt").text("废单失败！");
				mui.alert(json.resultMessage, '操作结果', function() {});
			}
	});		
}

function confirmDrawbackOrder(theOrderId){
	$("#confirmDrawback").hide();
	var orderJson={"id":theOrderId,"userOpenId":store.get(system_config.wx_user_openid)};
	postJson(system_config.interface_biz_host_url+"/confirmDrawbackBizOrderWithoutToken.do",
			orderJson,
		function(json) {
			if (json.resultCode == 200) {
				$("#confirmDrawbackDiv").hide();
				$("#orderStatusTxt").text("已退款");
			}else{
				$("#confirmDrawback").show();
				mui.alert(json.resultMessage, '操作结果', function() {});
			}
	});		
}

function loadCustomerServiceNumber(){
	postJson(system_config.interface_console_host_url+"/selectBusinessDictionaryTypeItem.do",
			{"type":"CUSTOMER_SERVICE","itemName":"CONTACT_NUMBER"},
		function(json) {
				if (json.resultCode == 200) {
					$("#systemContact").attr("href","tel:"+json.itemValue);
					$("#systemContact").html(json.itemValue);
					$("#systemContact").attr("color","blue");
				}else{
					console.log("系统错误");
				}
	});	
}

function getSubtotalWeight(theNum,theSpec){
	if(!isCanNotAccess(theSpec)){
		var theSpecNum=parseInt(theSpec);
		var theSpecTxt=theSpec.replace(theSpecNum,'');
		
		return '共'+theNum*theSpecNum+''+theSpecTxt;		
	}else{
		return '';
	}
}

function getSubtotalMoney(theNum,thePrice){
	return '￥'+parseFloat(theNum*thePrice/100).toFixed(2)+'元';
}


