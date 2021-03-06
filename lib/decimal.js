/*global clipboardData,jQuery,window,$,$doc */

/*!
 * decimal.js
 *
 * https://github.com/inspireso
 *
 * Copyright 2014 Inspireso and/or its affiliates.
 * Licensed under the Apache 2.0 License.
 *
 */

"use strict";
var $ = window.jQuery;

function onkeydown(e) {
    // Allow: backspace, delete, tab, escape, enter and .
    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
        // Allow: Ctrl+A
        (e.keyCode === 65 && e.ctrlKey === true) ||
        // Allow: home, end, left, right
        (e.keyCode >= 35 && e.keyCode <= 39)) {
        // let it happen, don't do anything
        return;
    }
    // Ensure that it is a number and stop the keypress
    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
        e.preventDefault();
    }
}


function onblur() {
    var $this = $(this);
    var scale = $this.attr('scale');
    this.value = format(this.value, scale);
}

function onpaste() {
    var text = clipboardData.getData('text');
    if (valid(text)) {
        clipboardData.setData('text', text);
    } else {
        return false;
    }
} // 禁止粘贴1.Float64Array();

function valid(txt) {
    var i = 0;
    var len = txt.length;
    for (i = 0; i < len; i++) {
        var checkTxt = txt.charCodeAt(i); // 使用charCodeAt方法，方法可返回指定位置的字符的
        // Unicode 编码。这个返回值是 0 - 65535
        // 之间的整数。
        if (checkTxt === 37 || checkTxt === 8 || checkTxt === 39 || checkTxt === 46 || checkTxt === 190 || checkTxt === 110 || (checkTxt >= 48 && checkTxt <= 57) || (checkTxt >= 96 && checkTxt <= 105)) {
            continue;
        } else {
            return false;
        }
    }
    return true;
}

function format(number, scale, roundHalfUp) {
    scale = scale > 0 && scale <= 20 ? scale : 2;
    var newString; // The new rounded number
    scale = Number(scale);
    if (scale < 1) {
        newString = (Math.round(number)).toString();

    } else {
        var numString = number.toString();
        var minusSign = '';
        if (numString.indexOf('-')) {
            minusSign = numString.substring(0, 1);
            numString = numString.substring(1, numString.length)
        }

        if (numString.lastIndexOf(".") === -1) { // If there is no decimal point
            numString += "."; // give it one at the end
        }
        var cutoff = numString.lastIndexOf(".") + scale; // The point at which to truncate the number
        var d1 = Number(numString.substring(cutoff, cutoff + 1)); // The value of the last decimal place that we'll end up with
        var d2 = Number(numString.substring(cutoff + 1, cutoff + 2)); // The next decimal, after the last one we want
        if (roundHalfUp && d2 >= 5) { // Do we need to round up at all? If not, the string will just be truncated
            if (d1 === 9 && cutoff > 0) { // If the last digit is 9, find a new cutoff point
                while (cutoff > 0 && (d1 === 9 || isNaN(d1))) {
                    if (d1 !== ".") {
                        cutoff -= 1;
                        d1 = Number(numString.substring(cutoff, cutoff + 1));
                    } else {
                        cutoff -= 1;
                    }
                }
            }
            d1 += 1;
        }
        if (d1 === 10) {
            numString = numString.substring(0, numString.lastIndexOf("."));
            var roundedNum = Number(numString) + 1;
            newString = roundedNum.toString() + '.';
        } else {
            newString = numString.substring(0, cutoff) + d1.toString();
        }
    }
    if (newString.lastIndexOf(".") === -1) { // Do this again, to the new string
        newString += ".";
    }
    var decs = (newString.substring(newString.lastIndexOf(".") + 1)).length;
    for (var i = 0; i < scale - decs; i++) {
        newString += "0";
    }
    return minusSign + newString;

}

function init(selector) {
    $(selector).each(function (index, el) {
        $(el).trigger('blur');
    });

}

var config = {
    selector: 'input[role*=decimal]',
    options: {

    }
}

function applyAll() {
    $doc.on('keydown', config.selector, onkeydown);
    $doc.on('blur', config.selector, onblur);
    $doc.on('paste', config.selector, onpaste);

    init(config.selector);
    $doc.ajaxSuccess(function (event, xhr, settings) {
        init(config.selector);
    });


}


module.exports = {
    config: config,
    init: init,
    applyAll: applyAll
};