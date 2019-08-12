function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

jQuery(document).ready(function ($) {
    "use strict";

    var user = getCookie('user');
    if (!user) {
        window.document.location.href = '/just-thai';
    } else {
        var tabs = getCookie('tabs');
        if(tabs) {
            $('.nav-link').removeClass('active');
            $('.nav-link').eq(tabs).addClass('active');
            $('.tab-pane').removeClass('active');
            $('.tab-pane').removeClass('show');
            $('#tab-'+tabs).addClass('active');
            $('#tab-'+tabs).addClass('show');
        }
    }

    $('.nav-item').on('click', function () {
        var navLink = $(this).find('.nav-link');
        var index = $(navLink).attr('data-index');
        if(index === '5') {
            $('.board').css('width','90%');
        }
        var name = 'tabs';
        document.cookie = name + "=" + (index || "") + ";" + "path=/";
    })
})