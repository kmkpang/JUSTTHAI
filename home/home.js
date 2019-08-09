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
        $('body').removeClass('sidebar-is-reduced');
        $('body').addClass('sidebar-is-expanded');
        $('.hamburger-toggle').addClass('is-opened');
    }
})
