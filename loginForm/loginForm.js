let db = openDatabase('justthai', '1.0', 'justthai', 2 * 1024 * 1024);

createTable();

function createTable() {
    db.transaction(function (tx) {
        tx.executeSql('CREATE TABLE IF NOT EXISTS WORDS (id, thai, english, transliteration)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS SCORES (id, user_id, scorce)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS STATUS (id, words_id, user_id)');
        tx.executeSql('CREATE TABLE IF NOT EXISTS USERS (id, username, password)');
    })
}

var getUsers = new $.getJSON("../assets/users.json");
getUsers.complete(() => {
    var data = getUsers.responseJSON;
    if (data.users.length > 0) {
        this.insertUsers(data.users);
    }
});

function insertUsers(users) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM USERS', [], function (tx, results) {
            var data = results.rows;
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    tx.executeSql("DELETE FROM USERS WHERE id=?", [data[i].id]);
                }
            }
            if (users.length > 0) {
                users.map((user, index) => {
                    tx.executeSql("INSERT INTO USERS(id, username, password) VALUES (?,?,?)", [index + 1, user.username, user.password]);
                })
            }
        }, null);
    })
}

var getWords = new $.getJSON("../assets/justthai.json");
getWords.complete(() => {
    var data = getWords.responseJSON;
    if (data.words.length > 0) {
        this.insertWords(data.words);
    }
});

function insertWords(words) {
    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM WORDS', [], function (tx, results) {
            if (results.rows.length === 0) {
                if (words.length > 0) {
                    words.map((word, index) => {
                        tx.executeSql("INSERT INTO WORDS(id, thai, english, transliteration) VALUES (?,?,?,?)", [index + 1, word.thai, word.english, word.transliteration]);
                    })
                }
            }
        }, null);
    })
}

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

jQuery(document).ready(function ($) {
    "use strict";

    $('#login').click(function () {
        let username = $('input#username').val();
        let password = $('input#password').val();

        db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM USERS', [], function (tx, results) {
                var data = results.rows;
                if (data.length > 0) {
                    for(var i = 0; i < data.length; i++){
                        let decryptUsername = CryptoJS.AES.decrypt(data[i].username, "username");
                        let decryptPassword= CryptoJS.AES.decrypt(data[i].password, "password");
                        let stringUsername = decryptUsername.toString(CryptoJS.enc.Utf8);
                        let stringPassword = decryptPassword.toString(CryptoJS.enc.Utf8);

                        if(stringUsername === username && stringPassword === password) {
                            var name = 'user';
                            var value = username;
                            var expires = "";
                            var date = new Date();
                            date.setTime(date.getTime() + (24*60*60*350));
                            expires = "; expires=" + date.toUTCString();
                            document.cookie = name + "=" + (value || "")  + expires + "; path=/";

                            var user = getCookie('user');
                            if (user === username) {
                                window.document.location.href = '../home';
                            }
                        }
                    }
                }
            }, null);
        })
    });
});