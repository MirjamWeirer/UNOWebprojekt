// Card constructor function
function Card(color, text, value, score) {
    this.Color = color;
    this.Text = text;
    this.Value = value;
    this.Score = score;
}

// Player constructor function with cards and score with default values to be able to create players only with names
function Player(name, cards = [], score = -1) {
    this.Name = name;
    this.Cards = cards;
    this.Score = score;
}

let playerNames = [];
let playerObjects = [];
let playerDivs = [];
// um nicht den object tree mehrmals durchsuchen zu müssen (überhaupt nötig?)
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let player3 = document.getElementById("player3");
let player4 = document.getElementById("player4");

let playerTurn;
let topCard;
let playId;
let colorWish;

let pile = document.getElementById("ablegen");

//Show Modal Dialog from Bootstrap - Dialog öffne
let modal = new bootstrap.Modal(document.getElementById("playerName"));
modal.show();

document.getElementById("playerNamesForm").addEventListener("keyup", checkName);
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

document.getElementById("playerNamesForm").addEventListener("submit", function(e) {
    e.preventDefault();
    if (player1.value != "" && player2.value != "" && player3.value != "" && player4.value != "") {
        playerNames.push(player1.value);
        playerNames.push(player2.value);
        playerNames.push(player3.value);
        playerNames.push(player4.value);

        // für das austeilen der karten
        playerDivs.push(document.getElementById("player1cards"));
        playerDivs.push(document.getElementById("player2cards"));
        playerDivs.push(document.getElementById("player3cards"));
        playerDivs.push(document.getElementById("player4cards"));

        modal.hide();
        document.getElementById("desk").style.visibility = 'visible';
        startGame();
    } else {
        // Some action to prevent sending an empty name
    }
})

function startGame() {
    load();
}

async function load() {
    // hier starten wir gleich den request
    // warten auf das promise (alternativ fetch, then notation)
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start", {
        method: 'POST',
        body: JSON.stringify(playerNames),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });

    // dieser code wird erst ausgeführt wenn fetch fertig ist
    if (response.ok) { // wenn http-status zwischen 200 und 299 liegt
        // wir lesen den response body 
        let result = await response.json(); // alternativ response.text wenn nicht json gewünscht ist
        playId = result.Id;
        playGame(result);
    } else {
        alert("HTTP-Error: " + response.status);
    }
}

function playGame(result) {
    playId = result.Id;
    playerTurn = result.NextPlayer;

    for (let i = 0; i < result.Players.length; i++) {
        let player = result.Players[i];
        playerObjects[i] = new Player(player.Player, player.Cards, player.Score);
    }

    topCard = new Card(result.TopCard.Color, result.TopCard.Text, result.TopCard.Value, result.TopCard.score);
    showTopCard(topCard);

    for (let i = 0; i < playerObjects.length; i++) {
        mapCards(playerObjects[i]);
    }

    displayCurrentPlayer(result.NextPlayer);
}

function showTopCard(card) {
    let img;
    if (pile.firstElementChild) {
        img = pile.firstElementChild;
    } else {
        img = document.createElement("img");
        pile.appendChild(img);
    }
    img.src = `images/${card.Color}_${card.Value}.png`;
    // what for?
    // pile.classList.add("playerDivs");
    // OR
    // img.classList.add("playerDivs");
}

function mapCards(player) {
    const div = document.createElement("div");
    div.classList.add("playerDivs");

    const playerInfo = document.createElement("div");
    playerInfo.id = player.Name;
    playerInfo.classList.add("card");

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

function getCardToPlay(e) {
    let arr = e.target.src.split("/");
    const card = arr[arr.length - 1].split(".")[0].split("_");
    const cardScore = mapCardScore(card[0], card[1]);
    const cardToPlay = new Card(card[0], "", card[1], cardScore);

    if (checkCard(cardToPlay) == true) {
        playCard(cardToPlay, e.currentTarget.parentNode.firstElementChild, colorWish);
        e.currentTarget.removeChild(e.target.parentNode);
        // topCard = [];
    }
}

function mapCardScore(color, value) {
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
    if (topCard.Color == card.Color || topCard.Value == card.Value) {
        colorWish = "";
        return true;
    } else if (card.Color == "Black") {
        colorWish = prompt("Welche Farbe möchtest du spielen?");
        // prevent default - no sending without color!
        document.querySelector("farbauswahl").visibility = true;
        document.querySelector("farbauswahl").createElement("input");
        return true;
    } else {
        return false;
    }
}

async function playCard(card, player, color) {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card.Value + "&color=" + card.Color + "&wildColor=" + color, {
        method: 'PUT'
    });

    if (response.ok) {
        let result = await response.json();

        playerTurn = result.Player;
        displayCurrentPlayer(playerTurn);

        topCard = card;
        showTopCard(topCard);

        updateScore(player, card.Score);
    } else {
        alert("HTTP-Error: " + response.status)
    }
}

function displayCurrentPlayer(currentPlayer) {
    const div = document.getElementById("current");
    div.textContent = "Current Player: " + currentPlayer;
    for (let i = 0; i < playerNames.length; i++) {
        document.getElementById(playerNames[i]).classList.remove("selected");
    }
    document.getElementById(currentPlayer).classList.add("selected");
}

function updateScore(player, score) {
    let tempPlayer = playerObjects.find(function(e) {
        return e.Name == player.id;
    });
    tempPlayer.Score -= score;
    player.lastElementChild.textContent = "Points: " + tempPlayer.Score;
}

// Refactoring done till here!

document.getElementById("ziehen").addEventListener("click", function(e) {
    ziehen();
})

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
        cardScore = result.Card.Score;

        if (result.Players == testPlayer.Players) {
            //testPlayer.Players.Score += result.Card.Score;
            console.log(testPlayer.Players.Score);
        }

        console.log(cardScore);
        displayCurrentPlayer(result.NextPlayer);
        //console.log(player.Score);
        //updateScore(document.getElementById(result.Player));
        //updateScore();

        // append card to player
        console.log(document.getElementById(result.Player).nextSibling);
        const img = document.createElement("img");

        console.log(result.Card);



        // img.src = `${baseUrl}${color.slice(0,1)+value}.png`;
        img.src = `images/${result.Card.Color}_${result.Card.Value}.png`;
        // console.log(`images/${color+value}.png`);
        const listElement = document.createElement("li");
        listElement.classList.add("playerCards");
        listElement.addEventListener("click", getCardToPlay);
        document.getElementById(result.Player).nextSibling.appendChild(listElement).appendChild(img);
    } else {
        alert("HTTP-Error: " + response.status)
    }
    //return result.Player;
}

function findCurrentPlayer(result) {
    console.log(result);
}

