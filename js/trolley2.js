var  allowOfflinePay=true;
var calculateCartAmount = 0; //计算购物车金额
/////////////////////////////购物车除了支付金额外方法/////////////////////////////
//购物车列表
function loadMyTrollyList() {
	var userOpenId="";
	if(isCanNotAccess(store.get(system_config.wx_user_openid))){
	}else{
		userOpenId=store.get(system_config.wx_user_openid);
	}
	var userCardNumber="";
	if(isCanNotAccess(store.get(system_config.weixiao_cardnumber))){
		// userCardNumber = "13662685556"
	}else{
		userCardNumber=store.get(system_config.weixiao_cardnumber);
	}
	var paraDataJson={
		"userOpenId":userOpenId,
		"userUuid":userCardNumber,
		"storeId":store.get(system_config.user_selected_store),
		"pageSize":100,
		"pageNo":1
	};	
	postJson(system_config.interface_biz_host_url + "/listBizUserTrolleyAndProductWithoutToken.do", paraDataJson,
	function (json) {
		if (json.resultCode == 200) {
			$("#carListDiv").empty();
			
			var totalFoodBowls=0;
			var totalPrice=0;
			var foodIds="";
			$.each(json.list, function (index, oneData) {
				var oneHtml='';
				oneHtml+='<div class="car-carList-list" title="'+oneData.id+'">';
				oneHtml+='	<div class="car-list-icon">';
				oneHtml+='		<img src="'+oneData.bizProductVo.imageUrl+'" alt="">';
				oneHtml+='	</div>';
				oneHtml+='	<div class="car-list-info">';
				oneHtml+='		<div class="car-list-info-name" title="'+oneData.bizProductVo.id+'">'+oneData.bizProductVo.name+'</div>';
				oneHtml+='		<div class="car-list-info-price" title="'+oneData.bizProductVo.price+'">￥'+(oneData.bizProductVo.price/100).toFixed(2)+'</div>';
				oneHtml+='	</div>';
				oneHtml+='	<div class="car-list-num" title="'+oneData.id+'">';
				oneHtml+='		<img src="./img/jian.svg" alt="" onclick="reduceNum(this)">';
				oneHtml+='		<span>'+oneData.theNum+'</span>';
				oneHtml+='		<img src="./img/jia.svg" alt="" onclick="addNum(this)">';
				oneHtml+='	</div>';
				oneHtml+='</div>';
				$("#carListDiv").append(oneHtml);
				totalFoodBowls+=oneData.theNum;
				totalPrice+=oneData.theNum*oneData.bizProductVo.price;
				foodIds+=(""+oneData.bizProductVo.id+",");
			});
			
			$("#totalFoods").text(json.totalCount)
			$("#totalFoodBowls").text(totalFoodBowls);
			$("#totalCardNum").text(totalFoodBowls);
			$("#totalCardNum").attr("title",foodIds);
			calculateCartAmount = totalPrice;//全局变量，购物车金额
			$("#totalMoney").text((totalPrice/100).toFixed(2));
		} else {
				console.log("系统错误");
		}
	});
}
//数量减少
function reduceNum(obj){
	var curNum=parseInt($(obj).next("span").text());
	var curId=$(obj).parent().attr("title");
	var price=$(obj).parent().parent().find(".car-list-info-price").attr("title");
	var prodId=$(obj).parent().parent().find(".car-list-info-name").attr("title");
	//console.log(curId+"    "+price)
	if(curNum>1){
		$(obj).next("span").text(curNum-1);
		updateBizUserTrolleyTheNumById(curId,curNum-1)
	}else{
		$(obj).parent().parent().remove();
		removeBizUserTrolley(curId);
		var cardTitles=$("#totalCardNum").attr("title");
		cardTitles=cardTitles.replace(prodId+",","");
		$("#totalCardNum").attr("title",cardTitles);
	}
	reCountNumAndMoney(-1,price,curId);
}
//数量增加
function addNum(obj){
	var curNum=parseInt($(obj).prev("span").text());
	var curId=$(obj).parents().attr("title");
	var price=$(obj).parent().parent().find(".car-list-info-price").attr("title");

	$(obj).prev("span").text(curNum+1);	
	updateBizUserTrolleyTheNumById(curId,curNum+1);
	reCountNumAndMoney(1,price,curId);
}
//增加减少金额计算
function reCountNumAndMoney(theNum,priceFen,curId){
	var totalNum=$(".car-carList-list").length;
	$("#totalFoods").text(totalNum);
	var totalFoodBowls=parseInt($("#totalFoodBowls").text());
	$("#totalFoodBowls").text(totalFoodBowls+theNum);
	$("#totalCardNum").text(totalFoodBowls+theNum);
	var totalMoney=parseFloat($("#totalMoney").text());
	calculateCartAmount = calculateCartAmount+priceFen*theNum;//全局变量，购物车金额
	totalMoney=parseFloat(totalMoney+priceFen*theNum/100).toFixed(2);
	
	$("#totalMoney").text(totalMoney);
}
//加入购物车
function saveBizUserTrolley(productId){
	if(isCanNotAccess(store.get(system_config.wx_user_openid))){
		initWeixin(window.location.href);
		return;
	}
	var userOpenId="";
	if(isCanNotAccess(store.get(system_config.wx_user_openid))){
		// userOpenId="o9wJW1mUraq2binEwt3iwsWWuQUk"
	}else{
		userOpenId=store.get(system_config.wx_user_openid);
	}
	var userCardNumber="";
	if(isCanNotAccess(store.get(system_config.weixiao_cardnumber))){
	}else{
		userCardNumber=store.get(system_config.weixiao_cardnumber);
	}
	var paraDataJson={
		"userOpenId":userOpenId,
		"userUuid":userCardNumber,
		"storeId":store.get(system_config.user_selected_store),
		"productId":productId,
		"theNum":1
	};
	var totalCardNum=parseInt($("#totalCardNum").text());
	var totalCardNumTitle=$("#totalCardNum").attr("title");
	//if(totalCardNumTitle.indexOf(productId)>=0){
		//mui.toast('您的购物车里已经有了该菜品！');
		//return;
	//}
	
	//if(totalCardNum<4){
		postJson(system_config.interface_biz_host_url+"/saveBizUserTrolleyWithoutToken.do",paraDataJson,function(json) {
			if (json.resultCode == 200) {		
				mui.toast('加入购物车成功！');
				$("#totalCardNum").text(parseInt($("#totalCardNum").text())+1);
				$("#totalCardNum").attr("title",$("#totalCardNum").attr("title")+""+productId+",")
				loadMyTrollyList();
			}else{
				mui.toast(json.resultMessage);
			}
		});			
	//}else{
		//mui.toast('土豪，我们交朋友吧！<br>我们一盘只能装4个菜!<br>您先结算这一盘后，我们再继续！');
	//}

}
//数量增加减少计算接口
function updateBizUserTrolleyTheNumById(id,theNum){
	var paraDataJson={"id":id,"theNum":theNum};
	postJson(system_config.interface_biz_host_url+"/updateBizUserTrolleyTheNumByIdWithoutToken.do",paraDataJson,function(json) {
		if (json.resultCode == 200) {		

		}
	});			
}
//删除商品
function removeBizUserTrolley(id){
	var paraDataJson={"id":id};
	postJson(system_config.interface_biz_host_url+"/forceRemoveBizUserTrolleyWithoutToken.do",paraDataJson,function(json) {
		if (json.resultCode == 200) {}
	});			
}

/////////////////////////////购物车支付/////////////////////////////
//自选立即下单
function doBuy() {
	if(isCanNotAccess(store.get(system_config.wx_user_openid))){
		mui.toast('您还关注公众号或关注过久，正在重新登录，请再次点击下单！');
    	initWeixin(window.location.href);
    	return;
    }
	var totalNum=$(".car-carList-list").length;
	if(totalNum<1){
		mui.toast('您还没有选菜，请先选菜！');
		return;
	}
	if($("#carListDiv .car-carList-list").length==1 && $("#carListDiv .car-list-info-name")[0].innerText=="米饭"){
		mui.toast('您好，暂时不支持单点米饭，如有需要请联系现场工作人员处理');
		return;
	}
	postJson(system_config.interface_biz_host_url+"/isBizStoreOnlineWithoutToken.do",{"id":store.get(system_config.user_selected_store)},function(onlineJson) {
		if(onlineJson.resultCode==200){			
			store.set(system_config.latest_order_type,"0");//购物车
			if(allowOfflinePay){
				// showPaySelect();//弹窗形式的支付

				//直接点击立即下单唤起支付
				if(store.get(system_config.user_selected_store)==2){
					payTrolleyByMode("weixiao");
				}
				if(store.get(system_config.user_selected_store)==3){
					getBalance();
				}
			}
		}else{
			mui.alert(onlineJson.resultMessage, '下单失败', function() {});
		}
	});  	
}
function showPaySelect(){
	if (store.get(system_config.user_selected_store) == "2") {
		$("#paySelect").show();
		$("#weixinDiv").hide();
		$("#weixiaoDiv").show();
		// $("#xianxiaDiv").show();
	}else if(store.get(system_config.user_selected_store) == "3"){
		$("#paySelect").show();
		$("#weixinDiv").show();
		$("#weixiaoDiv").hide();
		// $("#xianxiaDiv").show();
	}
	if(!isCanNotAccess(store.get(system_config.latest_order_paymode))){
		$('input[value="'+store.get(system_config.latest_order_paymode)+'"]').attr("checked",true);
	}
}
//购物车选择支付
function confirmPayMode() {
	var payMode = $('input[name="payBox"]:checked').val();
	if(isCanNotAccess(payMode)){
		mui.alert("请选择支付方式！", '下单失败', function() {});
		return;
	}else{
		$(".payMask").hide();
		store.set(system_config.latest_order_paymode,payMode);
	}
	if(store.get(system_config.user_selected_store)=="2"){
		payTrolleyByMode(payMode);//清华店直接微校支付
	}else if(store.get(system_config.user_selected_store)=="3"){
		getBalance();//智能工坊可以微信、余额支付
	}
}
//获取余额计算余额
function getBalance() {
	postJson(system_config.interface_biz_host_url+"/isBizStoreOnlineWithoutToken.do",{"id":store.get(system_config.user_selected_store)},function(onlineJson) {
		if(onlineJson.resultCode==200){			
			store.set(system_config.latest_order_type,"1");
			if(allowOfflinePay){
				postJson(system_config.interface_biz_host_url+"/getMyBalanceWithoutToken.do",
						{"userOpenId":store.get(system_config.wx_user_openid)},
					function(json) {
						if (json.resultCode == 200) {//完全获取到用户信息
							if(json.balance>0){
								var buycontent = "您当前余额"+getSubtotalMoney(json.balance)+ "\n" +
								"本次购买需支付"+getSubtotalMoney(calculateCartAmount)+ "\n";
								if(json.balance>=calculateCartAmount){
									buycontent+='您将全部使用余额支付\n';
									buycontent+='支付后，您的余额还剩'+getSubtotalMoney(json.balance-calculateCartAmount);
								}else{
									buycontent+='您的余额被全部抵扣后\n';
									buycontent+='您还需要使用微信支付'+getSubtotalMoney(calculateCartAmount-json.balance);
								}
								var btnArray = ['取消', '确认'];
								mui.confirm(buycontent, '支付确认！', btnArray, function(e) {
									if(e.index == 1) {
										if(json.balance>=calculateCartAmount){
											payTrolleyByMode("yue");
										}else{
											payTrolleyByMode("mixwxyue");
										}					
									}
								})
							}else{
								payTrolleyByMode("weixin");
							}
						}
				});
			}
		}else{
			mui.alert(onlineJson.resultMessage, '下单失败', function() {});
		}
	});  
}
//购物车支付
function payTrolleyByMode(payMode){
	localStorage.setItem("weixiaoRturnFunctionPara","weixiao");//用于微校授权后回调方法的参数
	var prodJsonArray=new Array();
	$.each($(".car-carList-list"),function(index,oneObj){
		var foodId=$(oneObj).find(".car-list-info-name").attr("title");
		var foodCount=$(oneObj).find(".car-list-num span").text();
		var oneItemJson={"foodId":foodId,"count":foodCount};
		prodJsonArray.push(oneItemJson);
	});
	
	var userOpenId="";
	if(isCanNotAccess(store.get(system_config.wx_user_openid))){
		// userOpenId="o9wJW1mUraq2binEwt3iwsWWuQUk"
	}else{
		userOpenId=store.get(system_config.wx_user_openid);
	}
	var userCardNumber="";
	if(isCanNotAccess(store.get(system_config.weixiao_cardnumber))){
		// userCardNumber = "13662685556"
	}else{
		userCardNumber=store.get(system_config.weixiao_cardnumber);
	}
	var paraDataJson={
			"userOpenId":userOpenId,
			"weixiaoCardNumber":userCardNumber,
			"storeId":store.get(system_config.user_selected_store),
			"productDetailJson":JSON.stringify(prodJsonArray)
		};
	$("#paySubmit").attr("disabled","true");
	if(payMode=="weixin"||payMode=="mixwxyue"){
		postJson(system_config.interface_biz_host_url+"/payNowBizOrderWithoutToken.do",paraDataJson,function(json) {
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
					$("#paySubmit").removeAttr("disabled");
					if (res.err_msg == "get_brand_wcpay_request:ok") {
						window.location="orderDetail.html?orderSerNum="+json.serNum;
					} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
						deleteMyOrder(json.id);
						mui.alert("您已经取消支付!", '支付操作', function() {});
					} else {
						mui.alert(JSON.stringify(res), '支付操作', function() {});
					}
				});
			}else{
				mui.alert(json.resultMessage, '支付操作', function() {});
				$("#paySubmit").removeAttr("disabled");
			}
		});			
	}else if(payMode=="yue"){
		// mui.alert("暂未支持余额支付", '下单失败', function() {});
		postJson(system_config.interface_biz_host_url+"/payYueBizOrderWithoutToken.do",paraDataJson,function(jsonPay) {
			if (jsonPay.resultCode == 200) {
				$("#paySubmit").removeAttr("disabled");
				window.location="orderDetail.html?orderSerNum="+jsonPay.serNum+"&v="+new Date().getTime();
			}else{
				$("#paySubmit").removeAttr("disabled");
				mui.alert(jsonPay.resultMessage, '下单失败', function() {});
			}
			});
	}else if(payMode=="weixiao"){
		 if(paraDataJson.weixiaoCardNumber!=""){
		    	postJson(system_config.interface_biz_host_url+"/payWeixiaoBizOrderWithoutToken.do",paraDataJson,function(json) {
					if (json.resultCode == 200) {
						paraDataJson.orderSerNum=json.serNum;
						OpenMidas.pay(json.payInfo, function(resultCode, innerCode, resultMsg, appMetadata){
							$("#paySubmit").removeAttr("disabled");
							if(resultCode==0){
								postJson(system_config.interface_biz_host_url+"/noticeOrderDoneWithoutToken.do",{"orderSerNum":json.serNum},function(doneJson){
									loadMyTrollyList();
					        window.location="orderDetail.html?orderSerNum="+json.serNum+"&v="+new Date().getTime();
								});
							}else{
								postJson(system_config.interface_biz_host_url+"/cancelBizOrderWithoutToken.do",paraDataJson,function(cancelJson){

								});
								mui.alert(resultMsg);
							}
						});
					}else{
						$("#paySubmit").removeAttr("disabled");
						mui.alert(json.resultMessage, '下单失败', function() {});
					}
		    	});    			
		 }else{
			localStorage.setItem("weixiaoRedirectUri",window.location.href.split("?")[0])
			initWeixiao(window.location.href.split("?")[0]);
		 }
	}else if(payMode=="xianxia"){
    	postJson(system_config.interface_biz_host_url+"/payNextBizOrderWithoutToken.do",paraDataJson,function(json) {
			if (json.resultCode == 200) {
				paraDataJson.orderSerNum=json.serNum;
				$("#paySubmit").removeAttr("disabled");
				window.location="orderDetail.html?orderSerNum="+json.serNum+"&v="+new Date().getTime();
			}else{
				$("#paySubmit").removeAttr("disabled");
				mui.alert(json.resultMessage, '下单失败', function() {});
			}
    	});		
	}	
}
function doSelectThisPayMode(theMode){
	$(":radio[name='payBox'][value='" + theMode + "']").prop("checked", "checked");
}


/////////////////////////////套餐支付/////////////////////////////
//套餐下单，获取余额
function doBuyPackage(packageId) {
	localStorage.setItem("weixiaoRturnFunctionPara",packageId);//用于微校授权后回调方法的参数
	if(isCanNotAccess(store.get(system_config.wx_user_openid))){
		mui.toast('您还关注公众号或关注过久，正在重新登录，请再次点击下单！');
    	initWeixin(window.location.href);
    	return;
	}
	postJson(system_config.interface_biz_host_url+"/isBizStoreOnlineWithoutToken.do",{"id":store.get(system_config.user_selected_store)},function(onlineJson) {
		if(onlineJson.resultCode==200){			
			store.set(system_config.latest_order_type,"1");
			store.set(system_config.latest_order_packageid,packageId);
			if(allowOfflinePay){
				if(store.get(system_config.user_selected_store)=="2"){
					payPackageByMode("weixiao");//清华店直接微校支付
				}else if(store.get(system_config.user_selected_store)=="3"){
					//智能工坊可以微信、余额支付
					postJson(system_config.interface_biz_host_url+"/getMyBalanceWithoutToken.do",
						{"userOpenId":store.get(system_config.wx_user_openid)},
					function(json) {
						if (json.resultCode == 200) {//完全获取到用户信息
							if(json.balance>0){
								showYueInfo(json.balance);
							}else{
								payPackageByMode("weixin");
							}
						}
					});
				}
			}
		}else{
			mui.alert(onlineJson.resultMessage, '下单失败', function() {});
		}
	});  
}
//使用余额
function showYueInfo(balance){
	var queryPkgPara = { id : store.get(system_config.latest_order_packageid) }
	postJson(system_config.interface_biz_host_url+"/getBizFoodSetWithoutToken.do",queryPkgPara,function(json) {
		if (json.resultCode == 200) {
			var buycontent = "您当前余额"+getSubtotalMoney(balance)+
			"\n" +
			"本次购买" +json.name+"需支付"+getSubtotalMoney(json.price)+
			"\n";
			if(balance>=json.price){
				buycontent+='您将全部使用余额支付\n';
				buycontent+='支付后，您的余额还剩'+getSubtotalMoney(balance-json.price);
			}else{
				buycontent+='您的余额被全部抵扣后\n';
				buycontent+='您还需要使用微信支付'+getSubtotalMoney(json.price-balance);
			}
			
			var btnArray = ['取消', '确认'];
			mui.confirm(buycontent, '支付确认！', btnArray, function(e) {
				if(e.index == 1) {
					if(balance>=json.price){
						payPackageByMode("yue");
					}else{
						payPackageByMode("mixwxyue");
					}					
				}
			})

		}else{
			console.log("系统错误");
		}
	});
}
//套餐支付
function payPackageByMode(payMode){
	var queryPkgPara = { id : store.get(system_config.latest_order_packageid) }
	postJson(system_config.interface_biz_host_url+"/getBizFoodSetWithoutToken.do",queryPkgPara,function(json) {
		if (json.resultCode == 200) {
			var prodJsonArray=new Array();
			$.each(json.list,function(index){
				var foodId=json.list[index].id;
				var foodCount= 1;
				var oneItemJson={"foodId":foodId,"count":foodCount};
				prodJsonArray.push(oneItemJson);
			});
			
			var userOpenId="";
			if(isCanNotAccess(store.get(system_config.wx_user_openid))){
				// userOpenId="o9wJW1mUraq2binEwt3iwsWWuQUk"
			}else{
				userOpenId=store.get(system_config.wx_user_openid);
			}
			var userCardNumber="";
			if(isCanNotAccess(store.get(system_config.weixiao_cardnumber))){
				// userCardNumber = "13662685556"
			}else{
				userCardNumber=store.get(system_config.weixiao_cardnumber);
			}
			var orderPkgPara={
					"userOpenId":userOpenId,
					"weixiaoCardNumber":userCardNumber,
					"storeId":store.get(system_config.user_selected_store),
					"productDetailJson":JSON.stringify(prodJsonArray),
					"foodSetId": store.get(system_config.latest_order_packageid)
      };				
      console.log("套餐订单参数",orderPkgPara)
			if(payMode=="weixin"||payMode=="mixwxyue"){
				postJson(system_config.interface_biz_host_url+"/payNowBizOrderWithoutToken.do",orderPkgPara,function(json) {
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
    							window.location="orderDetail.html?orderSerNum="+json.serNum+"&v="+new Date().getTime();
							} else if (res.err_msg == "get_brand_wcpay_request:cancel") {
								cancelOrderAndRestoreStock(json.serNum);
								mui.alert("您已经取消支付!", '支付操作', function() {});
							} else {
								mui.alert(JSON.stringify(res), '支付操作', function() {});
							}
						});
					}else{
						mui.alert(json.resultMessage, '支付操作', function() {});
					}
				});	
			}else if(payMode=="yue"){
		    	postJson(system_config.interface_biz_host_url+"/payYueBizOrderWithoutToken.do",orderPkgPara,function(jsonPay) {
					if (jsonPay.resultCode == 200) {
						$("#paySubmit").removeAttr("disabled");
						window.location="orderDetail.html?orderSerNum="+jsonPay.serNum+"&v="+new Date().getTime();
					}else{
						$("#paySubmit").removeAttr("disabled");
						mui.alert(jsonPay.resultMessage, '下单失败', function() {});
					}
		    	});
			}else if(payMode=="weixiao"){
				if(orderPkgPara.weixiaoCardNumber!=""){
					postJson(system_config.interface_biz_host_url+"/payWeixiaoBizOrderWithoutToken.do",orderPkgPara,function(json) {
						if (json.resultCode == 200) {
							orderPkgPara.orderSerNum=json.serNum;
							OpenMidas.pay(json.payInfo, function(resultCode, innerCode, resultMsg, appMetadata){
								if(resultCode==0){
									postJson(system_config.interface_biz_host_url+"/noticeOrderDoneWithoutToken.do",{"orderSerNum":json.serNum},function(doneJson){
										//
										loadMyTrollyList();
										window.location="orderDetail.html?orderSerNum="+json.serNum+"&v="+new Date().getTime();
									});
	
								}else{
									postJson(system_config.interface_biz_host_url+"/cancelBizOrderWithoutToken.do",orderPkgPara,function(cancelJson){
										//
									});
									mui.alert(resultMsg);
								}
							});
						}else{
							mui.alert(json.resultMessage, '下单失败', function() {});
						}
					});
				}else{
					localStorage.setItem("weixiaoRedirectUri",window.location.href.split("?")[0])
					initWeixiao(window.location.href.split("?")[0]);
				}
			}else if(payMode=="xianxia"){
                var btnArray = ['再看看', '确认'];
                mui.confirm('确认购买'+json.setType+json.name+'？', '下单确认', btnArray, function(e) {
                    if (e.index == 1) {
    			    	postJson(system_config.interface_biz_host_url+"/payNextBizOrderWithoutToken.do",orderPkgPara,function(jsonPay) {
    						if (jsonPay.resultCode == 200) {
    							$("#paySubmit").removeAttr("disabled");
    							window.location="orderDetail.html?orderSerNum="+jsonPay.serNum+"&v="+new Date().getTime();
    						}else{
    							$("#paySubmit").removeAttr("disabled");
    							mui.alert(jsonPay.resultMessage, '下单失败', function() {});
    						}
    			    	});		                        
                    } else {

                    }
                })					
			}
		}else{
			mui.alert(json.resultMessage, '下单失败', function() {});
			console.log("系统错误");
		}
	});
}