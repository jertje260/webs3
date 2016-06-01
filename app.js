var profile = null;
var gamelist = null;
//var sock = new MySocket(); //check this later.
//console.log(sock);
var pagelist = {};

pagelist["/webs3/"] = "#homepage";
pagelist["/webs3/profile"] = "#profilepage";
pagelist["/webs3/games"] = "#mygamespage";
pagelist["/webs3/todo"] = "#todopage";
pagelist["/webs3/game/"] = "#gamepage";
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
        history.pushState('', 'New URL: ' + href, href);
        e.preventDefault();


    });

    // THIS EVENT MAKES SURE THAT THE BACK/FORWARD BUTTONS WORK AS WELL
    window.onpopstate = function (event) {
        console.log("pathname: " + location.pathname);
        loadContent(location.pathname);
    };

});

var loadContent = function(url){
            if(pagelist[url] == "#profilepage"){
                if (profile == null) {
                    profile = new Profile();
                }
            } else if (pagelist[url] == "#mygamespage"){
                if (gamelist == null) {
                    gamelist = new GameList();
                } else {
                    gamelist.getGames();
                }
            } else if(url.startsWith("/webs3/game/")){
                console.log(url.split("/webs3/game/")[0]);
            }
            
            
            console.log(pagelist[url]);
            $('.showme').addClass('hideme');
            $('.showme').removeClass('showme');
            $(pagelist[url]).removeClass('hideme');
            $(pagelist[url]).addClass('showme');
			
			// THESE TWO LINES JUST MAKE SURE THAT THE NAV BAR REFLECTS THE CURRENT URL
			$('li').removeClass('active');
			$('a[href="'+url+'"]').parent().addClass('active');
			
		}

