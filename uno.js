//------------------------------------------------------------------------------
//  Initial modal for names input
//------------------------------------------------------------------------------
let modal = new bootstrap.Modal(document.getElementById("playerName"));
modal.show();

//------------------------------------------------------------------------------
//  Constructor for card creation
//------------------------------------------------------------------------------
function Card(color, text, value, score) {
    this.Color = color;
    this.Text = text;
    this.Value = value;
    this.Score = score;
}

//------------------------------------------------------------------------------
//  Constructor for player creation
//------------------------------------------------------------------------------
function Player(name, cards = [], score = -1) {
    this.Name = name;
    this.Cards = cards;
    this.Score = score;
}

//------------------------------------------------------------------------------
//  Id of the game (needed for the communication with the server)
//------------------------------------------------------------------------------
let playId;

//------------------------------------------------------------------------------
//  Some additional helper variables
//------------------------------------------------------------------------------
let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let player3 = document.getElementById("player3");
let player4 = document.getElementById("player4");

let playerForm = [];
playerForm.push(player1);
playerForm.push(player2);
playerForm.push(player3);
playerForm.push(player4);

let playerNames = [];
let playerDivs = [];

let pile = document.getElementById("ablegen");

let reverse = 1;
let colorWish;

/* Response data */
let playerNamesForm;
let playerTurn;
let players = [];
let topCard;

let proceed = false;

//------------------------------------------------------------------------------
//  Get the input form for the player names and add event listeners
//------------------------------------------------------------------------------
playerNamesForm = document.getElementById("playerNamesForm");
playerNamesForm.addEventListener("focusout", checkName);
playerNamesForm.addEventListener("submit", submitNames);

//------------------------------------------------------------------------------
//  Check names for duplicates (on focusout)
//------------------------------------------------------------------------------
function checkName(e) {
    let namesArray = [];
    for (let i = 0; i < playerForm.length; i++) {
        if (playerForm[i].id != e.target.id) {
            namesArray.push(playerForm[i].value);
        }
    }

    if (namesArray.includes(e.target.value)) {
        e.target.classList.add("redBorder")
    } else {
        e.target.classList.remove("redBorder");
    }

    let duplicates = namesArray.filter((el, it) => namesArray.indexOf(el) != it);
    if (duplicates.length == 0 && !e.target.classList.contains("redBorder")) {
        for (let i = 0; i < playerForm.length; i++) {
            playerForm[i].classList.remove("redBorder");
        }
    }
}

//------------------------------------------------------------------------------
//  Submit names (on button click)
//  Check again for duplicates before submiting
//  If no duplicates and no empty names - save names, hide modal and start the
//  game. 
//  Otherwise shake animation.
//------------------------------------------------------------------------------
function submitNames(e) {
    e.preventDefault();
    e.target.classList.remove("shakeIt")

    let namesArray = [];
    for (let i = 0; i < playerForm.length; i++) {
        namesArray.push(playerForm[i].value);
    }

    let duplicates = namesArray.filter((el, it) => namesArray.indexOf(el) != it);
    if (duplicates.length == 0) {
        proceed = true;
    }

    if (proceed && player1.value != "" && player2.value != "" && player3.value != "" && player4.value != "") {
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

//------------------------------------------------------------------------------
//  Start game calls the load method and after retreiving its response the 
//  playGame method.
//------------------------------------------------------------------------------
async function startGame() {
    let response = await load();
    playGame(response);
}

//------------------------------------------------------------------------------
//  Load fetches data from the server. If the response from the server is OK,
//  the game may start. 
//  Otherwise a modal with the corresponding error message is shown.
//------------------------------------------------------------------------------
async function load() {
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

//------------------------------------------------------------------------------
//  The greet function retrieves the Welcome Element, toggles the hidden
//  property and starts the greeting animation. 
//  This is also the place where the whole game desk is being shown and
//  floated in via an animation.
//------------------------------------------------------------------------------
function greet() {
    const welcomeMessage = document.getElementById("welcome");
    welcomeMessage.classList.toggle('hiddenElement');
    welcomeMessage.classList.toggle('greeting');

    const desk = document.getElementById("desk");

    setTimeout(function() {
        desk.classList.toggle('hiddenElement');
        desk.classList.toggle('start');
    }, 3000);
}

//------------------------------------------------------------------------------
//  The play game is the initial method after getting first response from the
//  server. 
//  The appropriate players are created and set. 
//  Their cards are mapped.
//  Current player and top card are being saved and methods to show both are
//  invoked.
//------------------------------------------------------------------------------
function playGame(result) {
    playId = result.Id;

    for (let i = 0; i < result.Players.length; i++) {
        let player = result.Players[i];
        players[i] = new Player(player.Player, player.Cards, player.Score);
        mapCards(players[i]);
    }

    playerTurn = players.find(function(e) {
        return e.Name == result.NextPlayer;
    })

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

//------------------------------------------------------------------------------
//  Funciton to get the corresponding div and bringing it up for the 
//  current player. All other players shall stay hidden (or with less
//  opacity in our case).
//------------------------------------------------------------------------------
function displayCurrentPlayer(currentPlayer) {
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

//------------------------------------------------------------------------------
//  Create img if not there, otherwise just change its source.
//------------------------------------------------------------------------------
function showTopCard(topCard) {
    let img;

    if (pile.firstElementChild) {
        img = pile.firstElementChild;
    } else {
        img = document.createElement("img");
        pile.appendChild(img);
    }
    img.src = `images/${topCard.Color}_${topCard.Value}.png`;
}

//------------------------------------------------------------------------------
//  Multipurpose function...
//  This function creates divs for the player info (name and points) and an ul
//  where the player cards are mapped as list elements.
//------------------------------------------------------------------------------
function mapCards(player) {
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

//------------------------------------------------------------------------------
//  Function to add all needed eventListeners to an element (ul).
//  Mousover and out for the cards scaling and click for the chosen card.
//------------------------------------------------------------------------------
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
    e.target.classList.remove("rotate-diagonal-tl");

    let clicked = e.target.closest('li');
    let parentUl = Array.from(e.target.parentNode.parentNode.children);
    let indexOfClicked = parentUl.indexOf(clicked);

    if (e.currentTarget.parentNode.firstElementChild.id != playerTurn.Name) {
        e.preventDefault;

        const body = document.body;
        body.classList.add("box-shadow");
        setTimeout(function() {
            body.classList.remove("box-shadow");
        }, 1000);
    } else {
        if (checkCard(cardToPlay) == true) {
            e.target.classList.add("rotate-diagonal-tl");
            setTimeout(function() {
                e.target.remove(e.target.parentNode);
                e.target.classList.remove("shakrotate-diagonal-tleIt");
            }, 1000);
            removeCardFromArr(indexOfClicked);
            updateMargin(e.currentTarget);
            checkColor(cardToPlay, playerTurn, colorWish);

        } else {
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
        margin = (temp / playerTurn.Cards.length + 1) * (-1);
    }

    for (let i = 0; i < ul.children.length; i++) {
        ul.children[i].style.marginRight = `${margin}px`;
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
    let currPlayer = players.find(function(e) {
        return e.Name == playerTurn.Name;
    })
    if (card.Color == "Black") {
        let foundCard = currPlayer.Cards.find(function(e) {
            return e.Color == topCard.Color;
        })
        if (card.Value == 13 && typeof(foundCard) !== 'undefined') {
            return false;
        }
        if (topCard.Value >= 13 && card.Value >= 13) {
            document.getElementById("errorMessage").firstChild.textContent = "Color has to stay the same";
            let modal = new bootstrap.Modal(document.getElementById("errorModal"));
            modal.show();
            document.getElementById("close").addEventListener("click", function(e) {
                modal.hide();
            });
            return true;
        } else {
            colorWish = "choose";
        }
        return true;
    } else if (topCard.Color == card.Color || topCard.Value == card.Value) {
        colorWish = "";
        return true;
    } else {
        return false;
    }
}

function removeCardFromArr(index) {
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
            } else if (e.target.id == "blue") {
                colorWish = "Blue";
            } else if (e.target.id == "green") {
                colorWish = "Green";
            } else if (e.target.id == "yellow") {
                colorWish = "Yellow";
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
    colorPickerForm = document.getElementById("colorPickerForm");
    colorPickerForm.addEventListener("click", function(e) {
        e.preventDefault;
        if (e.target.id == "red") {
            colorWish = "Red";
        } else if (e.target.id == "blue") {
            colorWish = "Blue";
        } else if (e.target.id == "green") {
            colorWish = "Green";
        } else if (e.target.id == "yellow") {
            colorWish = "Yellow";
        }
    });
    modal.hide();
    return colorWish;
}

async function playCard(card, player, color) {
    let response = await fetch("http://nowaunoweb.azurewebsites.net/api/game/PlayCard/" + playId + "?value=" + card.Value + "&color=" + card.Color + "&wildColor=" + colorWish, {
        method: 'PUT'
    });
    if (response.ok) {
        let result = await response.json();

        if (playerTurn.Name == result.Player) {
            startFirework();
            let loosers = players.filter(function(e) {
                return e.Name != result.Player;
            });
            let points = 0;
            for (let i = 0; i < loosers.length; i++) {
                points += loosers[i].Score;
            }
            document.getElementById("winnerMessage").firstChild.textContent = "Player " + playerTurn.Name + " won with " + points + " points.";

            let modal = new bootstrap.Modal(document.getElementById("winnerModal"));
            modal.show();
            document.getElementById("playAgain").addEventListener("click", function(e) {
                window.location.reload();
                modal.hide();
            });

        }

        if (playerTurn.Cards.length == 1) {
            const unoMessage = document.getElementById("uno");
            unoMessage.classList.remove('hiddenElement');
            unoMessage.classList.add('shoutUno');
        }

        playerTurn = players.find(function(e) {
            return e.Name == result.Player;
        });
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

        let index = players.indexOf(players.find(function(e) {
            return e.Name == playerTurn.Name;
        })) - reverse;

        if (index < 0) {
            index = players.length - 1;
        }
        if (index > players.length - 1) {
            index = 0;
        }

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
    let list = playerDivs.find(function(e) {
        return e.id == player.Name;
    }).parentNode.lastElementChild;

    while (list.firstChild) {
        list.removeChild(list.firstChild);
    }

    let margin = 0;

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
    playerDivs.find(function(e) {
        return e.id == player.Name;
    }).lastElementChild.textContent = "Points: " + player.Score;
}

function updateScoreAfterPlay(score) {
    let indexCurr = players.indexOf(players.find(function(e) {
        return e.Name == playerTurn.Name;
    }));

    let index = indexCurr - reverse;
    index = checkOverflow(index);
    if (topCard.Value == 13 || topCard.Value == 10 || topCard.Value == 11) {
        index = index - reverse;
        index = checkOverflow(index);
    }
    players[index].Score -= score;

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