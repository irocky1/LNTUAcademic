var base64 = require("base64.min.js");

//时间戳转日期
function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();

    return [year, month, day].map(formatNumber).join('-')
}

//日期转时间戳 毫秒
function formatDataToTimestamp(data, systemInfo) {
    if (!isEmpty(systemInfo) && systemInfo.indexOf("iOS") > -1) {
        data = data.replace(/-/g, '/');
    }
    return Date.parse(new Date(data));
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}

function isStudentNoValid(studentNo) {
    return studentNo != null && studentNo !== '';
}

function isEmpty(data) {
    return data === undefined || data == null || data.length === 0;
}

function encodeAuthorization(studentNo, weChatOpenId) {
    return "Basic " + base64.encode(studentNo + ":" + weChatOpenId);
}

function getCharBinary(str) {
    var i = 0;
    var result = "";
    while (true) {
        var temp = str.charCodeAt(i++);
        if (temp) {
            result += temp.toString(2);
        } else {
            break;
        }
    }
    return result;
}

function getBinarySum(str) {
    var i = 0;
    var result = 0;
    while (true) {
        var num = Number(str.charCodeAt(i++));
        if (num) {
            result += num;
        } else {
            break;
        }
    }
    return result;
}

module.exports = {
    formatDate: formatDate,
    isStudentNoValid: isStudentNoValid,
    formatDataToTimestamp: formatDataToTimestamp,
    isEmpty: isEmpty,
    encodeAuthorization: encodeAuthorization,
    getCharBinary: getCharBinary,
    getBinarySum: getBinarySum
};
