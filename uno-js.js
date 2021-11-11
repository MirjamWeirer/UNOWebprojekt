const baseUrl = "http://nowaunoweb.azurewebsites.net/Content/Cards/";
let playId;

// beamer resolution: 1200 x 800

//Show Modal Dialog from Bootstrap - Dialog öffne
let modal = new bootstrap.Modal(document.getElementById("playerName"));
modal.show();

//Spieler*innen Namen
let player = [];
let playerDivs = [];
let playerDivCombo = [];

let player1field = document.getElementById("player1cards");

document.getElementById("playerNamesForm").addEventListener("keyup", checkName);

function checkName(value) {
    if (document.getElementById("player1").value == document.getElementById("player2").value) {
        document.getElementById("player2").value = "";
    } else if (document.getElementById("player1").value == document.getElementById("player3").value ||
        document.getElementById("player2").value == document.getElementById("player3").value) {
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
        document.getElementById("desk").style.visibility='visible';
        startGame();
    } else {
        // Some action to prevent sending an empty name
    }
})

async function load(){
    // hier starten wir gleich den request
    // warten auf das promise (alternativ fetch, then notation)
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/start",{
        method: 'POST',
        body: JSON.stringify(player),
        headers: {
            'Content-type': 'application/json; charset=UTF-8',
        }
    });

    // dieser code wird erst ausgeführt wenn fetch fertig ist
    if(response.ok){ // wenn http-status zwischen 200 und 299 liegt
        // wir lesen den response body 
        let result = await response.json(); // alternativ response.text wenn nicht json gewünscht ist
        playId = result.Id;
        playGame(result);
        // console.log(result);
        // alert(JSON.stringify(result));
    }else{
        alert("HTTP-Error: " + response.status);
    }
}
// hier rufen wir unsere asynchrone funktion auf
// load();

// Game/PlayCard/{id}?value={value}&color={color}&wildColor={wildColor}
async function playCard(card) {
    console.log("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card[1] + "&color=" + card[0] + "&wildColor=")
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card[1] + "&color=" + card[0] + "&wildColor=", {
        method: 'PUT'
    });

    if (response.ok) {
        let result = await response.json();
        console.log(result);
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

    showTopCard(result.TopCard);

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

function displayCurrentPlayer(player) {
    const div = document.getElementById("current");
    div.textContent = "Current Player: " + player;
}

function showTopCard(card) {
    // diesen code teil auslagern? gleich wie in map
    const img = document.createElement("img");

    img.src = `images/${card.Color}_${card.Value}.png`;
    const ablegen = document.getElementById("ablegen").appendChild(img);
    ablegen.classList.add("playerDivs");
    ablegen.id = "ziehen-ablegen"
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
    const div = document.createElement("div");
    div.id = player.Player;
    div.classList.add("playerDivs");

    const playerInfo = document.createElement("div");
    playerInfo.classList.add("card");
    // playerInfo.classList.add("card-padded")
    const nameOfPlayer = document.createElement("h6");
    nameOfPlayer.textContent = player.Player;
    const points = document.createElement("h7");
    points.textContent = "Points: " + player.Score;
    div.appendChild(playerInfo);
    playerInfo.appendChild(nameOfPlayer);
    playerInfo.appendChild(points);

    const ul = document.createElement("ul");
    const appending = document.querySelector("#playground").appendChild(div).appendChild(ul);

    return player.Cards.map(function(el) {
        const img = document.createElement("img");
        let color = switchColor(el.Color);
        

        // img.src = `${baseUrl}${color.slice(0,1)+value}.png`;
        img.src = `images/${el.Color}_${el.Value}.png`;
        // console.log(`images/${color+value}.png`);
        const listElement = document.createElement("li");
        listElement.classList.add("playerCards");
        const list = appending.appendChild(listElement).appendChild(img);

        listElement.addEventListener("mouseover", function(e) {
            // returns -1 (not working)
            // const index = Array.from(document.getElementsByTagName("li")).findIndex(el => el.innerHTML == e.target);
            // console.log(index);
            e.target.classList.toggle("mouseOver");
        })
    
        listElement.addEventListener("mouseout", function(e) {
            // returns -1 (not working)
            // const index = Array.from(document.getElementsByTagName("li")).findIndex(el => el.innerHTML == e.target);
            // console.log(index);
            e.target.classList.toggle("mouseOver");
        })

        listElement.addEventListener("click", function(e) {
            console.log(e.target.src);
            console.log(e.target.src.split("/"));
            let arr = e.target.src.split("/");
            console.log(arr.length-1)
            console.log(arr[arr.length-1].split(".")[0].split("_"));
            console.log(e.target);
            console.log(e.currentTarget);

            playCard(arr[arr.length-1].split(".")[0].split("_"));
            // returns -1 (not working)
            // const index = Array.from(document.getElementsByTagName("li")).findIndex(el => el.innerHTML == e.target);
            // console.log(index);
        })
    })
}

