function getCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function login() {
    let username = $('input#username').val();
    let password = $('input#password').val();

    $.ajax({
        url: "https://justthai.000webhostapp.com/api/getUsers.php"
    }).complete(function(res) {
        var users = [];
        if(res){
            users = JSON.parse(res);
            users.map((user) => {
                let decryptUsername = CryptoJS.AES.decrypt(user.username, "username");
                let decryptPassword= CryptoJS.AES.decrypt(user.password, "password");
                let stringUsername = decryptUsername.toString(CryptoJS.enc.Utf8);
                let stringPassword = decryptPassword.toString(CryptoJS.enc.Utf8);

                if(stringUsername === username && stringPassword === password) {
                    var name = 'user';
                    var value = username;
                    var name1 = 'id';
                    var value1 = user.id;
                    var expires = "";
                    var date = new Date();
                    date.setTime(date.getTime() + (24*60*60*350));
                    expires = "; expires=" + date.toUTCString();
                    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
                    document.cookie = name1 + "=" + (value1 || "")  + expires + "; path=/";

                    var user = getCookie('user');
                    if (user === username) {
                        window.document.location.href = '/just-thai/home';
                    }
                }
            })
        }
    });
}

jQuery(document).ready(function ($) {
    "use strict";

    var cookies = document.cookie.split(";");
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var split = cookie.split('=');
        var name = split[0];
        var value = '';
        var expires  = "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        document.cookie = name + "=" + (value || "")  + expires + "; path=/just-thai";
    }

    $('.loginForm').on("submit", function(){
        login();
        return false;
    })
});