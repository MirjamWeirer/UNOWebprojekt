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
    } else {

    }
}

document.getElementById("play").addEventListener("submit", function(modal) {
    player.push = document.getElementById("player1").value;
    player.push = document.getElementById("player2").value;
    player.push = document.getElementById("player3").value;
    player.push = document.getElementById("player4").value;
    console.log(player);
    modal.hid();
})