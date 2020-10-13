$(document).ready(function () {
    initWeixin(window.location.href);
})

function doBizMain() { //所有的业务方法写到这里
    mui.init();
    loadAllProductPrice();
    eventSubmitPrice();
}

function loadAllProductPrice() {
    postJson(system_config.interface_biz_host_url + "/listBizProductWithoutToken.do", {
        "storeId": store.get(system_config.user_selected_store)
    }, function (jsonData) {
        var onHtml=''
        $.each(jsonData.list, function (index, oneProd) { 
             onHtml+='<li class="mui-table-view-cell mui-media" title="'+oneProd.id+'">'
             onHtml+='<img class="mui-media-object mui-pull-left" src='+oneProd.icon+' style="max-width: 55px;height: 55px;">'
             onHtml+=' <div class="mui-media-body">'
             onHtml+=oneProd.name
             onHtml+=' 最新单价：<input type="text" class="mui-input-clear" placeholder="请输入最新单价" style="width: 80px;" value="'+parseFloat(JSON.parse(oneProd.otherPropertyJson).spec_unit_price/100.0).toFixed(2)+'">元/斤'
             onHtml+='</div>'
             onHtml+='</li>'
        });
        $('.information').append(onHtml);
    })
}
function eventSubmitPrice () {
   $("#confirmSubmit").click(function(){
	   var batchJsonArray=[];
	   var checkedInputNum=0;
	   $.each($("input"),function(index,oneInput){
		   console.log($(oneInput).parent().parent().attr("title")+":"+$(oneInput).val())
		   if(parseFloat($(oneInput).val())>0){
			   oneProdPrice={"id":$(oneInput).parent().parent().attr("title"),"specUnitPrice":parseInt(100*$(oneInput).val())};
			   batchJsonArray.push(oneProdPrice);
			   checkedInputNum++;
		   }else{
			   mui.alert("第"+index+"行价格输入错误，请输入正确的大于0的价格！", '输入错误', function() {});	
			   return;
		   }
	   });
	   
	   if(checkedInputNum==$("input").length){
		   postJsonWithPortalHeaderTokenByWechat(
				   system_config.interface_biz_host_url + "/saveBizProductPriceBatch.do",
				   batchJsonArray, function (jsonData) {
					   console.log(jsonData);
		    	if(jsonData.resultCode==200){
		    		mui.alert("保存成功！","成功", function() {});
		    	}else{
		    		mui.alert(jsonData.resultMessage,"失败", function() {});
		    	}
		   });
	   }
   });
}