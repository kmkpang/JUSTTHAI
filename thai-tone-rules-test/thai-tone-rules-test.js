var currentToneTest = null;
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

function renderWords() {
    var words = '<div class="words">' + currentToneTest.words + '</div>'
    var render = [];
    render.push(words);
    $('#word').append(render);
}

function init() {
    var cookieToneTest = getCookie('currentToneTest');

    if(cookieToneTest === '' || cookieToneTest === null) {
        $.ajax({
            type: "GET",
            url: "https://just-thai.000webhostapp.com/api/getThaiToneWords.php",
            data: { id: user_id , game_id: 2 }
        }).complete(function(res) {
            var word = '';
            words = JSON.parse(res);
            if(words.length > 0){
                word = words[Math.floor(Math.random() * words.length)];
                if (word) {
                    var name = 'currentToneTest';
                    document.cookie = name + "=" + (JSON.stringify(word) || "") + ";" + "path=/";
                    currentToneTest = word;
                    renderWords();
                }
            } else {
                $('#modalSorry').modal('show');
            }
        });
    } else {
        currentToneTest = JSON.parse(cookieToneTest);
        renderWords();
    }

    $.ajax({
        type: "GET",
        url: "https://just-thai.000webhostapp.com/api/getStatus.php",
        data: { id: user_id, game_id: 2 }
    }).complete(function(res) {
        var status = '';
        status = JSON.parse(res);
        var score = document.querySelector(".score");
        score.innerHTML = 'SCORE : ' + status.length;
    });
}

jQuery(document).ready(function ($) {
    "use strict";

    var user = getCookie('user');
    if (!user) {
        window.document.location.href = '/just-thai';
    } else {
        init();
    }

    $('.marks').on('click', function () {
        if($(this).hasClass('select')) {
            $(this).removeClass('select');
        } else {
            $('.marks').removeClass('select');
            $(this).addClass('select');
        }
        var answer = $(this).children()[0].innerHTML;
        $('#marks').val(answer);
    });

    $('.consonant').on('click', function () {
        if($(this).hasClass('select')) {
            $(this).removeClass('select');
        } else {
            $('.consonant').removeClass('select');
            $(this).addClass('select');
        }
        var answer = $(this).children()[0].innerHTML;
        $('#consonant').val(answer);
    });

    $('.syllable').on('click', function () {
        if($(this).hasClass('select')) {
            $(this).removeClass('select');
        } else {
            $('.syllable').removeClass('select');
            $(this).addClass('select');
        }
        var answer = $(this).children()[0].innerHTML;
        $('#syllable').val(answer);
    });

    $('.vowel-length').on('click', function () {
        if($(this).hasClass('select')) {
            $(this).removeClass('select');
        } else {
            $('.vowel-length').removeClass('select');
            $(this).addClass('select');
        }
        var answer = $(this).children()[0].innerHTML;
        $('#vowel-length').val(answer);
    });

    $('.tones').on('click', function () {
        if($(this).hasClass('select')) {
            $(this).removeClass('select');
        } else {
            $('.tones').removeClass('select');
            $(this).addClass('select');
        }
        var answer = $(this).children()[0].innerHTML;
        $('#tones').val(answer);
    });

    $('#submit').on('click', function () {
        var marks = $('#marks').val();
        var consonant = $('#consonant').val()
        var syllable = $('#syllable').val()
        var vowel = $('#vowel-length').val()
        var tones = $('#tones').val()
        var check = false;
        var words_id = currentToneTest.id;

        if(currentToneTest.tone_marks !== null) {
            check = currentToneTest.tone_marks === marks
        }
        if(currentToneTest.consonant_class !== null) {
            check = currentToneTest.consonant_class === consonant
        }
        if(currentToneTest.syllable !== null) {
            check = currentToneTest.syllable === syllable
        }
        if(currentToneTest.tones !== null) {
            check = currentToneTest.tones === tones
        }
        if(currentToneTest.vowel_length !== null) {
            check = currentToneTest.vowel_length === vowel
        }
        if(check === true) {
            $('#modalCongratulations').modal('show');
            $.ajax({
                type: "POST",
                url: "https://just-thai.000webhostapp.com/api/saveStatus.php",
                data: { words_id: words_id, user_id : user_id , game_id: 2 }
            }).complete(function() {
                var name = 'currentToneTest';
                var value = '';
                var expires  = "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
                document.cookie = name + "=" + (value || "")  + expires + "; path=/";
                document.cookie = name + "=" + (value || "")  + expires + "; path=/just-thai";
                $('#word').empty();
                $('.marks').removeClass('select');
                $('.consonant').removeClass('select');
                $('.syllable').removeClass('select');
                $('.vowel-length').removeClass('select');
                $('.tones').removeClass('select');        
                init();
            });
        } else {
            $('#modalWrong').modal('show');
        }

    });

    $('.btn-next').on('click', function () {
        $('#modalCongratulations').modal('hide');
    });

    $('.btn-try').on('click', function () {
        $('#modalWrong').modal('hide');
    });

    $('.btn-skip').on('click', function () {
        var name = 'currentToneTest';
        var value = '';
        var expires  = "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        document.cookie = name + "=" + (value || "")  + expires + "; path=/";
        document.cookie = name + "=" + (value || "")  + expires + "; path=/just-thai";
        $('#word').empty();
        $('#modalWrong').modal('hide');
        init();
    });

    $('.btn-reset').on('click', function() {
        $.ajax({
            type: "POST",
            url: "https://just-thai.000webhostapp.com/api/saveResetStatus.php",
            data: { user_id: user_id, game_id: 2 }
        }).complete(function() {
            $('#modalSorry').modal('hide');
            var name = 'currentToneTest';
            var value = '';
            var expires  = "; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
            document.cookie = name + "=" + (value || "")  + expires + "; path=/";
            document.cookie = name + "=" + (value || "")  + expires + "; path=/just-thai";
            $('#word').empty();
            init();
        });
    })
})