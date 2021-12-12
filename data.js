function Card(color, text, value, score) {
    this.Color = color;
    this.Text = text;
    this.Value = value;
    this.Score = score;
}

function Player(name, cards = [], score = -1) {
    this.Name = name;
    this.Cards = cards;
    this.Score = score;
}

let playId;

let player1 = document.getElementById("player1");
let player2 = document.getElementById("player2");
let player3 = document.getElementById("player3");
let player4 = document.getElementById("player4");

let playerNames = [];
let playerDivs = [];

let diffCards = [];

let pile = document.getElementById("ablegen");

let reverse = 1;
let colorWish;

/* Response data */
let playerNamesForm;
let playerTurn;
let players = [];
let topCard;