const baseUrl = "http://nowaunoweb.azurewebsites.net/Content/Cards/";
let playId;
let topCard = [];
let cardScore;
// beamer resolution: 1200 x 800

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

let playerObjects = [];

//Show Modal Dialog from Bootstrap - Dialog öffne
let modal = new bootstrap.Modal(document.getElementById("playerName"));
modal.show();

//Spieler*innen Namen
let player = [];
let playerDivs = [];
let playerDivCombo = [];
let playerValue = [];
let player1Score;
let player2Score;
let player3Score;
let player4Score;
//let testPlayer = new Object;
let player1field = document.getElementById("player1cards");

document.getElementById("playerNamesForm").addEventListener("keyup", checkName);

function checkName(value) {
    if (document.getElementById("player1").value == document.getElementById("player2").value) {
        document.getElementById("player2").value = "";
    } else if (document.getElementById("player1").value == document.getElementById("player3").value ||
        document.getElementById("player2").value == document.getElaementById("player3").value) {
        document.getElementById("player3").value = "";
    } else if (document.getElementById("player1").value == document.getElementById("player4").value ||
        document.getElementById("player2").value == document.getElementById("player4").value ||
        document.getElementById("player3").value == document.getElementById("player4").value) {
        document.getElementById("player4").value = "";
    }
}

document.getElementById("playerNamesForm").addEventListener("submit", function(e) {
    e.preventDefault();
    if (document.getElementById("player1").value != "" && document.getElementById("player2").value != "" && document.getElementById("player3").value != "" && document.getElementById("player4").value != "") {
        player.push(document.getElementById("player1").value);
        player.push(document.getElementById("player2").value);
        player.push(document.getElementById("player3").value);
        player.push(document.getElementById("player4").value);

        playerObjects.push(new Player(document.getElementById("player1").value));
        playerObjects.push(new Player(document.getElementById("player2").value));
        playerObjects.push(new Player(document.getElementById("player3").value));
        playerObjects.push(new Player(document.getElementById("player4").value));

        // für das austeilen der karten
        playerDivs.push(document.getElementById("player1cards"));
        playerDivs.push(document.getElementById("player2cards"));
        playerDivs.push(document.getElementById("player3cards"));
        playerDivs.push(document.getElementById("player4cards"));


        // for (let i = 0; i < player.length; i++) {
        //    playerDivCombo[i].push(player[i], playerDivs[i]);
        // }

        console.log(player.length)
        console.log(player);

        modal.hide();
        document.getElementById("desk").style.visibility = 'visible';
        startGame();
    } else {
        // Some action to prevent sending an empty name
    }
})

async function load() {
    // hier starten wir gleich den request
    // warten auf das promise (alternativ fetch, then notation)
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start", {
        method: 'POST',
        body: JSON.stringify(player),
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
        console.log(result);
        testPlayer = result.Players;
        console.log(testPlayer);


        // alert(JSON.stringify(result));
    } else {
        alert("HTTP-Error: " + response.status);
    }
}
// hier rufen wir unsere asynchrone funktion auf
// load();

// Game/PlayCard/{id}?value={value}&color={color}&wildColor={wildColor}
async function playCard(card, player) {
    console.log("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card[1] + "&color=" + card[0] + "&wildColor=")
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card[1] + "&color=" + card[0] + "&wildColor=", {
        method: 'PUT'
    });

    if (response.ok) {
        let result = await response.json();
        console.log("playcard")
        console.log(result);
        displayCurrentPlayer(result.Player);
        showTopCard(card[0], card[1]);
        updateScore(player);
    } else {
        alert("HTTP-Error: " + response.status)
    }
}

function startGame() {
    load();
}

function playGame(result) {
    console.log(result);
    console.log(result.Players[0].Cards);
    console.log(result.Players[0].Cards[0]);
    console.log(result.Players[0].Cards[0].Color);
    console.log(result.Players[0].Cards[0].Color[0]);
    //console.log(result.Players[0].Score);
    player1Score = result.Players[0].Score;
    player2Score = result.Players[1].Score;
    player3Score = result.Players[2].Score;
    player4Score = result.Players[3].Score;

    playerObjects[0].Score = result.Players[0].Score;
    playerObjects[1].Score = result.Players[1].Score;
    playerObjects[2].Score = result.Players[2].Score;
    playerObjects[3].Score = result.Players[3].Score;

    console.log(player1Score);

    showTopCard(result.TopCard.Color, result.TopCard.Value);

    for (let i = 0; i < player.length; i++) {
        mapCards(result.Players[i]);
    }

    console.log(result.NextPlayer);

    displayCurrentPlayer(result.NextPlayer);




    // think of sth like this:
    // for (let i = 0; i < player.length; i++) {
    //     mapCards(result.Players[i].Cards, i)
    // }
}

function displayCurrentPlayer(currentPlayer) {
    const div = document.getElementById("current");
    div.textContent = "Current Player: " + currentPlayer;
    for (let i = 0; i < player.length; i++) {
        let temp = document.getElementById(player[i]).classList.remove("selected");
    }
    const temp = document.getElementById(currentPlayer).classList.add("selected");
}

function showTopCard(Color, Value) {
    // diesen code teil auslagern? gleich wie in map
    //topCard = [Color] + "_" + [Value];
    topCard.push(Color);
    topCard.push("_");
    topCard.push(Value);
    let img;
    console.log(document.getElementById("ablegen"));
    if (document.getElementById("ablegen").firstElementChild) {
        console.log(document.getElementById("ablegen").firstElementChild);
        img = document.getElementById("ablegen").firstElementChild;
    } else {
        img = document.createElement("img");
        const ablegen = document.getElementById("ablegen").appendChild(img);
    }
    img.src = `images/${Color}_${Value}.png`;
    //img.classList.add("overlay")
    ablegen.classList.add("playerDivs");
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
    }
}

function mapCards(player) {
    //console.log(player);
    const div = document.createElement("div");
    //div.id = player.Player;
    div.classList.add("playerDivs");

    const playerInfo = document.createElement("div");
    playerInfo.id = player.Player;

    playerInfo.classList.add("card");
    // playerInfo.classList.add("card-padded")
    const nameOfPlayer = document.createElement("h6");
    nameOfPlayer.textContent = player.Player;
    const points = document.createElement("h7");
    points.textContent = "Points: " + player.Score;
    //console.log(playerScore);
    div.appendChild(playerInfo);
    playerInfo.appendChild(nameOfPlayer);
    playerInfo.appendChild(points);

    const ul = document.createElement("ul");
    const appending = document.querySelector("#playground").appendChild(div).appendChild(ul);

    ul.addEventListener("mouseover", function(e) {
        // returns -1 (not working)
        // const index = Array.from(document.getElementsByTagName("li")).findIndex(el => el.innerHTML == e.target);
        // console.log(index);
        if (e.target != e.currentTarget) {
            e.target.classList.toggle("mouseOver");
        }

    })

    ul.addEventListener("mouseout", function(e) {
        // returns -1 (not working)
        // const index = Array.from(document.getElementsByTagName("li")).findIndex(el => el.innerHTML == e.target);
        // console.log(index);
        if (e.target != e.currentTarget) {
            e.target.classList.toggle("mouseOver");
        }
    })

    ul.addEventListener("click", getCardToPlay)

    return player.Cards.map(function(el) {
        const img = document.createElement("img");
        let color = switchColor(el.Color);


        // img.src = `${baseUrl}${color.slice(0,1)+value}.png`;
        img.src = `images/${el.Color}_${el.Value}.png`;
        // console.log(`images/${color+value}.png`);
        const listElement = document.createElement("li");
        listElement.classList.add("playerCards");
        const list = appending.appendChild(listElement).appendChild(img);

        // add event listener auf ul


    })
}


function getCardToPlay(e) {
    console.log(e.target.src);
    console.log(e.target);
    console.log(e.currentTarget);
    console.log(e.target.src.split("/"));
    let arr = e.target.src.split("/");
    console.log(arr.length - 1)
    const card = arr[arr.length - 1].split(".")[0].split("_");
    console.log(e.target);
    console.log(e.currentTarget);
    if (checkCard(card[0], card[1]) == true) {
        playCard(arr[arr.length - 1].split(".")[0].split("_"), e.currentTarget.parentNode.firstElementChild);
        // GetCards/{id}?playerName={playerName}
        e.currentTarget.removeChild(e.target.parentNode);
        console.log(e.currentTarget.parentNode.firstElementChild);
        // updateScore(e.currentTarget.parentNode.firstElementChild);
        topCard = [];
        if (card[0] == "Black") {
            playCard(arr[arr.length - 1].split(".")[0].split("_"))
        }
    }


    // returns -1 (not working)
    // const index = Array.from(document.getElementsByTagName("li")).findIndex(el => el.innerHTML == e.target);
    // console.log(index);
}
/*if (ziehen()) {
    player.Score += Card.Score;
    console.log(player.Score);
} else {
    player.Score -= Card.Score;
    console.log(player.Score);
}
function updateScore() {
    console.log(playerScore);
    console.log(cardScore);
}
*/

async function updateScore(player) {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/GetCards/" + playId + "?playerName=" + player.id, {
        method: 'GET'
    });

    console.log("update")
    console.log(player);
    console.log(player.lastElementChild);

    if (response.ok) {
        let result = await response.json();
        console.log(player.lastElementChild.textContent);
        console.log(result.Score);
        player.lastElementChild.textContent = "Points: " + result.Score;
    }


}




function checkCard(color, value) {
    console.log(topCard);
    console.log(color);
    console.log(value);
    if (topCard[0] == color || topCard[2] == value) {
        return true;
    } else if (color == "Black") {
        alert("Welche Farbe möchtest du spielen?");
        document.querySelector("farbauswahl").visibility = true;
        document.querySelector("farbauswahl").createElement("input");
        return true;
    } else {
        return false;
    }
}

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