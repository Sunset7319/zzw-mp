
 $(document).ready(function () {

 	mui('.mui-bar').on('tap', '#home', function (event) {
 		mui.openWindow({
 			url: './index.html?20200828', //通过URL传参
 		})
	 })
	 mui('.mui-bar').on('tap', '#myRecharge', function (event) {
		mui.openWindow({
			url: './myMoney.html?2007', //通过URL传参
		})
	})
 	mui('.mui-bar').on('tap', '#myCar', function (event) {
		 if($(".mask").css("display")=="none" && $(".car").css("display")=="none"){
			$(".mask").css("display","block");
		 	$(".car").css("display","block");
		 }else{
			$(".mask").css("display","none");
			$(".car").css("display","none");
		 }
 	});
	mui('.mui-bar').on('tap', '#my', function (event) {
		mui.openWindow({
			url: './myInfo.html?20200901', //通过URL传参
		})
	});
	
 })

 function closeCarMask (){
	$(".mask").css("display","none");
	$(".car").css("display","none");
 }
 function shopWindow () {
	if ($('#theTrolleyTxt').text() > 0) {
		$('#popover').fadeIn(300);
	
	} else {
		$('#popover').fadeOut(300);
	}
}

function getSubtotalMoney(thePrice){
		return '￥'+parseFloat(thePrice/100).toFixed(2)+'元';
}

function cancelOrderAndRestoreStock(serNum){
	postJson(system_config.interface_biz_host_url+"/cancelBizOrderWithoutToken.do",
			{"orderSerNum":serNum},
		function(json) {
				console.log(json);
	});

}
function deleteMyOrder(id){
	postJson(system_config.interface_biz_host_url+"/deleteBizOrderWithoutToken.do",
			{"id":id},
		function(json) {
				console.log(json);
	});

} 
