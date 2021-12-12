let modal = new bootstrap.Modal(document.getElementById("playerName"));
modal.show();

playerNamesForm = document.getElementById("playerNamesForm");
playerNamesForm.addEventListener("keyup", checkName);
playerNamesForm.addEventListener("submit", submitNames);

function checkName() {
    if (player1.value == player2.value) {
        player2.value = "";
    } else if (player1.value == player3.value ||
        player2.value == player3.value) {
        player3.value = "";
    } else if (player1.value == player4.value ||
        player2.value == player4.value ||
        player3.value == player4.value) {
        player4.value = "";
    }
}

function submitNames(e) {
    e.preventDefault();
    e.target.classList.remove("shakeIt")

    if (player1.value != "" && player2.value != "" && player3.value != "" && player4.value != "") {
        playerNames.push(player1.value);
        playerNames.push(player2.value);
        playerNames.push(player3.value);
        playerNames.push(player4.value);

        modal.hide();
        startGame();
    } else {
        e.target.classList.add("shakeIt");
        setTimeout(function() {
            e.target.classList.remove("shakeIt");
        }, 1000);
    }
}

async function startGame() {
    console.log("startGame");
    let response = await load();
    console.log(response);
    playGame(response);
}

async function load() {
    console.log("load");
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start", {
        method: 'POST',
        body: JSON.stringify(playerNames),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });

    if (response.ok) {
        let result = await response.json();
        greet();
        return result;
    } else {
        document.getElementById("errorMessage").firstChild.textContent = "HTTP-Error: " + response.status;
        let modal = new bootstrap.Modal(document.getElementById("errorModal"));
        modal.show();
        document.getElementById("close").addEventListener("click", function(e) {
            modal.hide();
        });
        document.getElementById("desk").classList.toggle('hiddenElement');
    }
}

function greet() {
    console.log("greet");
    const welcomeMessage = document.getElementById("welcome");
    welcomeMessage.classList.toggle('hiddenElement');
    welcomeMessage.classList.toggle('greeting');

    const desk = document.getElementById("desk");


    setTimeout(function() {
        desk.classList.toggle('hiddenElement');
        desk.classList.toggle('start');
    }, 3000);
}

function playGame(result) {
    console.log("playGame");
    playId = result.Id;


    for (let i = 0; i < result.Players.length; i++) {
        let player = result.Players[i];
        players[i] = new Player(player.Player, player.Cards, player.Score);
        mapCards(players[i]);
    }

    playerTurn = players.find(function(e) {
        return e.Name == result.NextPlayer;
    })
    console.log(result.NextPlayer);


    topCard = new Card(result.TopCard.Color, result.TopCard.Text, result.TopCard.Value, result.TopCard.Score);



    if (topCard.Value == 10) {
        let index = players.indexOf(players.find(function(e) {
            return e.Name == playerTurn.Name;
        })) - reverse;
        index = checkOverflow(index);

        updateMargin(playerDivs.find(function(e) {
            return e.id == players[index].Name;
        }).parentNode.lastElementChild);
    }

    showTopCard(topCard);
    displayCurrentPlayer(playerTurn);
}

function displayCurrentPlayer(currentPlayer) {
    console.log("displayCurrentPlayer");
    console.log(currentPlayer);
    const div = document.getElementById("current").firstElementChild;
    div.textContent = currentPlayer.Name.toUpperCase();

    for (let i = 0; i < playerNames.length; i++) {
        let inspectedDiv = document.getElementById(playerNames[i]);
        if (playerNames[i] == currentPlayer.Name) {
            inspectedDiv.style.opacity = 1;
            inspectedDiv.parentNode.lastChild.classList.remove("notSelected");
        } else {
            inspectedDiv.style.opacity = 0.8;
            inspectedDiv.parentNode.lastChild.classList.add("notSelected");
        }
    }
}

function showTopCard(topCard) {
    console.log("showTopCard");
    let img;

    if (pile.firstElementChild) {
        img = pile.firstElementChild;
    } else {
        img = document.createElement("img");
        pile.appendChild(img);
    }

    img.src = `images/${topCard.Color}_${topCard.Value}.png`;
}

function mapCards(player) {
    console.log("mapCards");
    const div = document.createElement("div");
    div.classList.add("playerDivs");

    const playerInfo = document.createElement("div");
    playerInfo.id = player.Name;
    playerInfo.classList.add("card");
    playerDivs.push(playerInfo);

    const nameOfPlayer = document.createElement("h6");
    nameOfPlayer.textContent = player.Name;

    const points = document.createElement("h7");
    points.textContent = "Points: " + player.Score;

    div.appendChild(playerInfo);
    playerInfo.appendChild(nameOfPlayer);
    playerInfo.appendChild(points);

    const ul = document.createElement("ul");
    document.querySelector("#playground").appendChild(div).appendChild(ul);

    addListeners(ul);

    player.Cards.map(function(el) {
        const img = document.createElement("img");
        img.src = `images/${el.Color}_${el.Value}.png`;
        const listElement = document.createElement("li");
        listElement.classList.add("playerCards");
        ul.appendChild(listElement).appendChild(img);
    })
}

function addListeners(ul) {
    console.log("addListeners");
    ul.addEventListener("mouseover", function(e) {
        if (e.target != e.currentTarget) {
            e.target.classList.toggle("mouseOver");
        }
    })

    ul.addEventListener("mouseout", function(e) {
        if (e.target != e.currentTarget) {
            e.target.classList.toggle("mouseOver");
        }
    })

    ul.addEventListener("click", getCardToPlay)
}

async function getCardToPlay(e) {
    console.log("getCardToPlay");
    let arr = e.target.src.split("/");
    const card = arr[arr.length - 1].split(".")[0].split("_");
    const cardScore = mapCardScore(card[0], card[1]);
    const cardToPlay = new Card(card[0], "", card[1], cardScore);

    let clicked = e.target.closest('li');
    let parentUl = Array.from(e.target.parentNode.parentNode.children);
    let indexOfClicked = parentUl.indexOf(clicked);

    if (e.currentTarget.parentNode.firstElementChild.id != playerTurn.Name) {
        e.preventDefault;
        // animation?
        console.log("not your turn");
        const body = document.body;
        body.classList.add("box-shadow");
        setTimeout(function() {
            body.classList.remove("box-shadow");
        }, 1000);
    } else {
        if (checkCard(cardToPlay) == true) {
            console.log(playerTurn);
            e.currentTarget.removeChild(e.target.parentNode);
            removeCardFromArr(indexOfClicked);
            updateMargin(e.currentTarget);
            checkColor(cardToPlay, playerTurn, colorWish);

        } else {
            console.log("in false");
            e.target.parentNode.classList.add("shakeIt");
            setTimeout(function() {
                e.target.parentNode.classList.remove("shakeIt");
            }, 1000);
        }
    }
}

function updateMargin(ul) {
    let margin = 3;
    if (ul.children.length > 7) {
        let temp = ul.children.length * 85 - 700;
        console.log(temp);
        margin = (temp / playerTurn.Cards.length + 1) * (-1);
    }

    console.log(margin);


    for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].style.marginRight = `${margin}px`;
    }
}

function mapCardScore(color, value) {
    console.log("mapCardScore");
    if (color == "Black") {
        return 50;
    } else {
        if (value < 10) {
            return value;
        } else {
            return 20;
        }
    }
}

function checkCard(card) {
    console.log("checkCard");
    let currPlayer = players.find(function(e) {
        return e.Name == playerTurn.Name;
    })
    console.log(card);
    console.log(topCard);
    if (card.Color == "Black") {
        let foundCard = currPlayer.Cards.find(function(e) {
            return e.Color == topCard.Color;
        })
        if (card.Value == 13 && typeof(foundCard) !== 'undefined') {
            console.log("+4 not allowed");
            return false;
        }
        if (topCard.Value >= 13 && card.Value >= 13) {
            alert("Color has to stay the same");
            //colorWish = topCard.Color;
            return false;
        } else {
            // colorWish = prompt("Welche Farbe?")
            colorWish = "choose";
        }
        return true;
    } else if (topCard.Color == card.Color || topCard.Value == card.Value) {
        console.log("in true");
        colorWish = "";
        return true;
    } else {
        console.log("false");
        return false;
    }
}

function removeCardFromArr(index) {
    console.log("removeCardFromArr");
    players.find(function(e) {
        return e.Name == playerTurn.Name;
    }).Cards.splice(index, 1);
}

function processColorWish(colorWish, cardValue) {
    let color;
    switch (colorWish.toUpperCase) {
        case 'R':
            color = "Red";
            break;
        case 'B':
            color = "Blue";
            break;
        case 'Y':
            color = "Yellow";
            break;
        case 'G':
            color = "Green";
            break;
        default:
            color = colorWish;
    }

    return new Card(color, "", cardValue, 0);
}

function checkColor(card, player, color) {
    if (color == "choose") {
        let modal = new bootstrap.Modal(document.getElementById("colorPicker"));
        modal.show();
        colorPickerForm.addEventListener("click", function(e) {
            e.preventDefault;
            if (e.target.id == "red") {
                colorWish = "Red";
                console.log(colorWish);
            } else if (e.target.id == "blue") {
                colorWish = "Blue";
                console.log(colorWish);
            } else if (e.target.id == "green") {
                colorWish = "Green";
                console.log(colorWish);
            } else if (e.target.id == "yellow") {
                colorWish = "Yellow";
                console.log(colorWish);
            }
            playCard(card, player, colorWish);
            modal.hide();
        });
    } else {
        playCard(card, player, colorWish);
    }
}

async function getColor() {
    let modal = new bootstrap.Modal(document.getElementById("colorPicker"));
    modal.show();
    console.log("colorWish" + colorWish);
    colorPickerForm = document.getElementById("colorPickerForm");
    colorPickerForm.addEventListener("click", function(e) {
        e.preventDefault;
        if (e.target.id == "red") {
            colorWish = "Red";
            console.log(colorWish);
        } else if (e.target.id == "blue") {
            colorWish = "Blue";
            console.log(colorWish);
        } else if (e.target.id == "green") {
            colorWish = "Green";
            console.log(colorWish);
        } else if (e.target.id == "yellow") {
            colorWish = "Yellow";
            console.log(colorWish);
        }
    });
    modal.hide();
    console.log("colorWish" + colorWish);
    console.log("test2");
    return colorWish;
}

function getColorWish() {
    return new Promise((resolve, reject) => {
        let tempModal = document.getElementById("colorPickerForm");
        let redBtn = document.getElementById("red");
        redBtn.addEventListener("click", function(e) {
            console.log("in red btn")
            resolve("R");
        })
    });
}

function colorPicked(e) {
    console.log("colorPicked");
    console.log(e);
    console.log(e.target);
    console.log(e.currentTarget);
    if (e.target.classList.contains("btn-red")) {
        console.log("red");
        colorWish = "R";

    }
}

async function playCard(card, player, color) {
    console.log("playCard");
    console.log(player);
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card.Value + "&color=" + card.Color + "&wildColor=" + colorWish, {
        method: 'PUT'
    });
    console.log(response);
    if (response.ok) {
        let result = await response.json();

        console.log(result);

        if (playerTurn.Name == result.Player) {
            startFirework();
            let loosers = players.filter(function(e) {
                return e.Name != result.Player;
            });
            console.log(loosers);
            let points = 0;
            for (let i = 0; i < loosers.length; i++) {
                points += loosers[i].Score;
            }
            console.log("Points: " + points);
            document.getElementById("winnerMessage").firstChild.textContent = "Player " + playerTurn.Name + " won with " + points + " points.";

            let modal = new bootstrap.Modal(document.getElementById("winnerModal"));
            modal.show();
            document.getElementById("playAgain").addEventListener("click", function(e) {
                window.location.reload();
                modal.hide();
            });

            console.log("end of game");
        }

        if (playerTurn.Cards.length == 1) {
            const unoMessage = document.getElementById("uno");
            unoMessage.classList.toggle('hiddenElement');
            unoMessage.classList.toggle('shoutUno');
        }

        playerTurn = players.find(function(e) {
            return e.Name == result.Player;
        });
        console.log(playerTurn);
        displayCurrentPlayer(playerTurn);

        if (card.Value > 12) {
            topCard = processColorWish(color, card.Value);
        } else {
            topCard = card;
        }

        showTopCard(topCard);

        if (card.Value == 12) {
            reverse *= -1;
        }

        console.log("---");
        console.log(player);
        console.log(players.indexOf(players.find(function(e) {
            return e.Name == playerTurn.Name;
        })))

        let index = players.indexOf(players.find(function(e) {
            return e.Name == playerTurn.Name;
        })) - reverse;

        if (index < 0) {
            index = players.length - 1;
        }
        if (index > players.length - 1) {
            index = 0;
        }
        console.log(index);
        console.log(reverse);
        console.log(players[index]);

        updateScoreAfterPlay(card.Score);



        if (card.Value == 13 || card.Value == 10) {
            updateCards();
        }
    } else {
        document.getElementById("errorMessage").firstChild.textContent = "HTTP-Error: " + response.status;
        let modal = new bootstrap.Modal(document.getElementById("errorModal"));
        modal.show();
        document.getElementById("close").addEventListener("click", function(e) {
            modal.hide();
        });
    }
}

async function updateCards() {
    console.log("updateCards");
    let indexCurr = players.indexOf(players.find(function(e) {
        return e.Name == playerTurn.Name;
    }));

    let index = indexCurr - reverse;
    if (index < 0) {
        index = players.length - 1;
    }
    if (index > players.length - 1) {
        index = 0;
    }
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/GetCards/" + playId + "?playerName=" + players[index].Name, {
        method: 'GET'
    });

    if (response.ok) {
        let result = await response.json();
        players[index].Cards = result.Cards;
        players[index].Score = result.Score;
        updateScoreAfterDraw(players[index]);
        updateCardsAfterDraw(players[index]);
    }
}

function updateCardsAfterDraw(player) {
    console.log("updateCardsAfterDraw");
    let list = playerDivs.find(function(e) {
        return e.id == player.Name;
    }).parentNode.lastElementChild;

    console.log(list.firstChild);
    console.log(list.firstChild.offsetWidth);

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    console.log(player.Cards);
    let margin = 0;

    console.log(playerDivs[0]);
    console.log(playerDivs[0].offsetWidth);


    if (player.Cards.length > 7) {
        let temp = player.Cards.length * 85 - 700;
        margin = temp / player.Cards.length + 1;
    } else {
        margin = 0;
    }

    for (let i = 0; i < player.Cards.length; i++) {
        let img = document.createElement("img");
        img.src = `images/${player.Cards[i].Color}_${player.Cards[i].Value}.png`;
        let listElement = document.createElement("li");
        listElement.classList.add("playerCards");
        listElement.style.marginRight = `-${margin}px`;
        list.appendChild(listElement).appendChild(img);
    }
}

function updateScoreAfterDraw(player) {
    console.log("updateScoreAfterDraw");
    playerDivs.find(function(e) {
        return e.id == player.Name;
    }).lastElementChild.textContent = "Points: " + player.Score;
}

function updateScoreAfterPlay(score) {
    console.log("updateScoreAfterPlay");
    let indexCurr = players.indexOf(players.find(function(e) {
        return e.Name == playerTurn.Name;
    }));

    let index = indexCurr - reverse;
    index = checkOverflow(index);
    if (topCard.Value == 13 || topCard.Value == 10 || topCard.Value == 11) {
        index = index - reverse;
        index = checkOverflow(index);
    }
    console.log(playerTurn);
    players[index].Score -= score;

    console.log(players[index]);


    playerDivs.find(function(e) {
        return e.id == players[index].Name;
    }).lastElementChild.textContent = "Points: " + players[index].Score;
}

function checkOverflow(index) {
    if (index < 0) {
        index = players.length - 1;
    }
    if (index > players.length - 1) {
        index = 0;
    }
    return index;
}

document.getElementById("ziehen").addEventListener("click", ziehen);

// Game/DrawCard/{id}
async function ziehen() {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/DrawCard/" + playId, {
        method: 'PUT'
    });

    if (response.ok) {
        let result = await response.json();
        console.log("ziehen")
        console.log(result);
        let tempPlayer = players.find(function(e) {
            return e.Name == result.Player;
        });
        updatePlayerAfterDraw(tempPlayer, result.Card);
        updateCardsAfterDraw(tempPlayer);
        updateScoreAfterDraw(tempPlayer);

        playerTurn = players.find(function(e) {
            return e.Name == result.NextPlayer;
        });
        displayCurrentPlayer(playerTurn);
    } else {
        document.getElementById("errorMessage").firstChild.textContent = "HTTP-Error: " + response.status;
        let modal = new bootstrap.Modal(document.getElementById("errorModal"));
        modal.show();
        document.getElementById("close").addEventListener("click", function(e) {
            modal.hide();
        });
        document.getElementById("desk").classList.toggle('hiddenElement');
    }
    //return result.Player;
}

function updatePlayerAfterDraw(player, card) {
    console.log("updatePlayerAfterDraw");
    player.Cards.push(new Card(card.Color, card.Text, card.Value, card.Score));
    player.Score += card.Score;
}

function startFirework() {
    const firework = document.createElement("div");
    const before = document.createElement("div");
    const after = document.createElement("div");

    firework.classList.add("pyro");
    before.classList.add("before");
    after.classList.add("after");

    const body = document.body;
    firework.appendChild(before);
    firework.appendChild(after);
    body.appendChild(firework);
}