function Board(game) {
    var self = this;
    self.fields = new Array(10);
    self.placedShips = [];
    self.ships = [];
    self.shots = [];
    self.enemyshots = [];
    self.letters = "ABCDEFGHIJ".split("");
    self.game = game;
    self.shipsPlaced = false;
    self.dropConfirmed = false;

    //Methods
    self.load = function () {
        self.loadField();
        self.addListeners();
        if (self.game.status == "setup" && self.placedShips.length < 5) {
            self.loadShips();

            $('#shipDisplay').show();
        } else {
            $('#shipDisplay').hide();
        }
    }




    self.searchField = function (input) {
        var si = input.split('');
        if (si.length > 2) {
            si[1] += si[2];
        }
        return self.fields[si[0]][si[1] - 1];
    }

    self.addShip = function (ship, x, y) {
        if (self.placedShips.indexOf(ship) != -1) {
            var index = self.placedShips.indexOf(ship);
            self.ChangeFields(self.placedShips[index], false);
            self.placedShips[index].x = x;
            self.placedShips[index].y = y;
            self.ChangeFields(self.placedShips[index], true);
        } else {
            var index = self.ships.indexOf(ship);
            self.ships[index].x = x;
            self.ships[index].y = y;
            self.placedShips.push(self.ships[index]);
            self.ChangeFields(self.ships[index], true);
        }
    }

    self.sendShips = function () {
        if (self.placedShips.length == 5) {
            var data = '{ "ships": [';
            for (i = 0; i < self.placedShips.length; i++) {
                data += '{"_id": ' + self.placedShips[i].id;
                data += ', "length": ' + self.placedShips[i].length;
                data += ', "name": "' + self.placedShips[i].name;
                data += '", "startCell": {"x": "' + self.placedShips[i].x.toLowerCase() + '", "y": ' + self.placedShips[i].y;
                data += '}, "isVertical": ' + (!self.placedShips[i].isHorizontal) + '}';
                if (i != self.placedShips.length - 1) {
                    data += ',';
                }
            }
            data += ']}';
            //console.log(data);
            var json = JSON.parse(data);
            $.ajax({
                url: url + "/games/" + self.game.id + "/gameboards" + token,
                data: json,
                method: "POST",
                success: function (result) {
                    self.game.loadMoreInfo(self.game.id);
                    self.placedShips = true;
                    //console.log(result);
                    // for (i = 0; i < result.length; i++) {
                    //     self.ships.push(new Ship(result[i]._id,result[i].name, result[i].length, true))

                    // }
                    // self.fillShips();
                }
            });
        } else {
            alert("not all ships are placed!");
        }
    }

    self.ChangeFields = function (ship, gotShip, flipping) {
        //console.log(gotShip);
        var index = self.letters.indexOf(ship.x);
        if (ship.isHorizontal) {
            for (i = 0; i < ship.length; i++) {
                if (flipping) {
                    self.fields[ship.x][parseInt(ship.y) + i - 1].hasShip = !gotShip;
                }
                self.fields[self.letters[index + i]][ship.y - 1].hasShip = gotShip;
            }
        } else {
            for (i = 0; i < ship.length; i++) {
                if (flipping) {
                    self.fields[self.letters[index + i]][ship.y - 1].hasShip = !gotShip;
                }
                self.fields[ship.x][parseInt(ship.y) + i - 1].hasShip = gotShip;
            }
        }
    }

    self.doesShipFit = function (shipnumber, x, y, flipping) {
        var ship = self.ships[shipnumber];
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
                if ((index + i) > 9 || self.fields[self.letters[index + i]][parseInt(y) - 1].hasShip) {
                    return false;
                }
            }
        } else {
            var i = 0;
            if (flipping) {
                i = 1;
            }
            for (i; i < ship.length; i++) {
                if ((parseInt(y) + i) > 10 || self.fields[x][parseInt(y) + i - 1].hasShip) {
                    return false;
                }
            }
        }
        return true;
    }

    // loading all fields of the board
    self.loadField = function () {
        $('#field').remove();
        $('#board').append('<table id="field"><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th><th>E</th><th>F</th><th>G</th><th>H</th><th>I</th><th>J</th></tr><tr><th>1</th><td id="A1" class="field"></td><td id="B1" class="field"></td><td id="C1" class="field"></td><td id="D1" class="field"></td><td id="E1" class="field"></td><td id="F1" class="field"></td><td id="G1" class="field"></td><td id="H1" class="field"></td><td id="I1" class="field"></td><td id="J1" class="field"></td></tr><tr><th>2</th><td id="A2" class="field"></td><td id="B2" class="field"></td><td id="C2" class="field"></td><td id="D2" class="field"></td><td id="E2" class="field"></td><td id="F2" class="field"></td><td id="G2" class="field"></td><td id="H2" class="field"></td><td id="I2" class="field"></td><td id="J2" class="field"></td></tr><tr><th>3</th><td id="A3" class="field"></td><td id="B3" class="field"></td><td id="C3" class="field"></td><td id="D3" class="field"></td><td id="E3" class="field"></td><td id="F3" class="field"></td><td id="G3" class="field"></td><td id="H3" class="field"></td><td id="I3" class="field"></td><td id="J3" class="field"></td></tr><tr><th>4</th><td id="A4" class="field"></td><td id="B4" class="field"></td><td id="C4" class="field"></td><td id="D4" class="field"></td><td id="E4" class="field"></td><td id="F4" class="field"></td><td id="G4" class="field"></td><td id="H4" class="field"></td><td id="I4" class="field"></td><td id="J4" class="field"></td></tr><tr><th>5</th><td id="A5" class="field"></td><td id="B5" class="field"></td><td id="C5" class="field"></td><td id="D5" class="field"></td><td id="E5" class="field"></td><td id="F5" class="field"></td><td id="G5" class="field"></td><td id="H5" class="field"></td><td id="I5" class="field"></td><td id="J5" class="field"></td></tr><tr><th>6</th><td id="A6" class="field"></td><td id="B6" class="field"></td><td id="C6" class="field"></td><td id="D6" class="field"></td><td id="E6" class="field"></td><td id="F6" class="field"></td><td id="G6" class="field"></td><td id="H6" class="field"></td><td id="I6" class="field"></td><td id="J6" class="field"></td></tr><tr><th>7</th><td id="A7" class="field"></td><td id="B7" class="field"></td><td id="C7" class="field"></td><td id="D7" class="field"></td><td id="E7" class="field"></td><td id="F7" class="field"></td><td id="G7" class="field"></td><td id="H7" class="field"></td><td id="I7" class="field"></td><td id="J7" class="field"></td></tr><tr><th>8</th><td id="A8" class="field"></td><td id="B8" class="field"></td><td id="C8" class="field"></td><td id="D8" class="field"></td><td id="E8" class="field"></td><td id="F8" class="field"></td><td id="G8" class="field"></td><td id="H8" class="field"></td><td id="I8" class="field"></td><td id="J8" class="field"></td></tr><tr><th>9</th><td id="A9" class="field"></td><td id="B9" class="field"></td><td id="C9" class="field"></td><td id="D9" class="field"></td><td id="E9" class="field"></td><td id="F9" class="field"></td><td id="G9" class="field"></td><td id="H9" class="field"></td><td id="I9" class="field"></td><td id="J9" class="field"></td></tr><tr><th>10</th><td id="A10" class="field"></td><td id="B10" class="field"></td><td id="C10" class="field"></td><td id="D10" class="field"></td><td id="E10" class="field"></td><td id="F10" class="field"></td><td id="G10" class="field"></td><td id="H10" class="field"></td><td id="I10" class="field"></td><td id="J10" class="field"></td></tr></table>');

        for (j = 0; j < 10; j++) {
            self.fields[self.letters[j]] = new Array(10);

            for (i = 0; i < 10; i++) {
                self.fields[self.letters[j]][i] = new Field(self.letters[j], (i + 1));
            }
        }

    }

    self.loadShips = function () {
        self.ships = [];
        self.placedShips = [];
        $.ajax({
            url: url + "/ships" + token,
            success: function (result) {
                for (i = 0; i < result.length; i++) {
                    self.ships.push(new Ship(result[i]._id, result[i].name, result[i].length, true))

                }
                self.fillShips();
            }
        });
    }


    //drag and drop functions
    self.dragdrop = function () {
        var drag = document.querySelectorAll(".drag");
        var drop = document.querySelectorAll(".drop");


        for (i = 0; i < drop.length; i++) {
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
                if (self.doesShipFit(shipnumber, id[0], id[1])) {

                    self.dropConfirmed = true;
                    var element = document.getElementById(data);
                    element.className += " placed";
                    event.target.appendChild(element);


                    self.addShip(self.ships[shipnumber], id[0], id[1]);

                    //console.log('Placing ship in ' + id[0] + (id[1]));

                    // setting outline for ship
                    self.drawOutline(shipnumber);
                } else {
                    alert("You cant place this ship here!");
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

    // fill unplaced ships in table
    self.fillShips = function () {
        var field = $('.field');
        field.each(function () {
            $(this).removeClass('ship');
            $(this).empty();
        });
        var shiptable = document.querySelector('#ships tbody');
        $('#ships tbody').empty();
        for (i = self.ships.length - 1; i >= 0; i--) {
            var row = shiptable.insertRow(0);
            row.id = "ship" + i;
            var cel1 = row.insertCell(0);
            var cel2 = row.insertCell(1);
            var cel3 = row.insertCell(2);

            cel2.innerHTML = self.ships[i].length;
            if (self.ships[i].isHorizontal) {
                cel3.innerHTML = "Horizontal";
            } else {
                cel3.innerHTML = "Vertical";
            }

            var drag = document.createElement("div");
            drag.className += "drag";
            drag.id = "s" + i;
            drag.setAttribute("draggable", true);
            drag.innerHTML = self.ships[i].name;
            cel1.appendChild(drag);
            cel3.style.cssText = "-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none;"
            cel3.style.cursor = "pointer";
            //listener for orientation change
            cel3.addEventListener("click", function (event) {
                var id = event.srcElement.parentElement.id;
                var shipid = id.replace('ship', '');
                if (self.doesShipFit(shipid, null, null, true)) {
                    self.removeOutline(shipid);
                    self.ships[shipid].flip();
                    if (self.ships[shipid].x != null) {
                        self.ChangeFields(self.ships[shipid], true, true);
                    }
                    self.drawOutline(shipid);
                    if (self.ships[shipid].isHorizontal) {
                        event.srcElement.innerHTML = "Horizontal";
                    } else {
                        event.srcElement.innerHTML = "Vertical";
                    }
                } else {
                    alert("Can't turn this ship");
                }
            });
        }
        self.dragdrop();
    }


    //addEventListeners to all fields
    self.addListeners = function () {
        var fields = $('.field');
        fields.each(function () {
            var el = $(this);
            el.text("");
            //drop fields for drag and drop
            if (!el.hasClass("drop")) {
                if (self.game.status == "setup") {
                    el.addClass("drop");
                }
            } else {
                if (self.game.status != "setup") {
                    el.removeClass("drop");
                }
            }




        });
        $('.field').on('click', function (event) {
            console.log(self.game);
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
                        alert("The game is finished. " + text);
                    } else {
                        alert("The game hasn't started yet");
                    }
                } else {
                    alert("It's not your turn!");
                }
            }
        });

        // var elements = document.querySelectorAll('.field');
        // for (i = 0; i < elements.length; i++) {
        //     if (elements[i].className.indexOf("drop") == -1) {
        //         elements[i].className += " drop";
        //     }
        //     var clickclass = elements[i].className.indexOf("clicked");
        //     if(clickclass > -1){ // has clicked class, needs to be removed.

        //     }
        //     elements[i].addEventListener("click", function (event) {
        //         var e = self.searchField(event.srcElement.id);
        //         if (!e.clicked) {
        //             e.click();
        //             event.srcElement.className += " clicked";
        //             console.log("You shot at " + e.x + (e.y));
        //         } else {
        //             console.log("You already shot at " + e.x + (e.y) + ". Try another field")
        //         }
        //     });
        //}
        var confirmbutton = $('#confirmShips').on('click', function () {
            self.sendShips();
        });
    }

    //Outline functions for ships
    self.drawOutline = function (shipnumber) {

        var ship = self.ships[shipnumber];
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
        var ship = self.ships[shipnumber];
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

    self.drawShipName = function (shipnumber) {
        var shipx = self.ships[shipnumber].x;
        var shipy = self.ships[shipnumber].y;
        var shipname = self.ships[shipnumber].name;

        $('#' + shipx + shipy).text(shipname);

    }


    self.loadObjects = function (myboard, enemyboard) {

        //console.log(myboard); // contains shots from enemy at me
        //console.log(enemyboard); // contains my shots
        //console.log(self.game);
        if (self.game.status == "setup" && myboard != undefined && myboard.ships.length == 5) {
            shipsPlaced = true;
        }
        var text = "You are playing versus " + self.game.enemyName + ". It's ";
        if (self.game.yourTurn) {
            text += "your";
        } else {
            text += "his";
        }
        text += " turn.";
        $('#enemyText')[0].innerHTML = text;

        if (myboard != undefined) {
            if (myboard.ships.length > 0) {
                self.ships = [];
                self.placedShips = [];
            }
            for (i = 0; i < myboard.ships.length; i++) {
                var s = new Ship(myboard.ships[i]._id, myboard.ships[i].name, myboard.ships[i].length, !myboard.ships[i].isVertical);
                s.x = myboard.ships[i].startCell.x.toUpperCase();
                s.y = myboard.ships[i].startCell.y;
                s.hits = myboard.ships[i].hits;
                self.ships.push(s)
                self.placedShips.push(s);

            }

            //console.log(self.ships);
            if (enemyboard != null && enemyboard.shots != null) {
                self.shots = enemyboard.shots;
            }
            if (myboard != null && myboard.shots != null) {
                self.enemyshots = myboard.shots;
            }
            self.load();
            //console.log(self.shots);
            //console.log(self.enemyshots);
            self.visualizeAllShots();
            for (i = 0; i < self.placedShips.length; i++) {
                self.drawOutline(i);
                self.drawShipName(i);
            }

        }


        if (self.game.shouldPoll()) {
            poller = setTimeout(function () { self.game.loadMoreInfo(self.game.id) }, 5000);
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
                        alert("You shot at " + e.x + (e.y));
                    } else if (result == "FAIL") {
                        alert("You already shot at " + e.x + (e.y) + ". Try another field");
                    } else if (result == "WINNER") {
                        alert("You won the game!");
                    }
                    self.game.loadMoreInfo(self.game.id);
                }

            });

        } else {
            alert("You already shot at " + e.x + (e.y) + ". Try another field");
        }
    }

    self.createPopup = function (title, message, buttons) {
        //TODO do this later
    }

    self.update = function () {

    }

}
