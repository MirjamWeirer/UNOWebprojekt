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
        if (topCard.Value >= 13 && card.Value == 13) {
            alert("Color has to stay the same");
            colorWish = topCard.Color;
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
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card.Value + "&color=" + card.Color + "&wildColor=" + colorWish, {
        method: 'PUT'
    });

    if (response.ok) {
        let result = await response.json();

        console.log(result);

        if (playerTurn.Name == result.Player) {
            console.log("end of game");
        }

        if (result.Cards.length == 0) {
            console.log("end of game 2");
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

        console.log("---" + player);

        updateScoreAfterPlay(player, card.Score);

        if (card.Value == 12) {
            reverse *= -1;
        }

        if (card.Value == 13 || card.Value == 10) {
            let index = players.indexOf(players.find(function(e) {
                return e.Name == player.Name;
            })) + reverse;            

            if (index < 0) {
                index = players.length - 1;
            }
            if (index > players.length - 1) {
                index = 0;
            }

            let tempPlayer = players[index];
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
    console.log(player);
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/GetCards/" + playId + "?playerName=" + player.Name, {
        method: 'GET'
    });

    if (response.ok) {
        let result = await response.json();
        diffCards = player.Cards.slice();
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

    while(list.firstChild) {
        list.removeChild(list.firstChild);
    }

    console.log(player.Cards);

    for (let i = 0; i < player.Cards.length; i++) {
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
    console.log(player);
    let tempPlayer = players.find(function(e) {
        return e.Name == player.Name;
    });
    console.log(player);
    console.log(score);
    console.log(tempPlayer);
    tempPlayer.Score -= score;
    playerDivs.find(function(e) {
        return e.id == player.Name;
    }).lastElementChild.textContent = "Points: " + tempPlayer.Score;
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
        diffCards = tempPlayer.Cards.slice();
        updatePlayerAfterDraw(tempPlayer, result.Card);
        updateCardsAfterDraw(tempPlayer);
        updateScoreAfterDraw(tempPlayer);        

        playerTurn = players.find(function(e) {
            return e.Name == result.NextPlayer;
        });
        displayCurrentPlayer(playerTurn);
    } else {
        alert("HTTP-Error: " + response.status)
    }
    //return result.Player;
}

function updatePlayerAfterDraw(player, card) {
    console.log("updatePlayerAfterDraw");
    player.Cards.push(new Card(card.Color, card.Text, card.Value, card.Score));
    player.Score += card.Score;
}

function makeItFire() {
    const particles = [];
	const color = randomColor();
	
	const particle = document.createElement('span');
	particle.classList.add('particle', 'move');
	
	const { x, y } = randomLocation();
	particle.style.setProperty('--x', x);
	particle.style.setProperty('--y', y);
	particle.style.background = color;
	btn.style.background = color;
	
	btn.appendChild(particle);
	
	particles.push(particle);
	
	setTimeout(() => {
	
		for(let i=0; i<100; i++) {
			const innerP = document.createElement('span');
			innerP.classList.add('particle', 'move');
			innerP.style.transform = `translate(${x}, ${y})`;

			const xs = Math.random() * 200 - 100 + 'px';
			const ys = Math.random() * 200 - 100 + 'px';
			innerP.style.setProperty('--x', `calc(${x} + ${xs})`);
			innerP.style.setProperty('--y', `calc(${y} + ${ys})`);
			innerP.style.animationDuration = Math.random() * 300 + 200 + 'ms';
			innerP.style.background = color;
			
			btn.appendChild(innerP);
			particles.push(innerP)
		}
		
		setTimeout(() => {
			particles.forEach(particle => {
				particle.remove();
			})
		}, 1000)
	}, 1000);
}

function randomLocation() {
	return {
		x: Math.random() * window.innerWidth - window.innerWidth / 2 + 'px',
		y: Math.random() * window.innerHeight - window.innerHeight / 2 + 'px',
	}
}

function randomColor() {
	return `hsl(${Math.floor(Math.random() * 361)}, 100%, 50%)`;
}