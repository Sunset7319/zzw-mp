function getParaValueFromUrl(theName) {
    var reg = new RegExp("(^|&)" + theName + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}

function replaceUrl(theUrl,origStr,repStr) {
	return theUrl.replace(origStr,repStr);
}

function isVehicleNumber(vehicleNumber) {
    var result = false;
    if (vehicleNumber.length == 7) {
        var express = /^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/;
        result = express.test(vehicleNumber);
    }
    return result;
}

function checkIsMobile(theStr) {
    var returnpass = false;
    if (theStr
        .match(/^(((13[0-9]{1})|(15[0-9]{1})|(17[0-9]{1})|(18[0-9]{1})|(14[0-9]{1}))+\d{8})$/)) {
        returnpass = true;
    }
    return returnpass;
}

function checkNumber(numBer) {
    var returnpass = false;
    if (numBer.match(/^[0-9]*$/)) {
        returnpass = true;
    }
    return returnpass;
}

function checkIsMailAddress(mailStr) {
    var returnpass = false;
    if (mailStr
        .match(/^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]{2,62}$/)) {
        returnpass = true;
    }
    return returnpass;
}

function checkIsIDCard(idCarStr) {
    var returnpass = false;
    if (idCarStr.match(/^(\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/)) {
        returnpass = true;
    }
    return returnpass;
}

function checkIsValidPwd(pwd) {
    var returnpass = false;
    if (pwd.match(/^.{6,12}$/)) {
        returnpass = true;
    }
    return returnpass;
}
/**
 * 只能输入数字
 */
function onlyNumber(obj) {
    obj.value = obj.value.replace(/[^\d\.]+/g, '');
}

function checkDate(sid, eid) {
    var startDate = document.getElementById(sid).value;
    var endDate = document.getElementById(eid).value;
    if (startDate != null && startDate != "" && endDate != null &&
        endDate != "") {
        if (startDate > endDate) {
            alert("开始时间不能大于结束时间!");
            return false;
        }
    }
    return true;
}

function isUndefined(tmp) {
    if (typeof(tmp) == "undefined") {
        return true;
    } else {
        return false;
    }
}

function isEmpty(tmp) {
    if ($.trim(tmp) == "") {
        return true;
    } else {
        return false;
    }
}

function isNull(arg1) {
    return !arg1 && arg1 !== 0 && typeof arg1 !== "boolean" ? true : false;
}

function isCanNotAccess(tmp) {
    if (isUndefined(tmp) || isEmpty(tmp) || isNull(tmp)) {
        return true;
    } else {
        return false;
    }
}

function formatNullNanUndefined(tmp) {
    if (isUndefined(tmp) || isEmpty(tmp) || isNull(tmp)) {
        return "";
    } else {
        return tmp;
    }
}

function formatDateToStr(time) {
	if(formatNullNanUndefined(time)){
		var datetime = new Date();
	    datetime.setTime(time);
	    var year = datetime.getFullYear();
	    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) :
	        datetime.getMonth() + 1;
	    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime
	        .getDate();
	    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime
	        .getHours();
	    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() :
	        datetime.getMinutes();
	    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() :
	        datetime.getSeconds();
	    return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" +
	        second;
	}else{
		return '';
	}
    
}

function getDateMonthFirstDateStr(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) :
        datetime.getMonth() + 1;
    var date = "01";
    return year + "-" + month + "-" + date;

}

function getDateMonthLastDateStr(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) :
        datetime.getMonth() + 1;

    var day = new Date(year, month, 0);
    return year + "-" + month + "-" + day.getDate();

}

function addMonth(theTime, num) {
    num = parseInt(num, "10");
    var datetime = new Date();
    datetime.setTime(theTime);
    var sYear = datetime.getFullYear();
    var sMonth = datetime.getMonth() + 1;
    var sDay = datetime.getDate();

    var eYear = sYear;
    var eMonth = sMonth + num;
    var eDay = sDay;
    while (eMonth > 12) {
        eYear++;
        eMonth -= 12;
    }
    var eDate = new Date(eYear, eMonth - 1, eDay);
    while (eDate.getMonth() != eMonth - 1) {
        eDay--;
        eDate = new Date(eYear, eMonth - 1, eDay);
    }
    return eDate;
}

function addDayTimes(theTime, num) {
    num = parseInt(num, "10");
    return theTime + 24 * 60 * 60 * 1000 * num;
}

function getDateWeekMondayStr(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var day = datetime.getDay();
    var oneDayLong = 24 * 60 * 60 * 1000;
    var mondayTime = time - (day - 1) * oneDayLong;

    return formatDateToStrOnlyDay(mondayTime);

}

function getDateWeekSundayStr(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var day = datetime.getDay();
    var oneDayLong = 24 * 60 * 60 * 1000;
    var sundayTime = time + (7 - day) * oneDayLong;

    return formatDateToStrOnlyDay(sundayTime);

}

function formatDateToStrOnlyDay(time) {
	if(formatNullNanUndefined(time)){
		var datetime = new Date();
	    datetime.setTime(time);
	    var year = datetime.getFullYear();
	    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) :
	        datetime.getMonth() + 1;
	    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime
	        .getDate();
	    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime
	        .getHours();
	    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() :
	        datetime.getMinutes();
	    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() :
	        datetime.getSeconds();
	    return year + "-" + month + "-" + date;
	}else{
		return '';
	}
	    
}

function getDateTimeFromStr(str) {
    var theStrDate = str.split(" ")[0];
    var theStrTime = str.split(" ")[1];

    var year = theStrDate.split("-")[0];
    var month = theStrDate.split("-")[1];
    var day = theStrDate.split("-")[2];
    var hour = theStrTime.split(":")[0];
    var minute = theStrTime.split(":")[1];
    var second = theStrTime.split(":")[2];

    var datetime = new Date();
    datetime.setFullYear(year);
    datetime.setMonth(month - 1);
    datetime.setDate(day);
    datetime.setHours(hour);
    datetime.setMinutes(minute);
    datetime.setSeconds(second);
    return datetime.getTime();
}

function getMysql8DateTimeFromStr(str){
    var theStrDate = str.split("T")[0];
    var theStrTime = str.split("T")[1];

    var year = theStrDate.split("-")[0];
    var month = theStrDate.split("-")[1];
    var day = theStrDate.split("-")[2];
    var hour = theStrTime.split(":")[0];
    var minute = theStrTime.split(":")[1];
    var second = parseInt(theStrTime.split(":")[2]);

    var datetime = new Date();
    datetime.setFullYear(year);
    datetime.setMonth(month - 1);
    datetime.setDate(day);
    datetime.setHours(hour);
    datetime.setMinutes(minute);
    datetime.setSeconds(second);
    return datetime.getTime();	
}

function getDateTimeFromStrOnlyMinutes(str) {
    var theStrDate = str.split(" ")[0];
    var theStrTime = str.split(" ")[1];

    var year = theStrDate.split("-")[0];
    var month = theStrDate.split("-")[1];
    var day = theStrDate.split("-")[2];
    var hour = theStrTime.split(":")[0];
    var minute = theStrTime.split(":")[1];

    var datetime = new Date();
    datetime.setFullYear(year);
    datetime.setMonth(month - 1);
    datetime.setDate(day);
    datetime.setHours(hour);
    datetime.setMinutes(minute);
    datetime.setSeconds(0);
    return datetime.getTime();
}

function getDateTimeFromYYYYMMDDStr(str) {
    var year = str.split("-")[0];
    var month = str.split("-")[1];
    var day = str.split("-")[2];
    var datetime = new Date();
    datetime.setFullYear(year);
    datetime.setMonth(month - 1);
    datetime.setDate(day);
    datetime.setHours(0);
    datetime.setMinutes(0);
    datetime.setSeconds(0);
    return datetime.getTime();
}

function formatDateToStrWithoutSecend(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) :
        datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime
        .getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime
        .getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() :
        datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() :
        datetime.getSeconds();
    return year + "-" + month + "-" + date + " " + hour + ":" + minute;
}

function formatDateToStrNoYear(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var year = datetime.getFullYear();
    var month = datetime.getMonth() + 1 < 10 ? "0" + (datetime.getMonth() + 1) :
        datetime.getMonth() + 1;
    var date = datetime.getDate() < 10 ? "0" + datetime.getDate() : datetime
        .getDate();
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime
        .getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() :
        datetime.getMinutes();
    var second = datetime.getSeconds() < 10 ? "0" + datetime.getSeconds() :
        datetime.getSeconds();
    return month + "-" + date + " " + hour + ":" + minute;
}

function formatDateToHourMinute(time) {
    var datetime = new Date();
    datetime.setTime(time);
    var hour = datetime.getHours() < 10 ? "0" + datetime.getHours() : datetime
        .getHours();
    var minute = datetime.getMinutes() < 10 ? "0" + datetime.getMinutes() :
        datetime.getMinutes();
    return "" + hour + ":" + minute;
}

function isNotBlank(theVal) {
    if ($.trim(theVal) != "") {
        return true;
    } else {
        return false;
    }
}

function formatNullToEmpty(theVal) {
    if (isCanNotAccess(theVal)) {
        return "";
    } else {
        return theVal
    }
}

function isBlank(theVal) {
    if ($.trim(theVal) == "") {
        return true;
    } else {
        return false;
    }
}

function convertUrlParamStrToJSON(paramStr) {
    var paramItems = new Array();
    if (isNotBlank(paramStr) && paramStr.indexOf("?") == 0) {
        paramItems = paramStr.substring(1, paramStr.length).split('&');
    } else {
        paramItems = paramStr.split('&');
    }
    var resultJson = {};
    for (var i = 0; i < paramItems.length; i++) {
        var oneItemStr = paramItems[i].split('=');
        var theItemValue = $.trim(oneItemStr[1].replace(/%09/g, " ").replace(/\+/g, ' ')); //替换Tab键为空格,
        resultJson[oneItemStr[0]] = $.trim(decodeURIComponent(theItemValue));
    }
    return resultJson;
}

function convertJsonToUrlParamStr(data) {
    var string_ = JSON.stringify(data);

    string_ = string_.replace(/{/g, "");
    string_ = string_.replace(/}/g, "");
    string_ = string_.replace(/:/g, "=")
    string_ = string_.replace(/,/g, "&");
    string_ = string_.replace(/"/g, "");
    return string_;
}

function putJsonToForm(jsonValue, formId) {
    var obj = $("#" + formId);
    $.each(jsonValue, function(name, ival) {
        var $oinput = obj.find("input[name='" + name + "']");
        if ($oinput.attr("type") == "radio" ||
            $oinput.attr("type") == "checkbox") {
            $oinput.each(function() {
                if (Object.prototype.toString.apply(ival) == '[object Array]') { //是复选框，并且是数组         
                    for (var i = 0; i < ival.length; i++) {
                        if ($(this).val() == ival[i])
                            $(this).attr("checked", true);
                    }
                } else if (!ival) {
                    $(this).attr("checked", false);
                } else {
                    if ($(this).val() == ival)
                        $(this).attr("checked", true);
                }
            });
        } else if ($oinput.attr("type") == "textarea") { //多行文本框            
            obj.find("[name=" + name + "]").html(ival);
        } else {
            obj.find("[name=" + name + "]").val(ival);
        }
    });
}



function httpEncodeSpecialChar(sStr) {
    return escape(sStr).replace(/\+/g, '%2B').replace(/\"/g, '%22').replace(
        /\'/g, '%27').replace(/\//g, '%2F');
}

function encryptedFromAndPost(formId, getRSAKeyUrl, postUrl, callback) {
    $.getJSON(getRSAKeyUrl,
        function(json) {
            if (json.resultCode == 200) {
                var formJSON = convertUrlParamStrToJSON($("#" + formId).serialize()); //自动将form表单封装成json
                alert(decodeURI(JSON.stringify(formJSON)));

                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(json.keyword);

                var theEncrptBodyStr = encrypt.encrypt(decodeURI(JSON.stringify(formJSON)));
                alert(theEncrptBodyStr);

                $.ajax({
                    type: "post",
                    url: postUrl,
                    data: httpEncodeSpecialChar(theEncrptBodyStr),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json', //返回数据类型   
                    success: function(jsonData, textStatus) {
                        callback(jsonData);
                    },
                    error: function() {
                        /*alert("操作异常");*/
                    }
                });
            }
        });
}

function encryptedJSONAndPost(theJSON, getRSAKeyUrl, postUrl, callback) {
    $.getJSON(getRSAKeyUrl,
        function(json) {
            if (json.resultCode == 200) {
                var encrypt = new JSEncrypt();
                encrypt.setPublicKey(json.keyword);
                //alert(json.keyword);

                var theEncrptBodyStr = encrypt.encrypt(JSON.stringify(theJSON));
                /*if(postUrl.indexOf("postFetchWechatUserInfo")>0){
                	alert(JSON.stringify(theJSON));
                	$("#carInfo").val(theEncrptBodyStr);
                }**/

                $.ajax({
                    type: "post",
                    url: postUrl,
                    data: httpEncodeSpecialChar(theEncrptBodyStr),
                    contentType: "application/json; charset=utf-8",
                    dataType: 'json', //返回数据类型   
                    success: function(jsonData, textStatus) {
                        callback(jsonData);
                    },
                    error: function() {
                        /*alert("操作异常");*/
                    }
                });
            }
        });
}

/**
 * 登录后台调用接口必须用这个方法，在Header里传了后台登录后的Token及表示PC端数字1
 * @param postUrl
 * @param paraJson
 * @param callback
 */
function postJsonWithConsoleHeaderToken(postUrl, paraJson, callback) {
    $.ajax({
        type: "post",
        url: postUrl,
        data: JSON.stringify(paraJson),
        headers: { "accessToken": store.get(system_config.console_access_token), "ostype": 1 },
        contentType: "application/json; charset=utf-8",
        dataType: 'json', //返回数据类型   
        success: function(jsonData, textStatus) {
        	if (jsonData.resultCode == "401") {
        		window.location = "../admin/login.html"
        	}else{
        		callback(jsonData);
        	}
            
        },
        error: function() {
            //			alert("异常"+postUrl);
        }
    });
}


function getFileWithConsoleHeaderToken(postUrl, paraJson) {
    var paraStr = convertJsonToUrlParamStr(paraJson);
    window.open(postUrl + "?" + paraStr + "&accessToken=" + store.get(system_config.console_access_token) + "&ostype=1");
}

function getFileWithPortalHeaderToken(postUrl, paraJson) {
    var paraStr = convertJsonToUrlParamStr(paraJson);
    window.open(postUrl + "?" + paraStr + "&userToken=" + store.get(system_config.portal_access_token) + "&ostype=1");
}
/**
 * 登录后台调用文件上传必须用这个方法，在Header里传了后台登录后的Token及表示PC端数字1
 * @param postUrl
 * @param formData
 * @param callback
 */
function postFileWithConsoleHeaderToken(postUrl, formData, callback) {
    $.ajax({
        type: "post",
        url: postUrl,
        cache: false,
        headers: { "accessToken": store.get(system_config.console_access_token), "ostype": 1 },
        data: formData,
        processData: false,
        contentType: false,
        success: function(jsonData, textStatus) {
            callback(jsonData);
        },
        error: function() {
            //			alert("异常"+postUrl);
        }
    });
}

/**
 * 网站页面调用接口必须用这个方法，在Header里传了网站登录后的Token及表示PC端数字1
 * @param postUrl
 * @param paraJson
 * @param callback
 */
function postJsonWithPortalHeaderToken(postUrl, paraJson, callback) {
    $.ajax({
        type: "post",
        url: postUrl,
        data: JSON.stringify(paraJson),
        headers: { "userToken": store.get(system_config.portal_access_token), "ostype": 1 },
        contentType: "application/json; charset=utf-8",
        dataType: 'json', //返回数据类型   
        success: function(jsonData, textStatus) {
            if (jsonData.resultCode == "401") {
            	if($('div').hasClass('popup-wrap')){
        		
            	}else{
	                var popupObject = newPopupCup({
	                    title: "OKDOM提示",
	                    title1: jsonData.resultMessage,
	                    content: "",
	                    content1: ""
	                }, "notBtnIconHaveTitle");
                    popupObject.openMask();
                    callback(jsonData)
	                setTimeout(function() {
	                	window.location = "login.html?backUrl=" + window.location.href;
//	                    window.location.replace("/login.html");
	                }, 2000)
            	}
            } else {
                callback(jsonData);
            }
        },
        error: function() {
            //			alert("异常"+postUrl);
        }
    });
    
}
/**
 * pc调用文件上传必须用这个方法，在Header里传了后台登录后的Token及表示PC端数字1
 * @param postUrl
 * @param formData
 * @param callback
 */
function postFileWithPortalHeaderToken(postUrl, formData, callback, errorCallback) {
    $.ajax({
        type: "post",
        url: postUrl,
        cache: false,
        headers: { "userToken": store.get(system_config.portal_access_token), "ostype": 1 },
        data: formData,
        processData: false,
        contentType: false,
        timeout:0,
        success: function(jsonData, textStatus) {
            if (jsonData.resultCode == "401") {
                if($('div').hasClass('popup-wrap')){
        		
            	}else{
	                var popupObject = newPopupCup({
	                    title: "OKDOM提示",
	                    title1: jsonData.resultMessage,
	                    content: "",
	                    content1: ""
	                }, "notBtnIconHaveTitle");
                    popupObject.openMask();
	                setTimeout(function() {
	                	window.location = "login.html?backUrl=" + window.location.href;
	                    //window.location.replace("/login.html");
	                }, 2000)
            	}
            } else {
                callback(jsonData);
            }

        },
        error: function() {
            errorCallback && errorCallback();
            //			alert("异常"+postUrl);
        }
    });
}





/**
 * H5页面调用接口必须用这个方法，在Header里传了H5登录后的Token及表示H5端数字5
 * @param postUrl
 * @param paraJson
 * @param callback
 */
function postJsonWithPortalHeaderTokenByMobile(postUrl, paraJson, callback) {
    $.ajax({
        type: "post",
        url: postUrl,
        data: JSON.stringify(paraJson),
        headers: { "userToken": store.get(system_config.portal_access_token), "ostype": 5 },
        contentType: "application/json; charset=utf-8",
        dataType: 'json', //返回数据类型   
        success: function(jsonData, textStatus) {
            if (jsonData.resultCode == "401") {
                layer.open({
					content: '请先登录！',
					shade: false,
					className: 'layer-hint-popup',
					time: 1.5
				});
                setTimeout(function loginok() {
                    window.location = "login.html?backUrl=" + window.location.href;
                }, 1500);
            } else {
                callback(jsonData);
            }
        },
        error: function() {
            //			alert("异常"+postUrl);
        }
    });
}

/**
 * Wechat页面调用接口必须用这个方法，在Header里传了Wechat登录后的Token及表示Wechat端数字4
 * @param postUrl
 * @param paraJson
 * @param callback
 */
function postJsonWithPortalHeaderTokenByWechat(postUrl, paraJson, callback) {
    $.ajax({
        type: "post",
        url: postUrl,
        data: JSON.stringify(paraJson),
        headers: { "userToken": store.get(system_config.portal_access_token), "ostype": 4 },
        contentType: "application/json; charset=utf-8",
        dataType: 'json', //返回数据类型   
        success: function(jsonData, textStatus) {
            if (jsonData.resultCode == "401") {

            } else {
                callback(jsonData);
            }
        },
        error: function() {
            //			alert("异常"+postUrl);
        }
    });
}
/**
 * 该方法使用ES6的promise,只能在H5调用
 * @param postUrl
 * @param paraJson
 */
var asyncPostJsonWithPortalHeaderTokenByMobile = function (postUrl, paraJson) {
    return new Promise(function (resolve, reject) {
        $.ajax({
            type: "post",
            url: postUrl,
            data: JSON.stringify(paraJson),
            headers: { "userToken": store.get(system_config.portal_access_token), "ostype": 5 },
            contentType: "application/json; charset=utf-8",
            dataType: 'json', //返回数据类型   
            success: function (jsonData, textStatus) {
                if (jsonData.resultCode == "401") {
                    layer.open({
                        content: '请先登录！',
                        shade: false,
                        className: 'layer-hint-popup',
                        time: 1.5
                    });
                    setTimeout(function loginok() {
                        window.location = "login.html?backUrl=" + window.location.href;
                    }, 1500);
                }
                resolve(jsonData);
            },
            error: function (err) {
                reject(err)
            }
        });
    })
}

/**
 * H5后台调用文件上传必须用这个方法，在Header里传了H5登录后的Token及表示H5端数字5
 * @param postUrl
 * @param formData
 * @param callback
 */
function postFileWithPortalHeaderTokenByMobile(postUrl, formData, callback) {
    $.ajax({
        type: "post",
        url: postUrl,
        cache: false,
        headers: { "userToken": store.get(system_config.portal_access_token), "ostype": 5 },
        data: formData,
        processData: false,
        contentType: false,
        success: function(jsonData, textStatus) {
            if (jsonData.resultCode == "401") {
                layer.open({
					content: '请先登录！',
					shade: false,
					className: 'layer-hint-popup',
					time: 1.5
				});
                setTimeout(function loginok() {
                    window.location = "h5/login.html?backUrl=" + window.location.href;
                }, 1500);
            } else {
                callback(jsonData);
            }
        },
        error: function() {
            //			errFun&&errFun();
            //			alert("异常"+postUrl);
        }
    });
}

function postJson(postUrl, paraJson, callback) {
    $.ajax({
        type: "post",
        url: postUrl,
        data: JSON.stringify(paraJson),
        contentType: "application/json; charset=utf-8",
        dataType: 'json', //返回数据类型   
        success: function(jsonData, textStatus) {
            callback(jsonData);
        },
        error: function() {
            //			alert("异常"+postUrl);
        }
    });
}
function getRequest(Url, callback) {
    $.ajax({
        type: "get",
        url: Url,
        // data: JSON.stringify(paraJson),
        contentType: "application/json; charset=utf-8",
        dataType: 'json', //返回数据类型   
        success: function(jsonData, textStatus) {
            callback(jsonData);
        },
        error: function() {
        }
    });
}
function postFile(postUrl, formData, callback) {
    $.ajax({
        type: "post",
        url: postUrl,
        cache: false,
        data: formData,
        processData: false,
        contentType: false,
        success: function(jsonData, textStatus) {
            callback(jsonData);
        },
        error: function() {
            //			alert("异常"+postUrl);
        }
    });
}

function doPortalTokenCheck(checkTokenUrl,successCallback,failCallback) {
	postJsonWithPortalHeaderToken(
			checkTokenUrl, {},
	        function(jsonData) {
	            if (jsonData.resultCode == 200) {
	            	successCallback && successCallback(jsonData);
	            } else {
	            	failCallback && failCallback(jsonData);
	            }
	        });
}

function doPortalTokenCheckPc(callback) {
    postJsonWithPortalHeaderToken(
        system_config.interface_oauth_host_url + '/checkAccessToken.do', {},
        function(jsonData) {
            if (jsonData.resultCode == 200) {
                callback && callback(jsonData);
            } else {
//              layer.msg("请先登录");
                var popupObject = newPopupCup({
	                    title: "OKDOM提示",
	                    title1: "请先登录",
	                    content: "",
	                    content1: ""
	                }, "notBtnIconHaveTitle");
                    popupObject.openMask();
                setTimeout(function loginok() {
                    window.location = "login.html?backUrl=" + window.location.href;
                }, 1500);

            }
        });
}

function doPortalTokenCheckByMobile(checkTokenUrl,successCallback,failCallback) {
    postJsonWithPortalHeaderTokenByMobile(
    	checkTokenUrl, {},
        function(jsonData) {
            if (jsonData.resultCode == 200) {
            	successCallback && successCallback(jsonData);
            } else {
            	failCallback &&failCallback(jsonData);
            }
        });
}

function doPortalUserShow(callback) {
    postJsonWithPortalHeaderToken(
        system_config.interface_oauth_host_url + '/checkAccessToken.do', {},
        function(jsonData) {
            if (jsonData.resultCode == 200) {
                callback && callback(jsonData);
            }
        });
}



//UEBase编码
function UEBase64() {

    // private property  
    _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

    // public method for encoding  
    this.encode = function(input) {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;
        input = _utf8_encode(input);
        while (i < input.length) {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);
            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;
            if (isNaN(chr2)) {
                enc3 = enc4 = 64;
            } else if (isNaN(chr3)) {
                enc4 = 64;
            }
            output = output +
                _keyStr.charAt(enc1) + _keyStr.charAt(enc2) +
                _keyStr.charAt(enc3) + _keyStr.charAt(enc4);
        }
        return output;
    }

    // public method for decoding  
    this.decode = function(input) {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;
        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length) {
            enc1 = _keyStr.indexOf(input.charAt(i++));
            enc2 = _keyStr.indexOf(input.charAt(i++));
            enc3 = _keyStr.indexOf(input.charAt(i++));
            enc4 = _keyStr.indexOf(input.charAt(i++));
            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;
            output = output + String.fromCharCode(chr1);
            if (enc3 != 64) {
                output = output + String.fromCharCode(chr2);
            }
            if (enc4 != 64) {
                output = output + String.fromCharCode(chr3);
            }
        }
        output = _utf8_decode(output);
        return output;
    }

    // private method for UTF-8 encoding  
    _utf8_encode = function(string) {
        string = string.replace(/\r\n/g, "\n");
        var utftext = "";
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            } else if ((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            } else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        }
        return utftext;
    }

    // private method for UTF-8 decoding  
    _utf8_decode = function(utftext) {
        var string = "";
        var i = 0;
        var c = c1 = c2 = 0;
        while (i < utftext.length) {
            c = utftext.charCodeAt(i);
            if (c < 128) {
                string += String.fromCharCode(c);
                i++;
            } else if ((c > 191) && (c < 224)) {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            } else {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }
        }
        return string;
    }
}
//负数判断
function checkNum(input, val) {
    input.value = val >= 0 ? val : 0
}

//窗口封装函数
function popupCup(json, btnType) {
    var html = ''; //渲染
    var popupMaskObj = null;
    var popupMaskTemp = null;
    var appendMaskTemp = null;
    var init = null;
    var event = null;

    event = function(el, json) {
        $(el).find(".save-button").click(function() {
            json.completeFun && json.completeFun();
        })
        $(el).find(".operate-button .cancel-button").click(function() {
            json.cancleFun && json.cancleFun();
        })
        $(el).find('.close-button').click(function() {
            $('.popup-wrap').addClass('dis-no');
        })
    }

    popupMaskTemp = function(json, btnType) {
        switch (btnType) {
            case "haveBtn":
                html = $('<div class="popup-wrap dis-no">' +
                    '<div class="shade"></div>' +
                    '<div class="popup-title-sm">' +
                    '<div class="popup-title">' +
                    '<span>OKODM提示</span>' +
                    '<img src="http://public-okodm.oss-cn-shenzhen.aliyuncs.com/images/member-center-address-invoice/close.png" class="close-button">' +
                    '</div>' +
                    '<div class="popup-hint">' +
                    '<div class="hint-word">' +
                    '<img src="http://public-okodm.oss-cn-shenzhen.aliyuncs.com/images/member-center-address-invoice/prompt.png">' +
                    '<span>' + json.content + '</span>' +
                    '</div>' +
                    '<div class="operate-button">' +
                    '<button type="button" class="save-button">' + json.completeBtn + '</button>' +
                    '<button type="button" class="cancel-button">' + json.cancleBtn + '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                break;
            case "notBtn":
                html = $('<div class="popup-wrap dis-no">' +
                    '<div class="shade"></div>' +
                    '<div class="popup-title-sm">' +
                    '<div class="popup-title">' +
                    '<span>OKODM提示</span>' +
                    '<img src="http://public-okodm.oss-cn-shenzhen.aliyuncs.com/images/member-center-address-invoice/close.png" class="close-button">' +
                    '</div>' +
                    '<div class="popup-hint">' +
                    '<div class="hint-word">' +
                    '<p>' + json.content + '</p>' +
                    '<p>' + json.content1 + '</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                break;
        }
        return html;
    }

    appendMaskTemp = function(el, html) { //返回值为窗体DOM
        if (el) {
            $(el).replaceWith(html);
        } else {
            $('body').append(html);
        }
        return html;
    }

    replaceProps = function(json, newJson) {
        for (var key in newJson) {
            json[key] = newJson[key]; //如果有相同的属性就替换覆盖
        }
        return json;
    }

    init = function() {
        //生成窗体
        var el = appendMaskTemp(null, popupMaskTemp(json, btnType));
        //窗体事件
        event(el, json);
        //生成窗体对象
        popupMaskObj = {
            el: el,
            btnType: btnType,
            getOption: function() { //获取当前配置参数
                return json;
            },
            openMask: function() {
                this.el.toggleClass('dis-no');
            },
            setOption: function(config) {
                //合并配置参数
                config = replaceProps(this.getOption(), config);
                //重新渲染
                this.el = appendMaskTemp(this.el, popupMaskTemp(config, this.btnType))
                //事件更新
                event(this.el, config);
            }
        }
        return popupMaskObj;
    };

    return init();
}
//窗口封装函数
function newPopupCup(json, btnType) {
    var html = ''; //渲染
    var popupMaskObj = null;
    var popupMaskTemp = null;
    var appendMaskTemp = null;
    var init = null;
    var event = null;

    event = function(el, json) {
        $(el).find(".save-button").click(function() {
            json.completeFun && json.completeFun();
        })
        $(el).find(".operate-button .save-oneButton").click(function() {
            json.cancleFun && json.cancleFun();
        })
        $(el).find(".operate-button .cancel-button").click(function() {
            json.cancleFun && json.cancleFun();
        })

        $(el).find('.close-button').click(function() {
            $('.popup-wrap').remove();
        })
    }

    popupMaskTemp = function(json, btnType) {
        switch (btnType) {
            case "haveBtn":
                html = $('<div class="popup-wrap dis-no">' +
                    '<div class="popup-shade"></div>' +
                    '<div class="popup-sm">' +
                    '<div class="popup-title">' +
                    '<span>' + json.title + '</span>' +
                    '<img src="../images/prompt-close.svg" class="close-button">' +
                    '</div>' +
                    '<div class="popup-hint">' +
                    '<div class="hint-word">' +
                    '<img src="../images/prompt.svg">' +
                    '<span>' + json.title1 + '</span>' +
                    '<div>' + json.content + '</div>' +
                    '<div>' + json.content1 + '</div>' +
                    '</div>' +
                    '<div class="operate-button">' +
                    '<button type="button" class="save-button">' + json.completeBtn + '</button>' +
                    '<button type="button" class="cancel-button">' + json.cancleBtn + '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                break;
            case "oneBtn":
                html = $('<div class="popup-wrap dis-no">' +
                    '<div class="popup-shade"></div>' +
                    '<div class="popup-sm">' +
                    '<div class="popup-title">' +
                    '<span>' + json.title + '</span>' +
                    '<img src="../images/prompt-close.svg" class="close-button">' +
                    '</div>' +
                    '<div class="popup-hint">' +
                    '<div class="hint-word">' +
                    '<img src="../images/prompt.svg">' +
                    '<span>' + json.title1 + '</span>' +
                    '<div>' + json.content + '</div>' +
                    '<div>' + json.content1 + '</div>' +
                    '</div>' +
                    '<div class="operate-button">' +
                    '<button type="button" class="save-oneButton">' + json.completeBtn + '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                break;
            case "oneBtnNoIcon":
                html = $('<div class="popup-wrap dis-no">' +
                    '<div class="popup-shade"></div>' +
                    '<div class="popup-sm">' +
                    '<div class="popup-title">' +
                    '<span>' + json.title + '</span>' +
                    '<img src="../images/prompt-close.svg" class="close-button">' +
                    '</div>' +
                    '<div class="popup-hint">' +
                    '<div class="hint-word">' +
                    '<span>' + json.title1 + '</span>' +
                    '<div>' + json.content + '</div>' +
                    '<div>' + json.content1 + '</div>' +
                    '</div>' +
                    '<div class="operate-button">' +
                    '<button type="button" class="save-oneButton">' + json.completeBtn + '</button>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                break;
            case "notBtn":
                html = $('<div class="popup-wrap dis-no">' +
                    '<div class="popup-shade"></div>' +
                    '<div class="popup-sm">' +
                    '<div class="popup-title">' +
                    '<span>' + json.title + '</span>' +
                    '<img src="../images/prompt-close.svg" class="close-button">' +
                    '</div>' +
                    '<div class="popup-hint">' +
                    '<div class="hint-word">' +
                    '<img src="../images/prompt.svg">' +
                    '<span>' + json.title1 + '</span>' +
                    '<div>' + json.content + '</div>' +
                    '<div>' + json.content1 + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                break;
            case "notBtnIcon":
                html = $('<div class="popup-wrap dis-no">' +
                    '<div class="popup-shade"></div>' +
                    '<div class="popup-sm">' +
                    '<div class="popup-hint">' +
                    '<div class="hint-word">' +
                    '<span>' + json.title1 + '</span>' +
                    '<div>' + json.content + '</div>' +
                    '<div>' + json.content1 + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                break;
            case "notBtnIconHaveTitle":
                html = $('<div class="popup-wrap dis-no">' +
                    '<div class="popup-shade"></div>' +
                    '<div class="popup-sm">' +
                    '<div class="popup-title">' +
                    '<span>' + json.title + '</span>' +
                    '</div>' +
                    '<div class="popup-hint">' +
                    '<div class="hint-word">' +
                    '<img src="../images/prompt.svg">' +
                    '<span>' + json.title1 + '</span>' +
                    '<div>' + json.content + '</div>' +
                    '<div>' + json.content1 + '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
                break;
        }
        return html;
    }

    appendMaskTemp = function(el, html) { //返回值为窗体DOM
        if (el) {
            $(el).replaceWith(html);
        } else {
            $('body').append(html);
        }
        return html;
    }

    replaceProps = function(json, newJson) {
        for (var key in newJson) {
            json[key] = newJson[key]; //如果有相同的属性就替换覆盖
        }
        return json;
    }

    init = function() {
        //生成窗体
        var el = appendMaskTemp(null, popupMaskTemp(json, btnType));
        //窗体事件
        event(el, json);
        //生成窗体对象
        popupMaskObj = {
            el: el,
            btnType: btnType,
            getOption: function() { //获取当前配置参数
                return json;
            },
            openMask: function() {
                this.el.toggleClass('dis-no');
            },
            setOption: function(config) {
                //合并配置参数
                config = replaceProps(this.getOption(), config);
                //重新渲染
                this.el = appendMaskTemp(this.el, popupMaskTemp(config, this.btnType))
                //事件更新
                event(this.el, config);
            }
        }
        return popupMaskObj;
    };

    return init();
}
function newPopupCupPaymentweixin(json, btnType){
	console.log(json)
    var html = ''; //渲染
    var popupMaskObj = null;
    var popupMaskTemp = null;
    var appendMaskTemp = null;
    var init = null;
    var event = null;
	var weixinTimer;//定时器
    event = function(el, json) {
        $(el).find('.close-button').click(function() {
            $('.popup-wrap').remove();
            clearInterval(weixinTimer)
        })
    }
	var nowTime = new Date().getTime()+7200000;
    weixinTimer = setInterval(function(){backDeadline(nowTime,function(time){
    	$(".payment-weixin .invalid span")[0].innerText = time;
    })},1000);
    
	popupMaskTemp = function(json, btnType) {
        html = $('<div class="popup-wrap payment-weixin dis-no" >' +
				'<div class="popup-shade"></div>' +
				'<div class="popup-sm">' +
					'<div class="popup-title">' +
						'<span>微信支付</span>' +
						'<img src="../images/prompt-close.svg" class="close-button">' +
					'</div>' +
					'<div class="popup-hint">' +
						'<div class="weixin-qrCode">' +
							'<div class="textDescription">' +
								'<div class="invalid">请在2小时内支付，否则二维码将失效，还剩余<span>2小时00分00秒</span></div>' +
							'</div>' +
							'<div class="weixin-qrCode-border"><img src='+json.theImgUrl+' /></div>' +
							'<div class="textDescription">' +
								'<a href='+json.successUrl+'>如已支付成功，请点击查看结果</a>' +
							'</div>' +
						'</div>' +
						'<div class="weixin-mobile">' +
							'<div class="weixin-mobile-left"><img src="images/weixin-mobile.png" /></div>' +
						'</div>' +
					'</div>' +
				'</div>' +
			'</div>');

        return html;
    }
    
    

    appendMaskTemp = function(el, html) { //返回值为窗体DOM
        if (el) {
            $(el).replaceWith(html);
        } else {
            $('body').append(html);
        }
        return html;
    }

    replaceProps = function(json, newJson) {
        for (var key in newJson) {
            json[key] = newJson[key]; //如果有相同的属性就替换覆盖
        }
        return json;
    }

    init = function() {
        //生成窗体
        var el = appendMaskTemp(null, popupMaskTemp(json, btnType));
        //窗体事件
        event(el, json);
        //生成窗体对象
        popupMaskObj = {
            el: el,
            btnType: btnType,
            getOption: function() { //获取当前配置参数
                return json;
            },
            openMask: function() {
                this.el.toggleClass('dis-no');
            },
            setOption: function(config) {
                //合并配置参数
                config = replaceProps(this.getOption(), config);
                //重新渲染
                this.el = appendMaskTemp(this.el, popupMaskTemp(config, this.btnType))
                //事件更新
                event(this.el, config);
            }
        }
        return popupMaskObj;
    };
    
    return init();
}
function backDeadline(deadline,callback){
//	var date1=deadline+(24*60*60*1000);
	var date3=deadline - new Date().getTime()
	
	var days=Math.floor(date3/(24*3600*1000));
	//计算出小时数
	var leave1=date3%(24*3600*1000);    //计算天数后剩余的毫秒数
	var hours=Math.floor(leave1/(3600*1000));
	
	//计算相差分钟数
	var leave2=leave1%(3600*1000);        //计算小时数后剩余的毫秒数
	var minutes=Math.floor(leave2/(60*1000));
	
	//计算相差秒数
	var leave3=leave2%(60*1000);      //计算分钟数后剩余的毫秒数
	var seconds=Math.round(leave3/1000);
	callback(+hours+"小时"+minutes+"分"+seconds+"秒")
	if(hours<0 && minutes<0 && seconds<0){
		callback("0小时0分0秒")
	}else{
		callback(+hours+"小时"+minutes+"分"+seconds+"秒")
	}
}

function loginIM(id, token){
    delCookie('uid');
    delCookie('sdktoken');
    setCookie('uid', id);
    setCookie('sdktoken', token);
    store.set(system_config.portal_logon_user_imuid, id);
    store.set(system_config.portal_im_access_token, token);
}

function readCookie(name) {
    var arr = null;
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
    if (document.cookie && (arr = document.cookie.match(reg))) {
        return unescape(arr[2])
    } else {
        return null;
    }
}

function setCookie(name, value) {
    var days = 1;
    var exp = new Date();
    exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString();
}

function delCookie(name) {
    var cval = this.readCookie(name);
    if (cval != null) {
        document.cookie = name + '=' + cval + ';expires=' + (new Date(0)).toGMTString();
    }
}

function sendIMCustom(session, obj, tempwindow) {
    doPortalTokenCheck(function(jsonData){
        if(jsonData.resultCode != "200"){
            tempwindow.close()
            newPopupMfooter("OKODM提示","请先登录!","","确定","notBtn");
            setTimeout(function() {
                // window.location.href = "login.html"
            }, 2000);
        }else{
            var content = {
                title: 'OKODM',
                describe: 'OKODM-详情',
                image_url: 'http://public-okodm.oss-cn-shenzhen.aliyuncs.com/images/logo.png',
                link_url: window.location.href,
            }
            content = $.extend(content, obj)
            if(!session){
                postJsonWithPortalHeaderToken(api_config.third_im_find_service, {}, function(jsonData){
                    if(jsonData.resultCode =='200'){
                        session = 'p2p-' + jsonData.id.split("-").join("")
                        tempwindow.location="/im.html#/pc/chat/" + session + "?" + jQuery.param(content)
                    }
                    else {
                        console.error('获取在线客服接口异常：', api_config.third_im_find_service, jsonData)
                        tempwindow.location="/im.html#/pc"
                    }
                })
            }else{
                tempwindow.location="/im.html#/pc/chat/" + session + "?" + jQuery.param(content); // 后更改页面地址   
            }
        }
    })
}
function enlargeFontSizeCorrect(){
    if (typeof WeixinJSBridge == "object" && typeof WeixinJSBridge.invoke == "function") {
            handleFontSize();
    } else {
            if (document.addEventListener) {
                    document.addEventListener("WeixinJSBridgeReady", handleFontSize, false);
            } else if (document.attachEvent) {
                    document.attachEvent("WeixinJSBridgeReady", handleFontSize);
                    document.attachEvent("onWeixinJSBridgeReady", handleFontSize);  }
    }
    function handleFontSize() {
            // 设置网页字体为默认大小
            WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 17 });
            // 重写设置网页字体大小的事件
            WeixinJSBridge.on('menu:setfont', function() {
                    WeixinJSBridge.invoke('setFontSizeCallback', { 'fontSize' : 17 });
            });
    }
}
