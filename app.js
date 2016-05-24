var profile = null;
var gamelist = null;
//var sock = new MySocket(); //check this later.
//console.log(sock);



// navbar event listeners
$('#home').on('click', function () {
    var element = $('.active');
    element.removeClass('active');
    $('#home').addClass('active');
    hideAndShow("#" + element.attr('id') + "page", '#homepage');
});
$('#profile').on('click', function () {
    if (profile == null) {
        profile = new Profile();
    }
    var element = $('.active');
    element.removeClass('active');
    $('#profile').addClass('active');
    hideAndShow("#" + element.attr('id') + "page", '#profilepage');
});
$('#mygames').on('click', function () {
    if (gamelist == null) {
        gamelist = new GameList();
    } else {
        gamelist.getGames();
    }
    var element = $('.active');
    element.removeClass('active');
    $('#mygames').addClass('active');
    hideAndShow("#" + element.attr('id') + "page", '#mygamespage');
});
$('#todo').on('click', function () {
    var element = $('.active');
    element.removeClass('active');
    $('#todo').addClass('active');
    hideAndShow("#" + element.attr('id') + "page", '#todopage');
});
$('.navbar-brand').on('click', function () {
    var element = $('.active');
    element.removeClass('active');
    $('#home').addClass('active');
    hideAndShow("#" + element.attr('id') + "page", '#homepage');
});

$body = $('body');
$(document).on({
    ajaxStart: function () {
        $body.addClass("loading");
    },
    ajaxStop: function () {
        $body.removeClass("loading");
    }
});

var hideAndShow = function (idToHide, idToShow) {

    if (idToHide == "#mygamespage" && $('#gamepage').is(":visible")) {
        $('#gamepage').hide(200, function (idToshow) {
            $(idToShow).show(200);
        });
    } else {
        $(idToHide).hide(200, function (idToshow) {
            $(idToShow).show(200);
        });
    }

}