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
    console.log(e.target);
    e.target.classList.remove("shakeIt")

    if (player1.value != "" && player2.value != "" && player3.value != "" && player4.value != "") {
        playerNames.push(player1.value);
        playerNames.push(player2.value);
        playerNames.push(player3.value);
        playerNames.push(player4.value);

        modal.hide();
        startGame();
    } else {
        console.log(e);
        e.target.classList.add("shakeIt");
        setTimeout(function() {
            e.target.classList.remove("shakeIt");
        }, 1000);
    }
}

async function startGame() {
    console.log("startGame");
    let response = await load();
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

    playerTurn = result.NextPlayer;
    

    for (let i = 0; i < result.Players.length; i++) {
        let player = result.Players[i];
        players[i] = new Player(player.Player, player.Cards, player.Score);
        mapCards(players[i]);
    }

    topCard = new Card(result.TopCard.Color, result.TopCard.Text, result.TopCard.Value, result.TopCard.Score);
    showTopCard(topCard);
    displayCurrentPlayer(playerTurn);
}

function displayCurrentPlayer(currentPlayer) {
    console.log("displayCurrentPlayer");
    const div = document.getElementById("current").firstChild;
    div.textContent = currentPlayer.toUpperCase();

    for (let i = 0; i < playerNames.length; i++) {
        let inspectedDiv = document.getElementById(playerNames[i]);
        if (playerNames[i] == currentPlayer) {
            console.log(inspectedDiv.parentNode);
            console.log(inspectedDiv.parentNode.lastChild);
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

    return player.Cards.map(function(el) {
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

    if (e.currentTarget.parentNode.firstElementChild.id != playerTurn) {
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
            playCard(cardToPlay, e.currentTarget.parentNode.firstElementChild, colorWish);
            e.currentTarget.removeChild(e.target.parentNode);
        }
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
    if (card.Color == "Black") {
        console.log(card);
        colorWish = prompt("Welche Farbe?")
        // getColor();
        
        console.log("test3");
        console.log(colorWish);
        return true; 
    } else if (topCard.Color == card.Color || topCard.Value == card.Value) {
        colorWish = "";
        return true;
    } else {
        return false;
    }
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

async function getColor() {
    let modal = new bootstrap.Modal(document.getElementById("colorPicker"));
    modal.show(); 
    console.log("colorWish" + colorWish);
    colorWish = await getColorWish();
    modal.hide();
    console.log("colorWish" + colorWish);
    console.log("test2");
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
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card.Value + "&color=" + card.Color + "&wildColor=" + color, {
        method: 'PUT'
    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);

        playerTurn = result.Player;
        displayCurrentPlayer(playerTurn);

        console.log("play card");
        console.log(result.Cards);
        console.log(players.find(function(e) {
            return e.Name == result.Player;
        }).Cards);
        console.log(color)

        if (card.Value > 12) {
            topCard = processColorWish(color, card.Value);
        } else {
           topCard = card; 
        }
        
        showTopCard(topCard);

        updateScoreAfterPlay(player, card.Score);

        if (card.Value == 12) {
            reverse *= -1;
        }

        console.log(player);

        if (card.Value == 13 || card.Value == 10) {
            let index = players.indexOf(players.find(function(e) {
                return e.Name == player.id;
            })) + reverse;
            console.log(index);
            

            if (index < 0) {
                index = players.length - 1;
            }
            if (index > players.length - 1) {
                index = 0;
            }

            let tempPlayer = players[index];
            console.log(tempPlayer);
            console.log(index);
            updateCards(tempPlayer);
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

async function updateCards(player) {
    console.log("updateCards");
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/GetCards/" + playId + "?playerName=" + player.Name, {
        method: 'GET'
    });

    if (response.ok) {
        let result = await response.json();
        player.Cards = result.Cards;
        player.Score = result.Score;
        updateScoreAfterDraw(player);
        updateCardsAfterDraw(player);
    }
}

function updateCardsAfterDraw(player) {
    console.log("updateCardsAfterDraw");
    let list = playerDivs.find(function(e) {
        return e.id == player.Name;
    }).parentNode.lastElementChild;
    let length = list.children.length;
    console.log(list);
    for (let i = length; i < player.Cards.length; i++) {
        let img = document.createElement("img");
        img.src = `images/${player.Cards[i].Color}_${player.Cards[i].Value}.png`;
        let listElement = document.createElement("li");
        listElement.classList.add("playerCards");
        list.appendChild(listElement).appendChild(img);
    }
}

function updateScoreAfterDraw(player) {
    console.log("updateScoreAfterDraw");
    playerDivs.find(function(e) {
        return e.id == player.Name;
    }).lastElementChild.textContent = "Points: " + player.Score;
}

function updateScoreAfterPlay(player, score) {
    let tempPlayer = players.find(function(e) {
        return e.Name == player.id;
    });
    tempPlayer.Score -= score;
    player.lastElementChild.textContent = "Points: " + tempPlayer.Score;
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
        console.log(result.Player);
        //console.log(testPlayer.Score);
        //console.log(result.Card.Score);
        // cardScore = result.Card.Score;
        let tempPlayer = players.find(function(e) {
            return e.Name == result.Player;
        });
        updatePlayerAfterDraw(tempPlayer, result.Card);
        updateCardsAfterDraw(tempPlayer);
        updateScoreAfterDraw(tempPlayer);        

        playerTurn = result.NextPlayer;
        displayCurrentPlayer(playerTurn);

        /*
        console.log(document.getElementById(result.Player).nextSibling);
        const img = document.createElement("img");

        console.log(result.Card);



        img.src = `images/${result.Card.Color}_${result.Card.Value}.png`;
        const listElement = document.createElement("li");
        listElement.classList.add("playerCards");
        document.getElementById(result.Player).nextSibling.appendChild(listElement).appendChild(img);
        */
    } else {
        alert("HTTP-Error: " + response.status)
    }
    //return result.Player;
}

function updatePlayerAfterDraw(player, card) {
    player.Cards.push(new Card(card.Color, card.Text, card.Value, card.Score));
    player.Score += card.Score;
}