function Board(game) {
    var self = this;
    self.fields = new Array(10);
    self.placedShips = [];
    self.ships = [];
    self.shots = [];
    self.enemyshots = [];
    self.letters = "ABCDEFGHIJ".split("");
    self.game = game;
    self.dropConfirmed = false;

    //Methods
    self.load = function () {
        self.loadField();
        self.addListeners();
        if (self.game.status == "setup") {
            self.loadShips();
        }
    }

    self.searchField = function (input) {
        var si = input.split('');
        if (si.length > 2) {
            si[1] += si[2];
        }
        return self.fields[si[0]][si[1]-1];
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
                    console.log(result);
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
        console.log(gotShip);
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
                console.log(shipnumber);
                // test if ship can fit here
                if (self.doesShipFit(shipnumber, id[0], id[1])) {

                    self.dropConfirmed = true;
                    var element = document.getElementById(data);
                    element.className += " placed";
                    event.target.appendChild(element);


                    self.addShip(self.ships[shipnumber], id[0], id[1]);

                    console.log('Placing ship in ' + id[0] + (id[1]));

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
                console.log(event.target);
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

            el.on('click', function (event) {
                var e = self.searchField(event.toElement.id);
                if (self.game.yourTurn == true && self.game.status == "started") {
                    if (!e.clicked) {
                        e.click();
                        $('#' + event.toElement.id).addClass('clicked');
                        alert("You shot at " + e.x + (e.y));
                    } else {
                        alert("You already shot at " + e.x + (e.y) + ". Try another field")
                    }
                } else {
                    if (self.game.status != "started") {
                        alert("The game hasn't started yet");
                    } else {
                        alert("It's not your turn!");
                    }
                }
            });

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
        console.log(ship);
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
    
    self.loadObjects = function(myboard, enemyboard){
        console.log(myboard);
        console.log(enemyboard);
        if(self.game.status != "setup"){
            $('#shipDisplay').hide();
        }
        
        if(myboard != undefined){
            if(myboard.ships.length > 0){
                self.ships = [];
                self.placedShips = [];
            }
            for(i = 0; i < myboard.ships.length; i++){
                var s = new Ship(myboard.ships[i]._id, myboard.ships[i].name, myboard.ships[i].length, !myboard.ships[i].isVertical);
                s.x = myboard.ships[i].startCell.x.toUpperCase();
                s.y = myboard.ships[i].startCell.y;
                console.log(s);
                self.ships.push(s)
                self.placedShips.push(s);
                
            }
            console.log(self.ships);
            console.log(self.placedShips);
            for(i = 0; i < self.placedShips.length; i++){
                self.drawOutline(i);
            }
            
        }
    }
    
    self.shootAt = function(location){
        
    }
    self.load();
}
