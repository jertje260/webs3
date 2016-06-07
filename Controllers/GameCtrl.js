function GameCtrl(app, id) {
    var self = this;
    self.game;
    self.letters = "ABCDEFGHIJ".split("");
    self.app = app;
    self.shot;
    self.miss;
    self.hit;
    self.playlist = [];
    self.playno = 0;
    self.isPlaying = false;


    self.load = function () {
        self.game = new Game(id, null, null, null, self);
        self.game.loadMoreInfo(id);
        self.game.loadField();
    }

    self.bindEvents = function () {

        $('.clickable').on('click', function (event) {
            self.flipShip(event);
        });
        $('.field').on('click', function (event) {
            self.shoot(event);
        });
        $('#confirmShips').on('click', function (event) {
            self.game.sendShips();
        });
        self.shot = document.createElement('audio');
        self.miss = document.createElement('audio');
        self.hit = document.createElement('audio');
        self.shot.setAttribute('src', 'Resources/battleshot.mp3');
        self.miss.setAttribute('src', 'Resources/splash.mp3');
        self.hit.setAttribute('src', 'Resources/explosion.mp3');

    }

    self.playSounds = function () {
        self.isPlaying = true;
        self.playlist[self.playno].play();

        self.playlist[self.playno].onended = function () {
            if (self.playno + 1 === self.playlist.length) {
                self.playno++;
                self.isPlaying = false;
            } else {
                self.playno++;
                self.playSounds();
            }

        }
    }

    self.draw = function () {
        app.loadPage(app.pagelist["/webs3/?page=game&id="], function () {
            if (self.game.status == "setup" && !self.game.shipsPlaced) {
                self.drawShipsTable();
                self.dragndrop();
            } else if ($('#shipDisplay').is(":visible")) {
                $('#shipDisplay').hide();
            }
            self.drawMisc();
            self.drawShips();
            self.drawShots();
            self.bindEvents();
        });


    }

    self.drawMisc = function () {
        $('#enemyText')[0].innerHTML = "You are playing vs " + self.game.enemyName + ". It's " + ((self.game.yourTurn) ? "your" : "his/her") + " turn.";
    }

    self.drawShips = function () {
        for (var i = 0; i < self.game.placedShips.length; i++) {
            self.drawShip(self.game.placedShips[i]);
        }
    }

    self.drawShip = function (ship) {
        $('#' + ship.x + ship.y).append('<div>' + ship.name + '</div>');
        if (ship.x != null && ship.y != null) {
            if (!ship.isHorizontal) { //vertical
                for (var j = 0; j < ship.length; j++) {
                    var place = parseInt(ship.y) + j;
                    var query = "#" + ship.x + place;
                    document.querySelector(query).className += " ship";
                }
            } else { // horizontal
                for (var j = 0; j < ship.length; j++) {
                    var place = self.letters.indexOf(ship.x) + j;
                    var query = "#" + self.letters[place] + ship.y;
                    document.querySelector(query).className += " ship";
                }
            }
        }
    }

    self.shotUpdate = function (shot) {
        console.log(shot);
        console.log('shot at gamectrl');
        if (shot.gameId == self.game.id) {
            console.log(shot);
        }
    }

    self.drawShots = function () {
        self.visualizeAllShots();
    }

    self.drawShipsTable = function () {
        var ships = self.game.ships;
        $('#ships tbody').empty()
        for (var i = 0; i < ships.length; i++) {
            $('#ships tbody').append('<tr id="' + i + '"><td><div class="drag" id="s' + i + '" draggable="true">' + ships[i].name + '</div></td><td>' + ships[i].length + '</td><td class="clickable">' + ((ships[i].isHorizontal) ? "Horizontal" : "Vertical") + '</td>');
        }

    }

    self.flipShip = function (event) {
        var shipid = event.target.parentElement.id;
        if (self.doesShipFit(shipid, null, null, true)) {
            self.removeOutline(shipid);
            self.game.ships[shipid].flip();
            if (self.game.ships[shipid].x != null) {
                self.changeFields(self.game.ships[shipid], true, true);
            }
            self.drawOutline(shipid);
            event.target.innerHTML = ((self.game.ships[shipid].isHorizontal) ? "Horizontal" : "Vertical");

        } else {
            app.createPopup("Ship turning", "You cannot turn this ship here.");
        }
    }

    self.shoot = function (event) {
        if (self.game.yourTurn == true && self.game.status == "started") {
            self.shootAt(event.currentTarget.id);
        } else {
            if (self.game.status != "started") {
                if (self.game.isDone) {
                    var text;
                    if (self.game.youWon) {
                        text = "You are the Winner!!";
                    } else {
                        text = "You lost, you fool!";
                    }
                    //alert("The game is finished. " + text);
                    app.createPopup("Game Over", "The game is over." + text);
                } else {
                    app.createPopup("Game Status", "The game hasn't started yet, please wait untill the other player has placed their ships.");
                    //alert("The game hasn't started yet");
                }
            } else {
                app.createPopup("Turn", "It's not your turn, please wait untill the other player has done his turn.");
                //alert("It's not your turn!");
            }
        }
    }

    self.playSound = function (sound) {
        self.playlist.push(sound);
        if (!self.isPlaying) {
            self.playSounds();
        }
    }

    self.shootAt = function (elementid) {
        var e = self.searchField(elementid);
        if (!e.clicked) {
            var data = '{"x": "' + e.x.toLowerCase() + '", "y": ' + e.y + '}'
            var json = JSON.parse(data);
            self.playSound(self.shot);
            //console.log(json);
            $.ajax({
                url: url + "/games/" + self.game.id + "/shots" + token,
                data: json,
                method: "POST",
                success: function (result) {
                    if (result == "BOOM" || result == "SPLASH") {
                        e.click();
                        if (result == "BOOM") {
                            json["isHit"] = true;
                            self.playSound(self.hit);
                        } else {
                            self.playSound(self.miss);
                        }
                        self.game.shots.push(json);
                        self.visualizeShot(json);
                        //alert("You shot at " + e.x + (e.y));
                        self.game.loadMoreInfo(self.game.id);
                        app.createPopup("Shot", "You shot at " + e.x + (e.y) + " and it " + (result == "BOOM" ? "hit." : "missed."));
                    } else if (result == "FAIL") { // shouldn't happen.
                        app.createPopup("Shot", "You already shot at " + e.x + (e.y) + ". Sadly this message comes from the server, you have to wait untill your next turn.");
                        //alert("You already shot at " + e.x + (e.y) + ". Try another field");
                    } else if (result == "WINNER") {
                        app.createPopup("Game Over", "You won the game! Congratulations!");
                        //alert("You won the game!");
                    }
                    //self.game.loadMoreInfo(self.game.id);
                }

            });

        } else {
            app.createPopup("Shot", "You already shot at " + e.x + (e.y) + ". Try another field.");
            //alert("You already shot at " + e.x + (e.y) + ". Try another field");
        }
    }

    self.visualizeShot = function (shot, enemy) {
        var field = $('#' + shot.x.toUpperCase() + shot.y);
        if (!enemy) {
            field.addClass('clicked');
            if (shot.isHit) {
                field.addClass('boom');
            }
        } else {
            field.addClass('Eshot');
            if (shot.isHit) {
                field.addClass('hit');
            }
        }
    }

    self.visualizeAllShots = function () {
        for (var i = 0; i < self.game.shots.length; i++) {
            self.visualizeShot(self.game.shots[i], false);
        }
        for (var i = 0; i < self.game.enemyShots.length; i++) {
            self.visualizeShot(self.game.enemyShots[i], true);
        }
    }

    self.searchField = function (input) {
        var si = input.split('');
        if (si.length > 2) {
            si[1] += si[2];
        }
        return self.game.fields[si[0]][si[1] - 1];
    }

    //drag and drop functions
    self.dragndrop = function () {
        $('.field').each(function () {
            $(this).addClass('drop');
        });
        var drag = document.querySelectorAll(".drag");
        var drop = document.querySelectorAll(".drop");


        for (var i = 0; i < drop.length; i++) {
            drop[i].addEventListener('drop', function (event) {
                event.preventDefault();

                var data = event.dataTransfer.getData("dragged-id");
                var shipnumber = data.split('')[1];
                var id = event.target.id.split('');
                if (id.length > 2) {
                    id[1] += id[2];
                }
                //console.log(shipnumber);
                // test if ship can fit here
                self.putShipOnField(shipnumber, false);
                if (self.doesShipFit(shipnumber, id[0], id[1])) {

                    self.dropConfirmed = true;
                    var element = document.getElementById(data);
                    element.className += " placed";
                    event.target.appendChild(element);


                    self.game.addShip(self.game.ships[shipnumber], id[0], id[1]);

                    //console.log('Placing ship in ' + id[0] + (id[1]));

                    // setting outline for ship
                    self.drawOutline(shipnumber);
                } else {
                    self.putShipOnField(shipnumber, true);
                    app.createPopup("Ship placement", "This ship cannot be placed here, please try again.");
                    //alert("You cant place this ship here!");
                }
            });
            drop[i].addEventListener('dragover', function (event) {
                event.preventDefault();


            });
        }

        for (i = 0; i < drag.length; i++) {
            drag[i].addEventListener('dragstart', function (event) {
                self.dropConfirmed = false;
                //console.log(event.target);
                event.dataTransfer.setData("dragged-id", event.target.id);
                //event.dataTransfer.setData("")
                $(event.target.id).removeClass("placed");
                self.removeOutline(event.target.id.substring(1));

            })
            drag[i].addEventListener('dragend', function (event) {
                if (!self.dropConfirmed) {
                    self.drawOutline(event.target.id.substring(1));
                }
            });
        }
    }

    self.changeFields = function (ship, gotShip, flipping) {
        //console.log(gotShip);
        var index = self.letters.indexOf(ship.x);
        if (ship.isHorizontal) {
            for (i = 0; i < ship.length; i++) {
                if (flipping) {
                    self.game.fields[ship.x][parseInt(ship.y) + i - 1].hasShip = !gotShip;
                }
                self.game.fields[self.letters[index + i]][ship.y - 1].hasShip = gotShip;
            }
        } else {
            for (i = 0; i < ship.length; i++) {
                if (flipping) {
                    self.game.fields[self.letters[index + i]][ship.y - 1].hasShip = !gotShip;
                }
                self.game.fields[ship.x][parseInt(ship.y) + i - 1].hasShip = gotShip;
            }
        }
    }

    self.putShipOnField = function (shipid, placed) {
        var ship = self.game.ships[shipid];
        if (ship.x) {
            var index = self.letters.indexOf(ship.x);
            for (var i = 0; i < ship.length; i++){
                if (ship.isHorizontal) {
                    self.game.fields[self.letters[index + i]][parseInt(ship.y) - 1].hasShip = placed;
                } else {
                    self.game.fields[ship.x][parseInt(ship.y) + i - 1].hasShip = placed;
                }
            }
        }
    }


    self.doesShipFit = function (shipnumber, x, y, flipping) {
        var ship = self.game.ships[shipnumber];
        
        var hor = ship.isHorizontal;
        
        if (x == null) {
            x = ship.x;
        }
        if (y == null) {
            y = ship.y;
        }
        if (x == null && y == null) {
            return true;
        }
        if (flipping) {
            hor = !hor;
        }
        if (hor) {
            var index = self.letters.indexOf(x);
            var i = 0;
            if (flipping) {
                i = 1;
            }
            for (i; i < ship.length; i++) {
                if ((index + i) > 9 || self.game.fields[self.letters[index + i]][parseInt(y) - 1].hasShip) {
                    return false;
                }
            }
        } else {
            var i = 0;
            if (flipping) {
                i = 1;
            }
            for (i; i < ship.length; i++) {
                if ((parseInt(y) + i) > 10 || self.game.fields[x][parseInt(y) + i - 1].hasShip) {
                    return false;
                }
            }
        }
        return true;
    }
    self.drawOutline = function (shipnumber) {

        var ship = self.game.ships[shipnumber];
        if (ship.x != null && ship.y != null) {
            if (!ship.isHorizontal) { //vertical
                for (j = 0; j < ship.length; j++) {
                    var place = parseInt(ship.y) + j;
                    var query = "#" + ship.x + place;
                    document.querySelector(query).className += " ship";
                }
            } else { // horizontal
                for (j = 0; j < ship.length; j++) {
                    var place = self.letters.indexOf(ship.x) + j;
                    var query = "#" + self.letters[place] + ship.y;
                    document.querySelector(query).className += " ship";
                }
            }
        }
    }

    self.removeOutline = function (shipnumber) {
        var ship = self.game.ships[shipnumber];
        if (ship.x != null && ship.y != null) {
            if (!ship.isHorizontal) { //vertical
                for (j = 0; j < ship.length; j++) {
                    var place = parseInt(ship.y) + j;
                    var query = "#" + ship.x + place;
                    var element = document.querySelector(query);
                    element.className = element.className.replace(" ship", '');
                }
            } else { // horizontal
                for (j = 0; j < ship.length; j++) {
                    var place = self.letters.indexOf(ship.x);
                    var query = "#" + self.letters[place + j] + ship.y;
                    var element = document.querySelector(query);
                    element.className = element.className.replace(" ship", '');
                }
            }
        }
    }


}