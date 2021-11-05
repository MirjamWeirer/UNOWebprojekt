//Show Modal Dialog from Bootstrap - Dialog öffne
let modal = new bootstrap.Modal(document.getElementById("playerName"));
modal.show();

//Spieler*innen Namen
let player = [];

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
        console.log(result);
        // alert(JSON.stringify(result));
    }else{
        alert("HTTP-Error: " + response.status);
    }
}
// hier rufen wir unsere asynchrone funktion auf
// load();

function startGame() {
    load();
}
