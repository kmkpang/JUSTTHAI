var currentWord = null;
var status = '';
var words = [];
var user_id = getCookie('id');

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

function deleteCookie( name ) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function renderWords() {
    var tran = '<div class="tran">' + currentWord.transliteration + '</div>'
    var eng = '<div class="eng">' + currentWord.english + '</div>'
    var render = [];
    render.push(tran, eng);
    $('#word').append(render);
    renderMaxLengthInput();
}

function renderMaxLengthInput() {
    var word = currentWord.thai;
    var wordcount = word.trim().length;
    $('#ithai-answer').attr('maxlength', wordcount);
}

function init() {
    var cookieWord = getCookie('currentWord');

    if(cookieWord === '' || cookieWord === null) {
        $.ajax({
            type: "GET",
            url: "https://justthai.000webhostapp.com/api/getWords.php",
            data: { id: user_id }
        }).complete(function(res) {
            var word = '';
            words = JSON.parse(res);
            word = words[Math.floor(Math.random() * words.length)];
            if (word) {
                var name = 'currentWord';
                document.cookie = name + "=" + (JSON.stringify(word) || "") + ";" + "path=/";
                currentWord = word;
                renderWords();
            }
        });
    } else {
        currentWord = JSON.parse(cookieWord);
        renderWords();
    }

    $.ajax({
        type: "GET",
        url: "https://justthai.000webhostapp.com/api/getStatus.php",
        data: { id: user_id }
    }).complete(function(res) {
        var status = '';
        status = JSON.parse(res);
        var score = document.querySelector(".score");
        score.innerHTML = 'SCORE : ' + status.length;
    });
}

function windowResize() {
    var width = $(window).width();
    if(width > 768) {
        $('#letters-holder').removeClass('close').addClass('open');
    } else {
        $('#letters-holder').removeClass('open').addClass('close');
    }
}

function checkAnswer(newInput){
    var word = currentWord.thai;
    if (newInput === word) {
        var words_id = currentWord.id;
        $('#modalCongratulations').modal('show');
        $.ajax({
            type: "POST",
            url: "https://justthai.000webhostapp.com/api/saveStatus.php",
            data: { words_id: words_id, user_id : user_id }
        }).complete(function() {
            var expires = "";
            var date = new Date();
            var name = 'currentWord';
            var value = null;
            date.setTime(date.getTime() - (24*60*60*350));
            expires = "; expires=" + date.toUTCString();
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
            $('#word').empty();
            init();
        });
    }
}

$(document).ready(function ($) {

    window.addEventListener('resize', windowResize);

    var user = getCookie('user');
    if (!user) {
        window.document.location.href = '/just-thai';
    } else {
        init();
    }

    $('.pad').on('click', function () {
        var char = $(this).children()[0].innerHTML;
        var input = $('#thai-answer').val();
        if(input.length >= 0){
            newInput = input + char;
            var word = currentWord.thai;
            var wordCount = word.trim().length;
            var inputCount = newInput.trim().length;
            if (inputCount <= wordCount) {
                $('#thai-answer').val(newInput);
                checkAnswer(newInput)
            }
        }
    });

    $('#thai-answer').on('input', function(e) {
        var input = $('#thai-answer').val();
        if(input.length >= 0){
            var word = currentWord.thai;
            var wordCount = word.trim().length;
            var inputCount = input.trim().length;
            if (inputCount <= wordCount) {
                checkAnswer(input)
            }
        }
    });

    $('#delete').on('click', function () {
        var input = $('#thai-answer').val();
        var values = $.trim(input).slice(0, -1)
        $('#thai-answer').val(values);
    });

    $('#keybord').on('click', function () {
        var lettersClass = $('#letters-holder').attr('class');
        if(lettersClass === 'open'){
            $('#letters-holder').removeClass('open').addClass('close');
        } else {
            $('#letters-holder').removeClass('close').addClass('open');
        }
    });

    $('.btn-next').on('click', function () {
        $('#modalCongratulations').modal('hide');
    });

    $('#next').on('click', function () {
        var name = 'currentWord';
        var value = '';
        var expires  = "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        $('#word').empty();
        init();
    });

    windowResize();
});