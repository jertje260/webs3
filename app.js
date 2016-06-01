var profile = null;
var gamelist = null;
var currentGame = null;
var poller;
//var sock = new MySocket(); //check this later.
//console.log(sock);
var pagelist = {};

pagelist["/webs3/"] = "#homepage";
pagelist["/webs3/?page=profile"] = "#profilepage";
pagelist["/webs3/?page=games"] = "#mygamespage";
pagelist["/webs3/?page=todo"] = "#todopage";
pagelist["/webs3/?page=game&id="] = "#gamepage";
//pagelist["/webs/"] = "homepage";

// navbar event listeners


// $('#home').on('click', function () {
//     var element = $('.active');
//     element.removeClass('active');
//     $('#home').addClass('active');
//     hideAndShow("#" + element.attr('id') + "page", '#homepage');
// });
// $('#profile').on('click', function () {
//     if (profile == null) {
//         profile = new Profile();
//     }
//     // var element = $('.active');
//     // element.removeClass('active');
//     // $('#profile').addClass('active');
//     hideAndShow("#" + element.attr('id') + "page", '#profilepage');
// });
// $('#mygames').on('click', function () {
//     if (gamelist == null) {
//         gamelist = new GameList();
//     } else {
//         gamelist.getGames();
//     }
//     // var element = $('.active');
//     // element.removeClass('active');
//     // $('#mygames').addClass('active');
//     hideAndShow("#" + element.attr('id') + "page", '#mygamespage');
// });
// $('#todo').on('click', function () {
//     // var element = $('.active');
//     // element.removeClass('active');
//     // $('#todo').addClass('active');
//     hideAndShow("#" + element.attr('id') + "page", '#todopage');
// });
// $('.navbar-brand').on('click', function () {
//     // var element = $('.active');
//     // element.removeClass('active');
//     // $('#home').addClass('active');
//     hideAndShow("#" + element.attr('id') + "page", '#homepage');
// });

$body = $('body');
$(document).on({
    ajaxStart: function () {
        $body.addClass("loading");
    },
    ajaxStop: function () {
        $body.removeClass("loading");
    }
});

$(document).ready(function () {
    loadContent("/webs3/" + window.location.search);
});

// var hideAndShow = function (idToShow) {

//     if (idToHide == "#mygamespage" && $('#gamepage').is(":visible")) {
//         $('#gamepage').hide(200, function (idToshow) {
//             $(idToShow).show(200);
//         });
//     } else {
//         $(idToHide).hide(200, function (idToshow) {
//             $(idToShow).show(200);
//         });
//     }

// }
$(function () {
    $('nav a').click(function (e) {
        href = $(this).attr("href");
        loadContent(href);

        // HISTORY.PUSHSTATE
        history.pushState({ "URL": "/webs3/", "toLoad": href, }, 'New URL: ' + href, href);
        e.preventDefault();


    });

    // THIS EVENT MAKES SURE THAT THE BACK/FORWARD BUTTONS WORK AS WELL
    window.onpopstate = function (event) {
        console.log(event);
        console.log("pathname: " + location.pathname);
        loadContent(location.pathname);
    };

});

var loadContent = function (url) {
    clearTimeout(poller);
    if (pagelist[url] == "#profilepage") {
        if (profile == null) {
            profile = new Profile();
        }
    } else if (pagelist[url] == "#mygamespage") {
        if (gamelist == null) {
            gamelist = new GameList();
        } else {
            gamelist.getGames();
        }
    } else if (url.startsWith("/webs3/?page=game&id")) {
        var gameid = url.split("/webs3/?page=game&id=")[1];
        currentGame = new Game();
        currentGame.loadMoreInfo(gameid);
        url = "/webs3/?page=game&id=";
    }
    $('.showme').addClass('hideme');
    $('.showme').removeClass('showme');

    $(pagelist[url]).removeClass('hideme');
    $(pagelist[url]).addClass('showme');

    // THESE TWO LINES JUST MAKE SURE THAT THE NAV BAR REFLECTS THE CURRENT URL
    if (!url.startsWith("/webs3/?page=game&id")) {
        $('li').removeClass('active');
        $('a[href="' + url + '"]').parent().addClass('active');
    }

}



