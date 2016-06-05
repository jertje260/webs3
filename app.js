/*var profile = null;
var gamelist = null;
var currentGame = null;
var poller;
var sock = new MySocket(); //check this later.
console.log(sock);
var pagelist = {};
// pagelist["/webs3/"] = "home.html";
// pagelist["/webs3/?page=profile"] = "profile.html";
// pagelist["/webs3/?page=games"] = "gamelist.html";
// pagelist["/webs3/?page=todo"] = "todo.html";
// pagelist["/webs3/?page=game&id="] = "game.html";

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

$(document).on({
    ajaxStart: function () {
        $('#spinner').modal('show');
    },
    ajaxStop: function () {
        $('#spinner').modal('hide');
    }
});

$(document).ready(function () {
    loadContent(location.pathname + location.search);
    //history.pushState({ "URL": "/webs3/", "toLoad": "/webs3/" + window.location.search, }, 'New URL: ' + "/webs3/" + window.location.search, "/webs3/" + window.location.search);
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
        console.log(href);
        loadContent(href);

        // HISTORY.PUSHSTATE
        history.pushState({ "URL": href, "toLoad": href, }, 'New URL: ' + href, href);
        e.preventDefault();


    });

    // THIS EVENT MAKES SURE THAT THE BACK/FORWARD BUTTONS WORK AS WELL
    window.onpopstate = function (event) {
        //console.log(event);
        console.log("pathname: " + location.pathname + location.search);
        loadContent(location.pathname + location.search);
    };

});

var createPopup = function (title, message, callback) {
    //TODO do this later
    $('#closebutton').unbind();
    $('#myModalLabel')[0].innerHTML = title;
    $('.modal-body')[0].innerHTML = message;
    if(callback != undefined){
        $('#closebutton').on('click', function(){
            console.log("click fired");
            callback();
        });
    }
    $('#myModal').modal('show');
    
}

var loadContent = function (url) {
    clearTimeout(poller);
    console.log("loading content " + url);
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
    } else {
        $('li').removeClass('active');
        $('a[href="/webs3/?page=games"]').parent().addClass('active');
    }

}
*/

function ZeeslagApp() {
    var self = this;
    self.profile = null;
    self.pagelist = {};
    self.pagelist["/webs3/"] = "Templates\/home.html";
    self.pagelist["/webs3/?page=profile"] = "Templates\/profile.html";
    self.pagelist["/webs3/?page=games"] = "Templates\/gamelist.html";
    self.pagelist["/webs3/?page=todo"] = "Templates\/todo.html";
    self.pagelist["/webs3/?page=game&id="] = "Templates\/game.html";

    self.setCtrl = function (controller) {
        self.ctrl = controller;
        self.ctrl.load();
    }

    self.loadPage = function (url, callback) {
        $.get(url, function (html) {
            $('#view').empty().append(html);
            console.log("loading view");
            if (callback != undefined) {
                callback();
            }
        });
    }

    self.loadFromUrl = function () {

        if (location.search == "?page=games") {
            self.setCtrl(new GamelistCtrl(self));
        } else if (location.search.startsWith("?page=game&id=")) {
            var id = location.search.split('id=')[1];
            self.setCtrl(new GameCtrl(self, id));

        } else {
            self.setCtrl(new BaseCtrl(self));
        }
    }

    self.bindEvents = function () {
        $('nav a').click(function (e) {

            // HISTORY.PUSHSTATE
            history.pushState({ "URL": href, "toLoad": href, }, 'New URL: ' + href, href);
            self.loadFromUrl();
            e.preventDefault();


        });

        // THIS EVENT MAKES SURE THAT THE BACK/FORWARD BUTTONS WORK AS WELL
        window.onpopstate = function (event) {
            //console.log(event);
            console.log("pathname: " + location.pathname + location.search);
            self.loadFromUrl(self.pagelist[location.pathname + location.search]);
        };

    }
    
    self.createPopup = function (title, message, callback) {
    //TODO do this later
    $('#closebutton').unbind();
    $('#myModalLabel')[0].innerHTML = title;
    $('.modal-body')[0].innerHTML = message;
    if(callback != undefined){
        $('#closebutton').on('click', function(){
            console.log("click fired");
            callback();
        });
    }
    $('#myModal').modal('show');
    
}

    self.bindEvents();
    self.loadFromUrl();
}

var app = new ZeeslagApp();
