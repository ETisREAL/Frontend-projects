
// MODEL

const colorThemes = document.querySelectorAll('[name="theme"]')

const startBtn = document.getElementById('start-btn')
const restartBtn = document.getElementById('restart-btn')
const hitBtn = document.getElementById('hit-btn')
const standBtn = document.getElementById('stand-btn')

const dealerIcon = document.querySelector('.dealer-icon');
const dealerMessage = document.querySelector('.dealer-message');
const eventContainer = document.querySelector('.event-container');

let dealerSum = 0;
let playerSum = 0;

const messages = {
    greeting: ['Hi, want to play a round?', '&#129488'],
    play: ['Hit or stand?', '&#128580'],
    win: ['Congratulations, you won!', '&#129297'],
    lose: ['Oh no, you lost', '&#128542'],
    draw: ['Draw', '&#128528'],
    newGame: ['Would you like to play again?', '&#129320'],
    newGreeting: ["Great! Let's go", '&#128522'],
}

let characterIndex = 0;

let dealerAceCount = 0;
let playerAceCount = 0; 

var deck;

let playerHasBlackjack = false;
let dealerHasBlackjack = false;
let playerIsAlive = false;
let dealerIsAlive = false;

let gameOn = false;


function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); 
        let temporaryDeck = deck[i];
        deck[i] = deck[j];
        deck[j] = temporaryDeck;
    }
    //console.log(deck);
}


function getValue(card) {
    let info = card.split("-");
    let value = info[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}


function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}


function reduceAce(sum, aceCount, sumEl) {
    while (sum > 21 && aceCount > 0) {
        sum -= 10;
        aceCount--;
        document.getElementById(sumEl).innerText = 'Sum: ' + sum;
    }
    return sum;
}


// VIEW

window.onload = createMessage('greeting');
window.onload = showBtn('start-btn', 1800);


const rememberTheme = theme => {
    localStorage.setItem('theme', theme);
}

const setTheme = () => {
    const selectedTheme = localStorage.getItem('theme');
    
    colorThemes.forEach(theme => {
        if (theme.id === selectedTheme) {
            theme.checked = true;
        } 
    })
    
    // Fallback in case browser doesn't support :has
    document.documentElement.className = selectedTheme;
}

function showReminder() {

    colorThemes.forEach(theme => {
        theme.setAttribute('disabled', 'true')
    })
    
    document.querySelector('.reminder').style.opacity = 1;

    document.querySelector('.hover-over').addEventListener('mouseout', ()=> {
        document.querySelector('.reminder').style.opacity = 0;
    })
}

colorThemes.forEach(theme => {
    theme.addEventListener('click', () => {
        rememberTheme(theme.id);
        location.reload()
    })

    // Fallback in case browser doesn't support :has
    document.documentElement.className = theme.id;
})

document.querySelector('.hover-over').addEventListener('mouseover', ()=> {
    gameOn ? showReminder() : null
})

window.onload = setTheme();


function hideBtn(button) {
    document.getElementById(button).style.opacity = 0;
    document.getElementById(button).setAttribute('disabled', 'true');
}

function showBtn(button, time) {
    setTimeout(() => {
        document.getElementById(button).style.opacity = 1;
        document.getElementById(button).removeAttribute('disabled');
    }, time);
}


function startGame() {

    gameOn = true;

    hideBtn('start-btn')
    showBtn('hit-btn', 500)
    showBtn('stand-btn', 500)
    
    buildDeck();
    createMessage('play');

    playerIsAlive = true;
    dealerIsAlive = true;

    shuffleDeck();

    let card = deck.pop();
    dealerSum += getValue(card);
    dealerAceCount += checkAce(card);
    document.getElementById("dealer-sum-el").innerText = 'Sum: '+dealerSum;
    let cardImg = document.createElement("img");
    cardImg.src = "./deck/" + card + ".png";
    document.getElementById("dealer-cards").append(cardImg);

    for (let i = 0; i < 2; i++) {
        let card = deck.pop();
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-sum-el").innerText = 'Sum: '+playerSum;
        let cardImg = document.createElement("img");
        cardImg.src = "./deck/" + card + ".png";
        document.getElementById("player-cards").append(cardImg);

        if (playerSum === 21) {
            playerHasBlackjack = true;
            document.querySelector('.event-container').textContent='Blackjack!'
            playerIsAlive = false;
            finishGame()}
    }

}


function createMessage(message) {
    dealerIcon.innerHTML = messages[message][1];
    
    const renderInterval = setInterval(() => {
        characterIndex++;
        
        dealerMessage.innerHTML = `
        ${messages[message][0].slice(0, characterIndex)}
        `;
        
        if (characterIndex === messages[message][0].length) {
            characterIndex = 0;
            clearInterval(renderInterval)
        }
    }, 50);
}


function renderAfter2Second(){
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(createMessage('newGame'))
        }, 2500);
    });
}


async function renderMessage(result){
    createMessage(result);
    await renderAfter2Second();
}


// CONTROL

function hit() {
    if (playerIsAlive) {
        let card = deck.pop();
        playerSum += getValue(card);
        playerAceCount += checkAce(card);
        document.getElementById("player-sum-el").innerText = 'Sum: '+playerSum;
        let cardImg = document.createElement("img");
        cardImg.src = "./deck/" + card + ".png";
        document.getElementById("player-cards").append(cardImg);

    }
    
    if (reduceAce(playerSum, playerAceCount, 'player-sum-el') >= 21) {
        playerIsAlive = false;
        finishGame()
    }
}

function finishGame() {

    hideBtn('hit-btn')
    hideBtn('stand-btn')

    playerIsAlive = false;
    
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-sum-el").innerText = 'Sum: '+ dealerSum;
        cardImg.src = "./deck/" + card + ".png";
        document.getElementById("dealer-cards").append(cardImg);
    }
    
    dealerSum = reduceAce(dealerSum, dealerAceCount, 'dealer-sum-el');
    
    result();
    showBtn('restart-btn', 4000)
}


function result() {

    if (playerSum === 21) {
        //createMessage('win')
        renderMessage('win')
    } else if (playerSum <= 21 && playerSum > dealerSum && dealerSum <= 21) {
        //createMessage('win')
        renderMessage('win')
        
    } else if (playerSum <= 21 && dealerSum > 21) {
        //createMessage('win')
        renderMessage('win')

    } else if (playerSum === dealerSum && playerSum <= 21 && dealerSum <= 21) {
        //createMessage('draw')
        renderMessage('draw')

    } else {
        //createMessage('lose')
        renderMessage('lose')
    }
}

function restart() {

    playerSum = 0;
    playerAceCount = 0;
    dealerSum = 0;
    dealerAceCount = 0;

    document.getElementById('player-sum-el').textContent = '';
    document.getElementById('dealer-sum-el').textContent = '';
    document.getElementById('player-cards').innerHTML = '';
    document.getElementById('dealer-cards').innerHTML = '';

    eventContainer.textContent = '';
    createMessage('newGreeting');

    showBtn('start-btn', 1500);
    hideBtn('restart-btn');
    }