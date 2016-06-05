function GameCtrl(app, id) {
    var self = this;
    self.game;

    self.load = function () {

        app.loadPage(app.pagelist["/webs3/" + location.search], function () {
            self.game = new Game(id, null, null, null, self);
            self.game.loadMoreInfo(id);
            self.bindEvents();
        });
    }

    self.bindEvents = function () {
        $('.clickable').on('click', function (event) {
            self.flipShip(event);
        });
        $('.field').on('click', function (event) {
            self.shoot(event);
        })


    }

    self.draw = function () {
        console.log("must draw everything here");
        if (self.game.status == setup && self.game.board.shipsPlaced) {
            self.drawShipsTable();
        } else if($('#shipDisplay').is(":visible")){
            $('#shipDisplay').hide();
        }
        self.drawShips();
        self.drawShots();

    }

    self.drawShipsTable = function () {
        var ships = self.game.ships;
        $('#ships body').empty()
        for (i = 0; i < ships.length; i++) {
            $('#ships body').append('<tr id="ship' + i + '"><td></td><div class="drag" id="s' + i + '" draggable="true">' + ships[i].name + '</div><td>' + ships[i].length + '</td><td class="clickable">' + (ships[i].isHorizontal) ? "Horizontal" : "Vertical" + '</td>');
        }

    }

    self.flipShip = function (event) {
        var shipid = event.target.replace('s', '');
        if (self.doesShipFit(shipid, null, null, true)) {
            self.removeOutline(shipid);
            if (self.ships[shipid].x != null) {
                self.changeFields(self.game.ships[shipid], true, true);
            }
            self.drawOutline(shipid);
            event.target.innerHTML = (self.game.ships[shipid].isHorizontal) ? "Horizontal" : "Vertical";

        } else {
            app.createPopup("Ship turning", "You cannot turn this ship here.");
        }
    }

    self.shoot = function (event) {
        if (self.game.yourTurn == true && self.game.status == "started") {
            self.shootAt(event.toElement.id);
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
                    createPopup("Game Over", "The game is over." + text);
                } else {
                    createPopup("Game Status", "The game hasn't started yet, please wait untill the other player has placed their ships.");
                    //alert("The game hasn't started yet");
                }
            } else {
                createPopup("Turn", "It's not your turn, please wait untill the other player has done his turn.");
                //alert("It's not your turn!");
            }
        }
    }

    self.shootAt = function (elementid) {
        var e = self.searchField(elementid);
        if (!e.clicked) {
            var data = '{"x": "' + e.x.toLowerCase() + '", "y": ' + e.y + '}'
            var json = JSON.parse(data);
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
                        }
                        self.shots.push(json);
                        self.visualizeShot(json);
                        //alert("You shot at " + e.x + (e.y));
                        createPopup("Shot", "You shot at " + e.x + (e.y) + " and it " + (result == "BOOM" ? "hit." : "missed."));
                    } else if (result == "FAIL") { // shouldn't happen.
                        createPopup("Shot", "You already shot at " + e.x + (e.y) + ". Sadly this message comes from the server, you have to wait untill your next turn.");
                        //alert("You already shot at " + e.x + (e.y) + ". Try another field");
                    } else if (result == "WINNER") {
                        createPopup("Game Over", "You won the game! Congratulations!");
                        //alert("You won the game!");
                    }
                    self.game.loadMoreInfo(self.game.id);
                }

            });

        } else {
            createPopup("Shot", "You already shot at " + e.x + (e.y) + ". Try another field.");
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
        for (i = 0; i < self.shots.length; i++) {
            self.visualizeShot(self.shots[i], false);
        }
        for (i = 0; i < self.enemyshots.length; i++) {
            self.visualizeShot(self.enemyshots[i], true);
        }
    }
}