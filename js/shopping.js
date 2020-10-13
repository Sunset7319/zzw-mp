$(document).ready(function(){
	initWeixin(window.location.href);
})

var winHeight = $(window).height();
$(window).resize(function () {
    var thisHeight = $(this).height();
    if (winHeight - thisHeight > 50) {
        $("#footer").hide()
    } else {
        $("#footer").show()
    }

})

function doBizMain(){//所有的业务方法写到这里
	mui.init();
	console.log("start load page biz data");
	loadTextCnInfo();//加载文字信息
	loadLatestDeliverInfo();//加载最近的收货地址信息
	loadProductInfo();//加载最近的产品信息
	
	eventDeliverInput();//事件:输入信息保持store的
	eventSumbitOrder();//事件:提交订单
}

function loadTextCnInfo(){
	postJson(system_config.interface_console_host_url+"/selectBusinessDictionaryTypeItem.do",
			{"type":"TEXT_CN","itemName":"PAY_NOW"},
		function(json) {
				if (json.resultCode == 200) {
					$("#TEXT_CN_PAY_NOW").html(json.itemValue);
				}else{
					console.log("系统错误");
				}
	});	
	postJson(system_config.interface_console_host_url+"/selectBusinessDictionaryTypeItem.do",
			{"type":"TEXT_CN","itemName":"PAY_NEXT"},
		function(json) {
				if (json.resultCode == 200) {
					$("#TEXT_CN_PAY_NEXT").html(json.itemValue);
				}else{
					console.log("系统错误");
				}
	});	
}

function loadLatestDeliverInfo(){
	var theName=store.get(system_config.wx_user_deliver_name);
	var thePhone=store.get(system_config.wx_user_deliver_phone);
	var theExt1=store.get(system_config.wx_user_deliver_store);
	var theAddress=store.get(system_config.wx_user_deliver_address);
	var theLatestOrderNumber=store.get(system_config.wx_user_latest_order_number);

	if(isBlank(theName)||isBlank(thePhone)||isBlank(theExt1)||isBlank(theAddress)){
		postJson(system_config.interface_biz_host_url+"/getLatestBizOrderWithoutToken.do",
				{"userOpenId":store.get(system_config.wx_user_openid)},
			function(json) {
				if (json.resultCode == 200) {
					$("#deliverName").val(json.deliverName);
					$("#deliverPhone").val(json.deliverPhone);
					$("#ext1").val(json.ext1);
					$("#deliverAddress").val(json.deliverAddress);
					
					$("#totle").val(1);//最近下单数量可以不读取，因为多货品时不好取，也默认另外一个商品的历史数量不符合业务逻辑
				}else{
					console.log("未加载到用户最后订单的收货地址信息");
				}
		});			
	}
	
	if(!isBlank(theName)){
		$("#deliverName").val(theName);
	}
	if(!isBlank(thePhone)){
		$("#deliverPhone").val(thePhone);
	}
	if(!isBlank(theExt1)){
		$("#ext1").val(theExt1);
	}
	if(!isBlank(theAddress)){
		$("#deliverAddress").val(theAddress);
	}
	if(!isBlank(theLatestOrderNumber)){
		$("#totle").val(theLatestOrderNumber);
	}else{
		$("#totle").val(1);
	}
}

function eventDeliverInput(){
	$("#deliverName").blur(function(){
		var theName=$("#deliverName").val();
		if(!isBlank(theName)){
			store.set(system_config.wx_user_deliver_name,theName);
		}
	});
	$("#deliverPhone").blur(function(){
		var thePhone=$("#deliverPhone").val();
		if(!isBlank(thePhone)){
			store.set(system_config.wx_user_deliver_phone,thePhone);
		}
	});
	$("#ext1").blur(function(){
		var theExt1=$("#ext1").val();
		if(!isBlank(theExt1)){
			store.set(system_config.wx_user_deliver_store,theExt1);
		}
	});
	$("#deliverAddress").blur(function(){
		var theAddress=$("#deliverAddress").val();
		if(!isBlank(theAddress)){
			store.set(system_config.wx_user_deliver_address,theAddress);
		}
	});

}

function loadProductInfo(){
	var theProductId = getParaValueFromUrl("id");
	if(!isCanNotAccess(theProductId)){//加载单品
		postJson(system_config.interface_biz_host_url+"/getBizProductWithoutToken.do",
				{"id":theProductId},
			function(json) {
				var Img=json.icon.split(',')
					if (json.resultCode == 200) {
						$("#goods-icon").attr("src",Img[0]);
						$("#goods-name").text(json.name);
						$("#goods-price").text('￥'+parseFloat(json.price/100).toFixed(2)+'元/'+json.unit+'('+json.specification+')');
						$("#goods-unit").text(json.unit);
						$("#goods-specification").text(json.specification);
						$("#unitPrice").text(json.price);	
						$("#theTotalPriceTxt").text('￥'+parseFloat(json.price*$("#totle").val()/100).toFixed(2)+'元');
						$("#theTotalPriceFen").text(json.price*$("#totle").val());
						eventNumberAddReduce(json.price);
					}else{
						console.log("系统错误");
					}
		});			
	}else{//从购物车里加载产品数据
		postJson(system_config.interface_biz_host_url+"/listBizUserTrolleyAndProductWithoutToken.do",
				{"userOpenId":store.get(system_config.wx_user_openid),"storeId":store.get(system_config.user_selected_store)},
			function(json) {
				if (json.resultCode == 200) {
					$("#products").empty();
					var totalSpent=0;
					if(json.list.length==0){
						window.location="index.html?20200828";
						return;
					}
					$.each(json.list,function(index,oneItem){
						var Img=oneItem.bizProductVo.icon.split(',');
						var oneProductStr='';
						oneProductStr+='<div class="productItemSmall" id="'+oneItem.id+'">';
						oneProductStr+='<div class="mui-row">';
						oneProductStr+='<div class="mui-checkbox mui-col-sm-6 mui-col-xs-2" style="position:relative;height:60px">';
						oneProductStr+='<input type="checkbox" name="theProductChk" value="'+oneItem.bizProductVo.id+'" checked style="margin: auto;  position: absolute;  top: 0; left: 0; bottom: 0; right: 0;"/>';
						oneProductStr+='</div>';			
						oneProductStr+='	<div class="mui-col-sm-6 mui-col-xs-6">';
						oneProductStr+='		<img src="'+Img[0]+'" id="goods-icon" />';
						oneProductStr+='		<div id="goods-name">'+oneItem.bizProductVo.name+'</div>';
						oneProductStr+='		<div id="goods-price">'+'￥'+parseFloat(oneItem.bizProductVo.price/100).toFixed(2)+'元/'+oneItem.bizProductVo.unit+'('+oneItem.bizProductVo.specification+')'+'</div>';
						oneProductStr+='		<div id="goods-unit" style="display:none">'+oneItem.bizProductVo.unit+'</div>';
						oneProductStr+='		<div id="goods-specification" style="display:none">'+oneItem.bizProductVo.specification+'</div>';
						oneProductStr+='	</div>';
						oneProductStr+='	<div class="mui-col-sm-6 mui-col-xs-4" style="position:relative;height:60px">';
						oneProductStr+='		<div class="mui-numbox" data-numbox-min="0" style="margin: auto;  position: absolute;  top: 0; left: 0; bottom: 0; right: 0;">';
						oneProductStr+='		<button class="mui-btn mui-numbox-btn-minus" type="button" id="reduce">-</button>';
						oneProductStr+='		<input id="totle" class="mui-input-numbox" type="number" value="'+oneItem.theNum+'" />';
						oneProductStr+='		<button class="mui-btn mui-numbox-btn-plus" type="button" id="add">+</button>';
						oneProductStr+='		</div>';
						oneProductStr+='	</div>';
						oneProductStr+='	<div id="unitPrice" style="display:none">'+oneItem.bizProductVo.price+'</div>';
						oneProductStr+='</div>';
						oneProductStr+='<div class="mui-row">';
						oneProductStr+='	<div id="goods-subtotal">小计： ';
						oneProductStr+='	<span id="goods-subtotal-unit">'+getSubtotalUnit(oneItem.theNum,oneItem.bizProductVo.unit)+'</span>';
						oneProductStr+='	<span id="goods-subtotal-weight">'+getSubtotalWeight(oneItem.theNum,oneItem.bizProductVo.specification)+'</span>';
						oneProductStr+='	<span id="goods-subtotal-money">'+getSubtotalMoney(oneItem.theNum,oneItem.bizProductVo.price)+'</span>';
						oneProductStr+='	</div>';
						oneProductStr+='</div>';
						oneProductStr+='</div>';						
												
						$("#products").append(oneProductStr);
						totalSpent+=(oneItem.bizProductVo.price*oneItem.theNum);
						
					});
					
					$("#theTotalPriceTxt").text('￥'+parseFloat(totalSpent/100).toFixed(2)+'元');
					$("#theTotalPriceFen").text(totalSpent);
					eventCheckboxForAllItems();
					eventNumberAddReduceForAllItems();					
				}
		});		
	}
}

function eventCheckboxForAllItems(){
	$(":checkbox[name='theProductChk']").click(function(){
		//console.log(this.value);
		if($(this).is(':checked')){
			$(this).parent().parent().parent().find("#goods-subtotal").show();
		}else{
			$(this).parent().parent().parent().find("#goods-subtotal").hide();
		}
		countAllItemSumPrice();
	});
}

function eventNumberAddReduceForAllItems(){
	mui('.mui-numbox').numbox();//手动再次初始化数字输入框
	$(".mui-input-numbox").change(function(){
		var theNum=this.value;
		var theTrolleyId=$(this).parent().parent().parent().parent().attr("id");
		var theItem=$(this).parent().parent().parent().parent();
		var theNumboxPlus=this.nextElementSibling;
		if(theNum>0){
			updateUserTrolly(theTrolleyId,theNum);
			
			var thePrice=$(this).parent().parent().parent().parent().find("#unitPrice").text();
			var theUnit=$(this).parent().parent().parent().parent().find("#goods-unit").text();
			var theSpec=$(this).parent().parent().parent().parent().find("#goods-specification").text();
			$(this).parent().parent().parent().parent().find("#goods-subtotal-unit").text(getSubtotalUnit(theNum,theUnit));
			$(this).parent().parent().parent().parent().find("#goods-subtotal-weight").text(getSubtotalWeight(theNum,theSpec));
			$(this).parent().parent().parent().parent().find("#goods-subtotal-money").text(getSubtotalMoney(theNum,thePrice));

			countAllItemSumPrice();
		}else{
			var btnArray = ['否', '是'];
            mui.confirm('确认从购物车里删除这个产品吗？', '删除确认', btnArray, function(e) {
                 if (e.index == 1) {
     				console.log("force remove theItem "+theTrolleyId);
    				forceRemoveTrollyById(theTrolleyId);
    				theItem.remove();
    				countAllItemSumPrice();
                 }else{
                	 mui.trigger(theNumboxPlus, 'tap');
                 }
            });
		}
	});
}

function countAllItemSumPrice(){
	var totalSpent=0;
	if($(":checkbox[name='theProductChk']").length==0){
		window.location="index.html?20200828";//购物车清空时回主页
	}
	$(":checkbox[name='theProductChk']").each(function(index,oneChk){
		if($(oneChk).is(':checked')){
			var curItemTheNum=$(oneChk).parent().parent().find("#totle").val();
			var curItemPrice=$(oneChk).parent().parent().find("#unitPrice").text();
			totalSpent+=(curItemTheNum*curItemPrice);
		}
	});
	$("#theTotalPriceTxt").text('￥'+parseFloat(totalSpent/100).toFixed(2)+'元');
	$("#theTotalPriceFen").text(totalSpent);
}

function eventNumberAddReduce(thePrice){
	$("#totle").change(function(){
		$("#theTotalPriceTxt").text('￥'+parseFloat(thePrice*$("#totle").val()/100).toFixed(2)+'元');
		$("#theTotalPriceFen").text(thePrice*$("#totle").val());
		store.set(system_config.wx_user_latest_order_number,$("#totle").val());		
	});
}

function eventSumbitOrder(){
	$("#pay").click(function(){
		$("#pay").hide();//先隐藏按钮，不可连续点击
		
		var theName=$("#deliverName").val();
		if(isBlank(theName)){
			mui.alert("请输入收货人!", '信息缺失', function() {});			
			$("#pay").show();//恢复按钮显示
			return;
		}
		var thePhone=$("#deliverPhone").val();
		if(isBlank(thePhone)||!/^1[34578]\d{9}$/.test(thePhone)){
			mui.alert("请输入正确的联系电话!", '信息缺失', function() {});			
			$("#pay").show();//恢复按钮显示
			return;
		}		
		var theExt1=$("#ext1").val();
		if(isBlank(theExt1)){
			mui.alert("请输入收货店名!", '信息缺失', function() {});			
			$("#pay").show();//恢复按钮显示
			return;
		}		
		var theAddress=$("#deliverAddress").val();
		if(isBlank(theAddress)){
			mui.alert("请输入收货地址!", '信息缺失', function() {});			
			$("#pay").show();//恢复按钮显示
			return;
		}
		var thePayTime=$("input[name='payTime']:checked").val();
		
		var theProductId = getParaValueFromUrl("id");
		var orderJson={};
	
		var payNextBizOrderApiUrl=system_config.interface_biz_host_url+"/payNextBizOrderWithoutToken.do";
		var payNowBizOrderApiUrl=system_config.interface_biz_host_url+"/payNowBizOrderWithoutToken.do";
		var productDetailJsonObj=[];
		
		var confirmStr="";
		
		if(isCanNotAccess(theProductId)){
			payNextBizOrderApiUrl=system_config.interface_biz_host_url+"/payNextBizOrderAndClearTrollyWithoutToken.do";
			payNowBizOrderApiUrl=system_config.interface_biz_host_url+"/payNowBizOrderAndClearTrollyWithoutToken.do";
			
			//组织选择的产品json
			var selectedItems=0;
			$(":checkbox[name='theProductChk']").each(function(index,oneChk){
				if($(oneChk).is(':checked')){
					selectedItems++;
					var oneProductJson={};
					oneProductJson.id=$(oneChk).attr("value");
					oneProductJson.icon=$(oneChk).parent().parent().find("#goods-icon").attr("src");
					oneProductJson.name=$(oneChk).parent().parent().find("#goods-name").text();
					oneProductJson.price=$(oneChk).parent().parent().find("#unitPrice").text();
					oneProductJson.quantity=$(oneChk).parent().parent().find("#totle").val();
					oneProductJson.unit=$(oneChk).parent().parent().find("#goods-unit").text();
					oneProductJson.specification=$(oneChk).parent().parent().find("#goods-specification").text();
					oneProductJson.trolleyId=$(oneChk).parent().parent().parent().attr("id");
					productDetailJsonObj.push(oneProductJson);
				}
			});
			if(selectedItems==0){
				mui.alert("请选择您要结算的商品!", '信息缺失', function() {});			
				$("#pay").show();//恢复按钮显示				
				return
			}
			console.log(productDetailJsonObj);
		}else{
			productDetailJsonObj=[
				{
					"id":theProductId,
					"icon":$("#goods-icon").attr("src"),
					"name":$("#goods-name").text(),
					"price":$("#unitPrice").text(),
					"quantity":$("#totle").val(),
					"unit":$("#goods-unit").text(),
					"specification":$("#goods-specification").text()
				}
			];

		}
		for(var i=0;i<productDetailJsonObj.length;i++){
			confirmStr+=(productDetailJsonObj[i].name+productDetailJsonObj[i].quantity+productDetailJsonObj[i].unit+";");
		}
		confirmStr+="\n总价"+$("#theTotalPriceTxt").text()+"\n";
		confirmStr+="是否确认提交？";
		
		//下单的产品信息一定要以这样的JSON格式
		orderJson.productDetailJson=JSON.stringify(productDetailJsonObj);
		orderJson.storeId=store.get(system_config.user_selected_store);//
		orderJson.userOpenId=store.get(system_config.wx_user_openid);
		orderJson.payTime=thePayTime;
		orderJson.totalFee=$("#theTotalPriceFen").text();
		orderJson.deliverName=theName;
		orderJson.deliverPhone=thePhone;
		orderJson.ext1=theExt1;
		orderJson.deliverAddress=theAddress;
		orderJson.deliverFee=0;//辣椒这里免费送货，费用为0	
		
		
		if(thePayTime=="PAY_NEXT"){
			var btnArray = ['取消', '确认'];
            mui.confirm(confirmStr, '购买确认', btnArray, function(e) {
                 if (e.index == 1) {
     				postJson(payNextBizOrderApiUrl,
    						orderJson,
    					function(json) {
    						$("#pay").show();//恢复按钮显示
    						if (json.resultCode == 200) {
    							mui.alert('订单提交成功！我们会尽快发货!', '提交成功', function() {
        							window.location="orderDetail.html?orderId="+json.id+"&v="+new Date().getTime();
    							});
    						}else if(json.resultCode ==406){
    							mui.alert(json.resultMessage, '提交结果', function() {
        							window.location="orderDetail.html?orderId="+json.id+"&v="+new Date().getTime();
    							});    							
    						}else{
    							mui.alert(json.resultMessage, '提交失败', function() {
    							});
    						}
    				});	
                 }else{//取消购买恢复按钮
     				$("#pay").show();//恢复按钮显示				
                 }
            });
			
		}else{
			var btnArray = ['取消', '确认'];
            mui.confirm(confirmStr, '购买确认', btnArray, function(e) {
                 if (e.index == 1) {
                	 postJson(payNowBizOrderApiUrl,orderJson,function(json) {
						 var orderTime=new Date(json.lastUpdateTime)
						 var orderHours=orderTime.getHours();
						if (orderHours>=10&&orderHours<=24) {
						$("#pay").show();//恢复按钮显示
						if (json.resultCode == 200) {
							
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

								} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
									deleteMyOrder(json.id);
	    							mui.alert("您已经取消支付!", '支付操作', function() {});
								} else {
	    							mui.alert(JSON.stringify(res), '支付操作', function() {});
								}
							});
						}else{
							mui.alert(json.resultMessage, '支付操作', function() {});
						}							
					}else{
						mui.alert('下单时间10：00至24：00', '支付操作', function() {});
					}
                	 });
                 }else{//取消购买恢复按钮
      				$("#pay").show();//恢复按钮显示				
                 }
            });			
		}
	});
}

function deleteMyOrder(id){
	postJson(system_config.interface_biz_host_url+"/deleteBizOrderWithoutToken.do",
			{"id":id},
		function(json) {
				console.log(json);
	});

}

function updateUserTrolly(id,num){
	postJson(system_config.interface_biz_host_url+"/updateBizUserTrolleyTheNumByIdWithoutToken.do",
			{"id":id,"theNum":num},
		function(json) {
				console.log(json);
	});	
}
function forceRemoveTrollyById(id){
	postJson(system_config.interface_biz_host_url+"/forceRemoveBizUserTrolleyWithoutToken.do",
			{"id":id},
		function(json) {
			console.log(json);
			loadMyTrolley();
	});	
}

function getSubtotalUnit(theNum, theUnit){
	return theNum+''+theUnit;
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
