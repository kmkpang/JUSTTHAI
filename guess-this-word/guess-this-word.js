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
    $('#play').removeAttr('disabled');
    $('.pad img').css({"border":"none", 'transform':'scale(1)','background' : '#fff'});
    var count = document.querySelector(".count-play");
    count.innerHTML = '';
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

function checkAnswer(newInput) {
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
            $('#thai-answer').val('');
            init();
        });
    } else {
        var regex = new RegExp('['+word+']', 'g');
        var found = newInput.match(regex);
        var text = document.getElementsByClassName("text");
        for(var i = 0; i <= text.length; i++) {
            var textInner = text[i].innerHTML;
            var img = $(text[i]).parent().find('img')
            var textInput = newInput.split('');
            if(found.includes(textInner) === true) {
                $(img).css({"border":"4px solid #8BC34A", 'transform':'scale(1.2)','background' : '#e6fff2'});
            } else if(textInput.includes(textInner) === true) {
                $(img).css({"border":"4px solid #ff3568", 'transform':'scale(1.2)','background' : '##ffe8ee'});
            }
        }
    }
}

$(document).ready(function ($) {

    var click = 3;

    window.addEventListener('resize', windowResize);
    window.addEventListener('hover', $(document).on("mouseover", ".tooltip", function(e){
        if(!$(this).data('tooltip')){
            $(this).tooltip({
                content: function() {
                    return $(this).attr('title');
                },
                position: { my: "left+15 center", at: "right center" }
            }).triggerHandler('mouseover');
        }
    }));

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
                checkAnswer(newInput);
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
                checkAnswer(input);
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
        click = 3;
    });

    $('#next').on('click', function () {
        var name = 'currentWord';
        var value = '';
        var expires  = "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        document.cookie = name + "=" + (value || "")  + expires + "; path=/just-thai";
        $('#word').empty();
        $('#thai-answer').val('');
        init();
        click = 3;
    });

    $('#play').on('click',function() {
        var thai = currentWord.thai;
        responsiveVoice.speak(thai, "Thai Female",{onend: function(){
            click--;
            var count = document.querySelector(".count-play");
            count.innerHTML = click + ' time left!!';
            if(click < 1) {
                $('#play').attr('disabled','disabled');
            }
        }});
        $('.tooltip').removeClass('show');
    });

    windowResize();
});