$(document).ready(function(){
	initWeixin(window.location.href);
})

var paraJson={};

function doBizMain(){//所有的业务方法写到这里
	mui.init();
	console.log("start load page biz data");
	loadStoreUserOpenId();
}

function eventHeaderTab(){
	$("#previousDay").click(function(){
		var theCurDate=getDateTimeFromYYYYMMDDStr($("#theCurDay").text());
		var theResultDate=addDayTimes(theCurDate,-1);
		$("#theCurDay").text(formatDateToStrOnlyDay(theResultDate));
		store.set(system_config.wx_store_latest_query_day,formatDateToStrOnlyDay(theResultDate));
		loadStoreOrders();
	});
	$("#nextDay").click(function(){
		var theCurDate=getDateTimeFromYYYYMMDDStr($("#theCurDay").text());
		var theResultDate=addDayTimes(theCurDate,1);
		$("#theCurDay").text(formatDateToStrOnlyDay(theResultDate));
		store.set(system_config.wx_store_latest_query_day,formatDateToStrOnlyDay(theResultDate));
		loadStoreOrders();
	});

	var theDayPicker=document.getElementById("theCurDay");
	theDayPicker.addEventListener('tap', function() {
		var _self = this;
		if(_self.picker) {
			_self.picker.show(function (rs) {
				result.innerText = '选择结果: ' + rs.text;
				_self.picker.dispose();
				_self.picker = null;
			});
		} else {
			var optionsJson = this.getAttribute('data-options') || '{}';
			var options = JSON.parse(optionsJson);
			var id = this.getAttribute('id');
			/*
			 * 首次显示时实例化组件
			 * 示例为了简洁，将 options 放在了按钮的 dom 上
			 * 也可以直接通过代码声明 optinos 用于实例化 DtPicker
			 */
			_self.picker = new mui.DtPicker(options);
			_self.picker.show(function(rs) {
				/*
				 * rs.value 拼合后的 value
				 * rs.text 拼合后的 text
				 * rs.y 年，可以通过 rs.y.vaue 和 rs.y.text 获取值和文本
				 * rs.m 月，用法同年
				 * rs.d 日，用法同年
				 * rs.h 时，用法同年
				 * rs.i 分（minutes 的第二个字母），用法同年
				 */
				_self.innerText=rs.text;
				store.set(system_config.wx_store_latest_query_day,rs.text);
				loadStoreOrders();
				/* 
				 * 返回 false 可以阻止选择框的关闭
				 * return false;
				 */
				/*
				 * 释放组件资源，释放后将将不能再操作组件
				 * 通常情况下，不需要示放组件，new DtPicker(options) 后，可以一直使用。
				 * 当前示例，因为内容较多，如不进行资原释放，在某些设备上会较慢。
				 * 所以每次用完便立即调用 dispose 进行释放，下次用时再创建新实例。
				 */
				_self.picker.dispose();
				_self.picker = null;
			});
		}
		
	}, false);	
	$('#deliverStatus').on('tap','a',function() {
		switch (this.id) {
			case 'deliverAllStatus':
				paraJson.deliverStatus="";
				loadStoreOrders();
				break;
			case 'deliveringStatus':
				paraJson.deliverStatus="ON_THE_WAY";
				loadStoreOrders();
				break;
			case 'deliveredStatus':
				paraJson.deliverStatus="DELIVERED";
				loadStoreOrders();
				break;
			default:
				break;
		}
	})
	$('#paidStatus').on('tap','a',function () {
		switch (this.id) {
			case 'payAllStatus':
				paraJson.payStatus="";
				loadStoreOrders();
				break;
			case 'havepaidStatus':
				paraJson.payStatus="PAID";
				loadStoreOrders();
				break;
			case 'notPayStatus':
				paraJson.payStatus="NOT_PAY";
				loadStoreOrders();
				break;
			default:
				break;
		}
	})	
}
function loadStoreUserOpenId(){
	var storeUserJson={"userOpenId":store.get(system_config.wx_user_openid),"storeId":store.get(system_config.user_selected_store)};
	postJson(system_config.interface_biz_host_url+"/listBizStoreAccountWithoutToken.do",storeUserJson,function(json) {
		if (json.resultCode == 200) {
			if(json.list.length>0){
				var theLatestDay=store.get(system_config.wx_store_latest_query_day);
				if(isCanNotAccess(theLatestDay)||theLatestDay.length<=8){
					theLatestDay=formatDateToStrOnlyDay(new Date());
					store.set(system_config.wx_store_latest_query_day,theLatestDay);
				}
				$("#theCurDay").text(theLatestDay);
				paraJson={"storeId":store.get(system_config.user_selected_store),"pageSize":10000};
				
				loadStoreOrders();
				eventHeaderTab();
			}
		}
	});
}

function loadStoreOrders(){
	var theCurDay=$("#theCurDay").text();
	paraJson.createTimeFrom=getDateTimeFromStr(theCurDay+" 00:00:00");
	paraJson.createTimeTo=getDateTimeFromStr(theCurDay+" 23:59:59");

	console.log(JSON.stringify(paraJson));
	loadStoreOrdersFromApi(paraJson);
}

function loadStoreOrdersFromApi(paraJson){
	postJson(system_config.interface_biz_host_url+"/listBizStoreOrderWithoutToken.do",
			paraJson,
		function(json) {
			if (json.resultCode == 200) {
				$("#storeOrderList").empty();

				$.each(json.list,function(index,oneData){
					var oneHtml='';
					oneHtml+='<li class="mui-table-view-cell" style="padding:1;"  onclick="openOrderDetail(\''+oneData.id+'\')">'
					oneHtml+='<div class="mui-row">'
					oneHtml+='<div class="mui-col-sm-6 mui-col-xs-10">'
					oneHtml+='<span id="orderSerNum" class="orderSerNum" title="'+oneData.serNum+'">订单号：'+oneData.serNum+' <br>';
					oneHtml+='下单时间：'+formatDateToHourMinute(oneData.createTime)+' <br>';
					oneHtml+='收货人：'+oneData.deliverName+'<a href=\"tel:'+oneData.deliverPhone+'\">'+oneData.deliverPhone+'</a> <br>';
					oneHtml+='收货店名：'+oneData.ext1+' <br>';
					oneHtml+='收货地址：'+oneData.deliverAddress+' <br>';
					oneHtml+='</span>';
					oneHtml+='</div>'
					oneHtml+='<div class="mui-col-sm-6 mui-col-xs-2">'	
					oneHtml+='<span id="state" class="state">';
					if(oneData.deliverStatus=="DELIVERED"){
						oneHtml+='已送达<br>';
					}else if(oneData.deliverStatus=="CONFIRMED"){
						oneHtml+='已收到货<br>';
					}else{
						oneHtml+='<font color="red">未送达<font><br>';
					}

					
					if(oneData.orderStatus=="APPLY_CANCEL"){
						oneHtml+='申请作废，等待确认';
					}else if(oneData.orderStatus=="CANCELED"){
						oneHtml+='已作废';
					}else if(oneData.orderStatus=="APPLY_DRAWBACK"){
						oneHtml+='申请退款，等待确认';
					}else if(oneData.orderStatus=="DRAWBACKED"){
						oneHtml+='退款';
						if(oneData.drawbackStatus=="SUCCESS"){
							oneHtml+='成功';
						}else{
							oneHtml+='失败';
						}
					}else{
						if(oneData.deliverStatus=="CONFIRMED"&&oneData.payStatus=="PAID"){
							//如果已收到货且已支付成功则不显示
						}else{
							if(oneData.payStatus=="PAID"){
								oneHtml+='已支付';
							}else{
								oneHtml+='<font color="#000000">未支付<font>';
							}
						}
					}	
					oneHtml+='</div>';	
					oneHtml+='</span>';
					oneHtml+='</div>';
					oneHtml+='</div>';			
		
					var prodJson=JSON.parse(oneData.productDetailJson);
					$.each(prodJson,function(index,oneProd){
						oneHtml+='<div class="mui-content" style="font-size:.875rem">'
						oneHtml+='<div class="mui-row">'
						oneHtml+='	<span style="color:red">'+oneProd.name+' </span>';	
						oneHtml+='	<span class="Unit-Price">￥'+oneProd.price/100.0+'元/'+oneProd.unit;
						if(!isCanNotAccess(oneProd.specification)){
							oneHtml+='('+oneProd.specification+')';
						}
						oneHtml+='</span>';
						oneHtml+='	<span class="mui-pull-right" style="color:red">x'+oneProd.quantity+'</span>';
						oneHtml+='</div>';
						oneHtml+='</div>';					
					});

					oneHtml+='<div class="goods-imfo"><div class="totle">合计：￥'+oneData.totalFee/100.0+'元</div></div>';
					oneHtml+='</div>';
					oneHtml+='</li>';
					$("#storeOrderList").append(oneHtml);
				});
				
				$("#deliverAllCount").text(json.deliverAllCount);
				$("#deliveringCount").text(json.deliveringCount);
				$("#deliveredCount").text(json.deliveredCount);
				$("#payAllCount").text(json.payAllCount);
				$("#notPayCount").text(json.notPayCount);
				$("#paidCount").text(json.paidCount);
				
			}else{
				console.log("系统错误");
			}
	});	
}

function openOrderDetail(orderId){
	window.location="orderDetailForStore.html?orderId="+orderId;
}

