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
let reverse = 1;

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

        modal.hide();
        document.getElementById("desk").style.visibility = 'visible';
        startGame();
    } else {
        // Some action to prevent sending an empty name
    }
})

async function startGame() {
    let response = await load();
    playId = response.Id;
    console.log("Id: " + playId);
    playGame(response);
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
        return result;
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
    pile.classList.add("playerDivs");
}

function mapCards(player) {
    const div = document.createElement("div");
    div.classList.add("playerDivs");
    // playerDivs.push(div);

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
    let arr = e.target.src.split("/");
    const card = arr[arr.length - 1].split(".")[0].split("_");
    const cardScore = mapCardScore(card[0], card[1]);
    const cardToPlay = new Card(card[0], "", card[1], cardScore);

    if (e.currentTarget.parentNode.firstElementChild.id != playerTurn) {
        e.preventDefault;
        // animation?
        console.log("not your turn");
    } else {
        if (checkCard(cardToPlay) == true) {
            playCard(cardToPlay, e.currentTarget.parentNode.firstElementChild, colorWish);
            e.currentTarget.removeChild(e.target.parentNode);
            // topCard = [];
        }
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
        console.log(colorWish);
        /*let color = switchColor(colorWish);
        let img; // = document.createElement("img");
        if (color == "Red" && card.Value == 13) {
            img.src = `images/Red13.png`;

        } else if (color == "Red") {
            img.src = `images/wild_r.png`;
            console.log(img);
        }
        if (color == "Blue" && card.Value == 13) {
            img.src = `images/Blue13.png`;
        } else if (color == "Blue") {
            img.src = `images/wild_b.png`;
            console.log(img);
        }
        if (color == "Yellow" && card.Value == 13) {
            img.src = `images/Yellow13.png`;
        } else if (color == "Yellow") {
            img.src = `images/wild_y.png`;
            console.log(img);
        }
        if (color == "Green" && card.Value == 13) {
            img.src = `images/Green13.png`;
        } else if (color == "Green") {
            img.src = `images/wild_g.png`;
            console.log(img);
        }
        if (pile.firstElementChild) {
            img = pile.firstElementChild;
        } else {
            img = document.createElement("img");
            pile.appendChild(img);
        }
        if (pile.firstElementChild) {
            img = pile.appendChild(img);
        }*/
        // prevent default - no sending without color!
        //document.querySelector("farbauswahl").visibility = true;
        //document.querySelector("farbauswahl").createElement("input");
        return true;
    } else {
        return false;
    }
}

function switchColor(color) {
    switch (color) {
        case 'R':
            return "Red";
        case 'B':
            return "Blue";
        case 'Y':
            return "Yellow";
        case 'G':
            return "Green";
        case 'Rot':
            return "Red";
        case 'Blau':
            return "Blue";
        case 'Gelb':
            return "Yellow";
        case "Grün":
            return "Green";
        case 'rot':
            return "Red";
        case 'blau':
            return "Blue";
        case 'gelb':
            return "Yellow";
        case "grün":
            return "Green";
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

        console.log("play card");
        console.log(result.Cards);
        console.log(playerObjects.find(function(e) {
            return e.Name == result.Player;
        }).Cards);
        console.log(color)
        if (color != '') {
            color = switchColor(color);
            card.Color = color;

        }
        topCard = card;
        showTopCard(topCard);

        updateScoreAfterPlay(player, card.Score);

        if (card.Value == 12) {
            reverse *= -1;
        }

        if (card.Score == 50 || card.Value == 10) {
            let index = playerObjects.indexOf(playerObjects.find(function(e) {
                return e.Name == player.id;
            })) + reverse;

            if (index < 0) {
                index = playerObjects.length - 1;
            }
            if (index > playerObjects.length - 1) {
                index = 0;
            }

            let tempPlayer = playerObjects[index];
            updateCards(tempPlayer);
        }
    } else {
        alert("HTTP-Error: " + response.status)
    }
}

async function updateCards(player) {
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

function displayCurrentPlayer(currentPlayer) {
    const div = document.getElementById("current");
    div.textContent = "Current Player: " + currentPlayer;
    for (let i = 0; i < playerNames.length; i++) {
        document.getElementById(playerNames[i]).classList.remove("selected");
        /*
        hideCards(playerObjects.find(function(e) {
            return e.Name == playerNames[i];
        }));
        */
    }
    document.getElementById(currentPlayer).classList.add("selected");
    // showCards(currentPlayer);
}

function showCards(player) {
    let temp = playerDivs.find(function(e) {
        return e.id == player;
    });

    let tempPlayer = playerObjects.find(function(e) {
        return e.Name == player;
    });

    for (let i = 0; i < tempPlayer.Cards.length; i++) {
        temp.parentNode.lastElementChild.children[i].firstElementChild.src = `images/${tempPlayer.Cards[i].Color}_${tempPlayer.Cards[i].Value}.png`;
    }
}

function hideCards(player) {
    let temp = playerDivs.find(function(e) {
        return e.id == player.Name;
    });

    for (let i = 0; i < player.Cards.length; i++) {
        temp.parentNode.lastElementChild.children[i].firstElementChild.src = `images/back0.png`;
    }
}

function updateCardsAfterDraw(player) {
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
    playerDivs.find(function(e) {
        return e.id == player.Name;
    }).lastElementChild.textContent = "Points: " + player.Score;
}

function updateScoreAfterPlay(player, score) {
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
        let tempPlayer = result.Player;
        console.log("ziehen")
        console.log(result);
        console.log(result.Player);
        //console.log(testPlayer.Score);
        //console.log(result.Card.Score);
        cardScore = result.Card.Score;

        if (result.Player == tempPlayer) {
            for (let i = 0; i < playerObjects.length; i++) {
                if (result.Player == playerObjects[i].Name) {

                    playerObjects[i].Score += cardScore;
                    console.log(playerObjects[i].Score);
                    playerDivs.find(function(e) {
                        return e.id == playerObjects[i].Name;
                    }).lastElementChild.textContent = "Points: " + playerObjects[i].Score;

                    //playerDivs.lastElementChild.textContent = "Points: " + playerObjects[i].Score;

                }
            }

            playerTurn = result.NextPlayer;
            //tempPlayer = tempPlayer + testScore;
            // updateScoreAfterDraw(result.Player);
            //console.log(tempPlayer.Score);

        }

        displayCurrentPlayer(result.NextPlayer);

        // append card to player
        console.log(document.getElementById(result.Player).nextSibling);
        const img = document.createElement("img");

        console.log(result.Card);



        img.src = `images/${result.Card.Color}_${result.Card.Value}.png`;
        const listElement = document.createElement("li");
        listElement.classList.add("playerCards");
        document.getElementById(result.Player).nextSibling.appendChild(listElement).appendChild(img);
    } else {
        alert("HTTP-Error: " + response.status)
    }
    //return result.Player;
}

function findCurrentPlayer(result) {
    console.log(result);
}