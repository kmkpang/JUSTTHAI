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

function newGame() {
    tid = nextWord[0];
    phonetic = nextWord[1];
    english = nextWord[2].split('<br>').join(', ');
    r = '<td tid="' + tid + '">';
    $('#word').html(nextWord[3]).find('path').each(function (i) {
        if (!(i % 2)) r += '&#' + $(this).data('uc') + ';';
    });
    r += '&rarr; ' + phonetic + ' = ' + english + '</td>';
    nextWord = null;
    getData(); // prefetch

    $('.hints p').empty();
    $('.hints .btn').removeClass('disabled');

    var keypad = document.createDocumentFragment();
    for (var i = 3585; i <= 3641; i++)
        if (i == 3635) makeLetter(keypad, 3661); // replace sara am with NIKHAHIT
        else if (i != 3631) makeLetter(keypad, i);
    for (var i = 3648; i <= 3659; i++)
        if (i != 3653 && i != 3654) makeLetter(keypad, i);

    badGuesses = 0;
    $('#content h3').show();
    // create an alphabet pad to select letters
    letters.innerHTML = '';
    letters.appendChild(keypad);
    drawCanvases();
    $('#game-loading').empty().hide();
    $('#auto-hint .on').each(function () {
        var $this = $(this);
        if ($this.hasClass('eng')) showEnglish();
        else if ($this.hasClass('phonetic')) showPhonetic();
        else if ($this.hasClass('ear')) td.playThai(tid);
    });
    $('#curtain').animate({
        width: 0
    }, 1000);
}

function drawCanvases() {
    drawCanvas(stamp, 0.55);
    drawCanvas(canvas, 1.6);
    if (badGuesses > 7) { // end game
        $('#curtain').animate({
            width: "100%"
        }, 1000);
        showMissing(200);
        score.postLoss();
        //   td.dlg('<img src="/pix/noose.gif"><h4>Sorry!</h4><i>The correct answer was</i><br>' + $('#word').html(), dlgLOpts);
        showMsg('<img src="/pix/noose.gif"><h4>Sorry!</h4><i>The correct answer was</i><br>' + $('#word').html(), $('#btnReplay'));
        tallyResult(0);
    }
}

function drawCanvas(can, scale) {
    var c = can.getContext('2d');

    function drawLine(from, to) {
        c.beginPath();
        c.moveTo(from[0], from[1]);
        c.lineTo(to[0], to[1]);
        c.stroke();
    }
    var ghost = '#ddd';
    var p2 = '#530B79';
    can.width = can.width; // reset the canvas
    c.scale(scale, scale);

    c.lineWidth = 3;
    c.strokeStyle = (badGuesses > 7) ? p2 : ghost;
    drawLine([125, 130], [140, 170]); // draw right leg
    c.strokeStyle = (badGuesses > 6) ? p2 : ghost;
    drawLine([125, 130], [110, 170]); // left leg
    c.strokeStyle = (badGuesses > 5) ? p2 : ghost;
    drawLine([125, 80], [160, 90]); // draw right arm
    c.strokeStyle = (badGuesses > 4) ? p2 : ghost;
    drawLine([125, 80], [90, 90]); // draw left arm
    c.strokeStyle = (badGuesses > 3) ? p2 : ghost;
    drawLine([125, 60], [125, 130]); // draw body
    c.strokeStyle = (badGuesses > 2) ? p2 : ghost;
    drawLine([125, 15], [125, 30]); // draw rope
    // draw head
    c.beginPath();
    c.moveTo(140, 45);
    c.arc(125, 45, 15, 0, (Math.PI / 180) * 360);
    c.stroke();

    c.lineWidth = 10;
    c.strokeStyle = (badGuesses > 1) ? '#A460D8' : ghost;
    drawLine([5, 10], [130, 10]); // create the arm of the gallows
    c.strokeStyle = (badGuesses > 0) ? '#A460D8' : ghost;
    drawLine([10, 185], [10, 5]); // #A52A2A create the upright

    c.strokeStyle = 'green';
    drawLine([0, 190], [160, 190]); // draw the ground

    if (badGuesses > 7) {
        // end game
        c.font = 'bold 24px Optimer, Arial, Helvetica, sans-serif';
        c.fillStyle = 'red';
        c.fillText('Game over', 25, 110);
    }
}

function makeLetter(frag, uc) {
    var div = document.createElement('div');
    div.style.cursor = 'pointer';
    div.innerHTML = '&#' + uc + ';';
    div.onclick = onClickLetter;
    frag.appendChild(div);
}

function onClickLetter() {
    this.style.cursor = 'default';
    this.style.background = '#fff';
    this.onclick = null;
    checkLetter(this.innerHTML);
    this.innerHTML = ' ';
}

function checkLetter(letter) {
    console.log(letter);
    // if (badGuesses > 7) return; // already lost
    // var code = letter.charCodeAt(0);
    // var $matches = $('[data-uc=' + code + ']');
    // if (!$matches.length) {
    //     badGuesses++;
    //     td.aud.play('g', 1);
    //     return drawCanvases();
    // }

    // td.aud.play('g', 2);
    // // show the color coded letter(s)
    // $matches.each(function () {
    //     $(this).css('fill', $(this).data('color'));
    // });
    // // remove filled in underscore(s)
    // $('[data-uc=-' + code + ']').css('fill', '#fff').remove();
    // // count remaining underscores
    // if (!$('.underscore').length) onWin();
}

let db = openDatabase('justthai', '1.0', 'justthai', 2 * 1024 * 1024);

$(document).ready(function ($) {

    var user = getCookie('user');
    if (!user) {
        window.document.location.href = '/';
    }

    // $('.keyboard-wrapper').css('display','block');

    db.transaction(function (tx) {
        tx.executeSql('SELECT * FROM WORDS', [], function (tx, results) {
            var data = results.rows;
        });
    })

    // var nextWord;
    // var score;

    // var canvas = document.getElementById('stage'),
    //     stamp = document.getElementById('stamp'),
    //     letters = document.getElementById('letters'),
    //     phonetic, english,
    //     tid = 43,
    //     badGuesses;
    // var font;
    // var r;
    // var tids = [];

    // var words = [];

    // var keypad = document.createDocumentFragment();
    // for (var i = 3585; i <= 3641; i++)
    //     if (i == 3635) makeLetter(keypad, 3661); // replace sara am with NIKHAHIT
    //     else if (i != 3631) makeLetter(keypad, i);
    // for (var i = 3648; i <= 3659; i++)
    //     if (i != 3653 && i != 3654) makeLetter(keypad, i);

    // letters.innerHTML = '';
    // letters.appendChild(keypad);

    // function showPhonetic() {
    //     if (!phonetic) return;
    //     $('.btn.phonetic').addClass('disabled');
    //     $('.hints p').prepend(phonetic + '&nbsp;');
    //     phonetic = null;
    // }

    // function showEnglish() {
    //     if (!english) return;
    //     $('.btn.eng').addClass('disabled');
    //     $('.hints p').append('=&nbsp;' + english);
    //     english = null;
    // }
});