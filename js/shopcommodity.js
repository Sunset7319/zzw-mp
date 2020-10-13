$(function () {
    initWeixin(window.location.href);
});

function doBizMain() { //所有的业务方法写到这里
    mui.init();
    getIconImg();
    eventAddShop();
    eventAddpay();
}

function scrollPhoto() {
    var gallery = mui('.mui-slider');
    gallery.slider({
        interval: 3000
    });
    document.querySelector('.mui-slider').addEventListener('slide', function (event) {
        var item1Show = false;
        item2Show = false;
        if (event.detail.slideNumber === 0 && !item1Show) {
            document.getElementsByClassName('mui-indicator')[0].className = 'mui-indicator mui-active';
            document.getElementsByClassName('mui-indicator')[1].className = 'mui-indicator';
            item1Show = true;
        } else if (event.detail.slideNumber === 1 && !item2Show) {
            document.getElementsByClassName('mui-indicator')[0].className = 'mui-indicator';
            document.getElementsByClassName('mui-indicator')[1].className = 'mui-indicator mui-active';
            item2Show = true;
        }
    });
}
function getIconImg () {
    var id = getParaValueFromUrl('id')
    postJson(system_config.interface_biz_host_url + '/getBizProductWithoutToken.do',{'id':id},
     function (jsonData) {
         console.log(jsonData)
         var icon=jsonData.morePics.split(',')
         for(let i=0;i<icon.length;i++){
             var onHtml='';
             onHtml+='  <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="'+icon[i+1]+'"/></div>'
             onHtml+='  <div class="mui-slider-item"><a href="#"><img src="'+icon[i]+'"/></div>'
             onHtml+='  <div class="mui-slider-item"><a href="#"><img src="'+icon[i+1]+'"/></div>'
             onHtml+='  <div class="mui-slider-item mui-slider-item-duplicate"><a href="#"><img src="'+icon[i]+'"/></div>'
             $('.mui-slider-loop').append(onHtml);
         }
        $('.commdity-top-title').text("【"+jsonData.name+"】");
        $('.commdity-top-content-price').text(jsonData.price/100+'元'+'/'+jsonData.unit+'('+jsonData.specification+')');
        $('.commdity-top-content-specification').text('￥'+parseFloat((jsonData.price/100)/parseInt(jsonData.specification)).toFixed(2)+'/斤');
        $('title').text(jsonData.name)
        $('.commodity-photos-content>img').attr('src',icon[icon.length-1]);
        $("#productTitle").text(jsonData.title);
         scrollPhoto()
        })
}

function eventAddShop() {
    var id = getParaValueFromUrl('id')
    $('#addTrolley').on('tap', function () {
        postJson(system_config.interface_biz_host_url + "/saveBizUserTrolleyWithoutToken.do", {
                'productId': id,
                'userOpenId': store.get(system_config.wx_user_openid),
                'storeId': store.get(system_config.user_selected_store)
            },
            function (jsonData) {
                if (jsonData.resultCode == 200) {
                    mui.toast('成功加入购物车', {
                        duration: '300',
                        type: 'div'
                    });
                    loadMyTrolley();
                } else {
                    console.log('系统错误')
                }
            })
    })
}
function eventAddpay () {
    var id=getParaValueFromUrl('id');
    $('#buyNow').click(function (e) { 
        window.location='shopping.html?id='+id;
    });
}
