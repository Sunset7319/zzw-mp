$(document).ready(function () {
	initWeixin(window.location.href);
	mui.init();
	enlargeFontSizeCorrect();
	doBizMain();
})

function doBizMain() { //所有的业务方法写到这里
	mui.init();
	if (!isCanNotAccess(store.get(system_config.user_selected_store))) {
		$(".storeMask").css({"display":"none"});
		$("#storeName").text(store.get(system_config.user_selected_store_name));
		loadPackageBtn();//左边菜单
		loadMyTrollyList();//购物车
	}else{
		loadStoreList();
	}
	//充值有优惠提示文字
	if(store.get(system_config.user_selected_store)=="2"){
		$(".recharge")[0].style.display = "none"
	}else{
		$(".recharge")[0].style.display = "block"
	}
} 

function loadStoreList(){
	if (isCanNotAccess(store.get(system_config.user_selected_store))) {
		cutoverStoreMask();
	}else{
		$(".storeMask").css({"display":"none"});
		doBizMain();
	}	
}
//选择店铺
function cutoverStoreMask(){
	postJson(system_config.interface_biz_host_url + "/listBizStoreWithoutToken.do", {"orderByClause":" id desc" },
			function (json) {
				if (json.resultCode == 200) {
					var theSelectedStoreId=store.get(system_config.user_selected_store);
					var oneHtml ='<div class="store-title">请选择店铺</div>';
					$.each(json.list,function (index, oneData) {
						oneHtml += `<div class="store-item" onclick="doSelectThisStore(${oneData.serNum})">`
						oneHtml += `	<span>${oneData.name}</span>`
						oneHtml += `	<div class="squaredFour">`
						oneHtml += ` 		<input type="radio" value=${oneData.id} id="squared${index}" name="storeBox"`
						if(oneData.id==theSelectedStoreId){
							oneHtml += ` checked `
						}
						oneHtml +=	`/>`
						oneHtml += `  		<label for="squared${index}"></label>`
						oneHtml += `	</div>`
						oneHtml += `</div>`
					});
					oneHtml += `<div class="store-btn"  onclick='cutoverStore()'>确定</div>`
					$(".store").html(oneHtml);
					$(".storeMask").css({"display":"block"});
				} else {
					console.log("系统错误");
				}
	});	
}
//选择店铺按钮
function doSelectThisStore(theStore){
	$(":radio[name='storeBox'][value='" + theStore + "']").prop("checked", "checked");
}
//选择店铺确定按钮
function cutoverStore() {
	var storeId = $('input[name="storeBox"]:checked').val(); 
	var storeName=$('input[name="storeBox"]:checked').parent().prev().text();
	if (isCanNotAccess(storeId)) {
		mui.toast("您还未选择店铺！");
	}else{
		store.set(system_config.user_selected_store,storeId);
		store.set(system_config.user_selected_store_name,storeName);
		$(".storeMask").css({"display":"none"});
		doBizMain();
	}
}

//左边菜单
function loadPackageBtn(){
	postJson(system_config.interface_biz_host_url + "/listSetTypeWithoutToken.do", { storeId: store.get(system_config.user_selected_store),pageSize:100 },
	function (json) {
		if (json.resultCode == 200) {
				var oneHtml = '';
				$.each(json.list, function (index, oneData) {
					oneHtml += `<div id=btn${index}  class="leftContentBtn1" `;
					oneHtml += ` onclick=setMealMenu("${oneData}",${index})>${oneData}</div>`;
				});
				// if(store.get(system_config.user_selected_store)=="2"){

				// }else{
					oneHtml+='<div class="leftContentBtn20" onclick="singlePointMenu()" id="zixuan20">自选</div>';
				// }
				
				$(".leftContent").html(oneHtml);
				$(".leftContent").show();
				$("#theMainContent").attr("class","rightContent");
				
				mui.init();
				mui.previewImage();
				if(store.get(system_config.user_selected_store)=="3"){
					//0时-10默认自选  10-16时默认套餐。16-23时默认自选
					var dateHours = new Date().getHours();
					if(dateHours >= 0 && dateHours <10){
						$("#zixuan20").trigger("click");
					}else if(dateHours >= 10 && dateHours < 16 ){
						$("#btn0").trigger("click");
					}else if(dateHours >= 16 && dateHours < 23 ){
						$("#zixuan20").trigger("click");
					}else{
						$("#btn0").trigger("click");
					}
				}else{
					if(json.list.length>0){
						$("#btn0").trigger("click");
					}else{
						$("#zixuan20").trigger("click");
					}
				}
				
			} else {
				console.log("系统错误");
			}
		});
}
//套餐
function setMealMenu(setTypeName,btnindex) {
	if (btnindex == undefined) {
		btnindex = 0
	}
	var leftbtn = "#btn"+btnindex;
	$(".leftContentBtn1").css({"border-color":"#00b910","color":"#00b910"});
	$(".leftContentBtn20").css({"border-color":"#000000","color":"#000000"});
	$(leftbtn).css({"border-color":"#ff0000","color":"#ff0000"});

	getRequest(system_config.interface_biz_host_url1 +"/show/store/"+ store.get(system_config.user_selected_store)+"/2?tag="+setTypeName,
	// postJson(system_config.interface_biz_host_url + "/listBizFoodSetWithoutToken.do", { storeId: store.get(system_config.user_selected_store) , setType: setTypeName,pageSize:100},
	function (json) {
		if (json.resultCode == 200) {
				$("#storeName")[0].innerHTML =store.get(system_config.user_selected_store_name) + '·';//店铺名后面加个点来判断是否加载最新代码
				$("#commodity").empty();
				if(json.list.length==0){
					mui.toast("该时段暂无商品");
				}
				$.each(json.list, function (index, oneData) {
					var oneHtml = '';
					oneHtml += '<div class="commodity">';
					oneHtml += '<div class="commodity-img">';
					var theFoodImgs=oneData.imageUrl.split(",");
					if(theFoodImgs.length==1){
						oneHtml += '<img style="width:100%;height: 100%;" src="'+theFoodImgs[0]+'" data-preview-src="" data-preview-group="'+index+'"/>';
					}else if(theFoodImgs.length==2){
						oneHtml += '<img style="width:50%;height: 50%;" src="'+theFoodImgs[0]+'" data-preview-src="" data-preview-group="'+index+'"/>';
						oneHtml += '<img style="width:50%;height: 50%;" src="'+theFoodImgs[1]+'" data-preview-src="" data-preview-group="'+index+'"/>';
					}
					oneHtml += '</div>';
					oneHtml += '<div class="commodity-info">';
					oneHtml += '		<div class="commodity-info-title">';
					oneHtml += '		<div class="commodity-info-title-name">'+oneData.name+'</div>'
					oneHtml += '		</div>';
					oneHtml += '		<div class="commodity-info-price">';
					oneHtml += '			<span><span class="commodity-info-price-identifier">￥</span>'+(oneData.price/100).toFixed(2)+'</span>';
					if(!isCanNotAccess(oneData.originalPrice)&&oneData.originalPrice!=oneData.price){
						oneHtml += '<span style="text-decoration:line-through;font-size:12px;font-style:italic;margin-left:3%;">'+(oneData.originalPrice/100).toFixed(2)+'</span>';
					}					
					if(oneData.stock<=0){
						oneHtml += '			<button class="button orange addcar" id="btn'+oneData.id+'" onclick="saveBizUserTrolley('+oneData.id+')" disabled="true">已售罄</button>';
					}else{
						oneHtml += '			<button id="btn'+oneData.id+'" style="width:28%;" onclick="doBuyPackage('+oneData.id+')">点餐</button>';
					}
					oneHtml += '		</div>';
					oneHtml += '	</div>';
					oneHtml += '</div>';
					
					$("#commodity").append(oneHtml);
				});
				mui.init();
				mui.previewImage();
			} else {
				mui.toast(json.resultMessage);
			}
		});
}
//单点
function singlePointMenu() {
	$(".leftContentBtn20").css({"border-color":"#ff0000","color":"#ff0000"});
	$(".leftContentBtn1").css({"border-color":"#00b910","color":"#00b910"});
	getRequest(system_config.interface_biz_host_url1 +"/show/store/"+ store.get(system_config.user_selected_store)+"/1",
	// postJson(system_config.interface_biz_host_url + "/listBizProductUnitWithoutToken.do", {"storeId":store.get(system_config.user_selected_store),"pageSize":1000},
	function (json) {
		if (json.resultCode == 200) {
				$("#storeName")[0].innerHTML =store.get(system_config.user_selected_store_name) + '·';//店铺名后面加个点来判断是否加载最新代码
				$("#commodity").empty();
				$.each(json.list, function (index, oneData) {
					var oneHtml = '';
					oneHtml += '<div class="commodity">';
					oneHtml += '<div class="commodity-img"><img src="'+oneData.imageUrl+'" data-preview-src="" data-preview-group="'+index+'" width="100%"/></div>';
					oneHtml += '<div class="commodity-info">';
					oneHtml += '		<div class="commodity-info-title">';
					oneHtml += '		<div class="commodity-info-title-name">'+oneData.name+'</div>'
					// if(oneData.stock<=0){
					// 	oneHtml += '<span class="commodity-info-sold-out">已售罄</span>';
					// }
					oneHtml += '		</div>';
					oneHtml += '		<div class="commodity-info-price">';
					oneHtml += '			<span><span class="commodity-info-price-identifier">￥</span>'+(oneData.price/100).toFixed(2)+'</span>';
					if(!isCanNotAccess(oneData.originalPrice)&&oneData.originalPrice!=oneData.price){
						oneHtml += '<span style="text-decoration:line-through;font-size:12px;font-style:italic;margin-left:5px;">'+(oneData.originalPrice/100).toFixed(2)+'</span>';
					}					
					if(oneData.stock<=0){
						oneHtml += '			<button class="button orange addcar" id="btn'+oneData.id+'" onclick="saveBizUserTrolley('+oneData.id+')" disabled="true">已售罄</button>';
					}else{
						oneHtml += '			<button id="btn'+oneData.id+'" onclick="saveBizUserTrolley('+oneData.id+')">点 餐</button>';
					}
					oneHtml += '		</div>';
					oneHtml += '	</div>';
					oneHtml += '</div>';
					
					$("#commodity").append(oneHtml);
				});
				mui.init();
				mui.previewImage();
			} else {
				mui.toast(json.resultMessage);
			}
		});
}


function recharge(){
	window.location="./myMoney.html";
}
function showSomeThing(txtStr){
	$("#showSomeThing").html(txtStr);
}
