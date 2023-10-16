const coverBlock = document.getElementById('cover');
const gameContainer = document.getElementById('game-container');
const scoreField = document.getElementById('score-field');

const p1TurnSelector = document.createElement('div');
p1TurnSelector.className = 'p1-turn-selector hide';
const p2TurnSelector = document.createElement('div');
p2TurnSelector.className = 'p2-turn-selector hide';

let player1Score = 0;
let player2Score = 0;

function showScore(p1, p2) {
    
    const p1value = p1 == 0 ? '' : p1;
    const p2value = p2 == 0 ? '' : p2;
    
    scoreField.innerHTML = `<table>
                                <tr>
                                    <td>Player:</td>
                                    <td></td>
                                    <td>${player1Score}</td>
                                    <td class='p1-result'>${p1value}</td>
                                </tr>
                                <tr>
                                    <td>Computer:</td>
                                    <td></td>
                                    <td>${player2Score}</td>
                                    <td class='p2-result'>${p2value}</td>
                                </tr>
                            </table>`;
    
    setTimeout(()=> {
        document.querySelector('.p1-result').classList.add('hide');
        document.querySelector('.p2-result').classList.add('hide');
    }, 500);                       
}

showScore(0, 0);

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCardDeck(minValue, maxValue) {
    let tempDeck = [];
    for (let i = minValue; i <= maxValue; i++) {
        tempDeck.push(i);
    }
    return tempDeck;
}

let cardDeck = createCardDeck(10, 99);
shuffleArray(cardDeck);


function takeValueForCard(card) {
    if (cardDeck.length != 0) {
        card.innerText = cardDeck[0];
        cardDeck.shift();
    } else {
        card.innerText = 0;
    }
}

function createCard(side) {
    const card = document.createElement('div');
    card.className = `card ${side}`;
    takeValueForCard(card);
    card.addEventListener('mousedown', onMouseDown);
   
    return card;
}

function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
}

function getRandomSide() {
    let sideNumber = Math.floor(Math.random() * 2);
    return sideNumber = sideNumber == 0 ? 'player1' : 'player2';
}

let currentCard = null;
let currentValue = null;

let firstCard = null;
let secondCard = null;

let firstTake = null;
let secondTake = null;

let sideTurn = getRandomSide();

function onMouseDown(event) {

    if (event.target.classList[1] == sideTurn) {

        currentCard = event.target;
        currentValue = parseInt(currentCard.innerText);
        currentCard.style.zIndex = 1;
        
        const onMouseMove = (e) => {
            if (
                e.clientX > event.clientX + 50 ||
                e.clientX < event.clientX - 50 ||
                e.clientY > event.clientY + 50 ||
                e.clientY < event.clientY - 50
                ) {
                    
                    firstCard = currentCard;
                    firstTake = currentCard.classList[1];
                
                    currentCard == null;
                    sideTurn == null;

            }
            currentCard.style.transform = 'translate(' + (e.clientX - event.clientX) + 'px, ' + (e.clientY - event.clientY) + 'px)';
            // console.log(e.clientY);
        };
        
        const onMouseUp = (ev) => {
            currentCard.style.zIndex = '';
            currentCard.style.transform = '';
            currentCard == null;
            
            if (ev.clientY < 280) {
                sideTurn = sideTurn == 'player1' ? 'player2' : 'player1';
            }
            
            document.addEventListener('mouseover', onMouseOver);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
        };
        
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    }
    
}

function onMouseOver(event) {

    if (firstCard !== null) {

        if (event.target.classList.contains('card')) {
            secondCard = event.target;
            secondTake = secondCard.classList[1];
            let newValue = parseInt(secondCard.innerText);
            if (firstCard !== null && firstCard !== secondCard && secondCard !== null && firstTake != secondTake) {
                
                checkScore(firstTake, currentValue, newValue );
                firstCard.classList.add('hide');
                secondCard.classList.add('hide');
            }
            secondCard = null;
        }
    }

    firstCard = null;
    currentValue = null;
    
    document.removeEventListener('mouseover', onMouseOver);
}

function newCards(card1, card2, time) {
    if (cardDeck.length > 0) {
        coverBlock.style.zIndex = 1;
        setTimeout(() => {
            takeValueForCard(card1);
            takeValueForCard(card2);
            card1.classList.remove('hide');
            card2.classList.remove('hide');
            coverBlock.style.zIndex = -1;

            checkTurn();
            
        }, time);
    } else {
        gameOverScreen();
    }
}

function checkTurn() {
    if (sideTurn =='player2') {
        p1TurnSelector.classList.remove('hide');
        p2TurnSelector.classList.add('hide');
    } else if (sideTurn =='player1'){
        p2TurnSelector.classList.remove('hide');
        p1TurnSelector.classList.add('hide');
        setTimeout(() => {
            aiPlayerTurn();
        }, 1000);
    }
}

function scoreCalculating(resultValue) {
    let result = resultValue < 0 ? `${resultValue}` : `+${resultValue}`;
    result = resultValue == 0 ? 0 : result;
    return result;
}

function checkScore(firstTake, currentValue, newValue) {
    const result = currentValue-newValue;
    const pointsValue = scoreCalculating(result);
    if (firstTake == 'player2') {
        player1Score += result;
        showScore(pointsValue, 0);
    } else {
        player2Score += result;
        showScore(0, pointsValue);
    }
    newCards(firstCard, secondCard, 1000);
}

function gameOverScreen() {
    coverBlock.style.zIndex = 1;
    coverBlock.style.backgroundColor = 'white';

    const gameOverText = document.createElement('div');
    gameOverText.className = 'game-over-screen';

    let winner = (player1Score > player2Score) ? 'Player 1 wins!' : "Player 2 wins";
    gameOverText.innerHTML = winner;

    const restartButton = document.createElement('button');
    restartButton.className = 'restart-button';
    restartButton.textContent = 'Restart';
    restartButton.addEventListener('click', ()=> {
        location.reload();
    });

    coverBlock.appendChild(gameOverText);
    coverBlock.appendChild(restartButton);
}

function animateCardMove(card, card2, startX, startY, endX, endY) {
    card.style.transition = 'transform 0.5s';
    card.style.transform = `translate(${endX - startX}px, ${endY - startY}px)`;

    card.addEventListener('transitionend', function () {
        card.style.transition = '';
        card.style.transform = '';
        card.classList.add('hide');
        card2.classList.add('hide');
    }, { once: true });
}

let animateStartX = 0;
let animateStartY = 0;
let animateEndX = 0;
let animateEndY = 0;

function aiPlayerTurn() {
    const aiCards = document.querySelectorAll('.card.player1:not(.hide)');
    const player1Cards = document.querySelectorAll('.card.player2:not(.hide)');

    let aiCard = null;
    let playerCard = null;
    let aiMaxCard = null;
    let player1MinCard = null;

    aiCards.forEach((card) => {
        const cardValue = parseInt(card.innerText);
        if (aiMaxCard === null || cardValue > aiMaxCard) {
            aiMaxCard = cardValue;
            aiCard = card;
        }
    });

    player1Cards.forEach((card) => {
        const cardValue = parseInt(card.innerText);
        if (player1MinCard === null || cardValue < player1MinCard) {
            player1MinCard = cardValue;
            playerCard = card;
        }
    });

    if (aiMaxCard !== null && player1MinCard !== null) {
        const aiCard = Array.from(aiCards).find((card) => parseInt(card.innerText) === aiMaxCard);
        const playerCard = Array.from(player1Cards).find((card) => parseInt(card.innerText) === player1MinCard);

        if (aiCard && playerCard) {
            const aiCardRect = aiCard.getBoundingClientRect();
            const playerCardRect = playerCard.getBoundingClientRect();

            animateStartX = aiCardRect.left;
            animateStartY = aiCardRect.top;
            animateEndX = playerCardRect.left;
            animateEndY = playerCardRect.top;

            animateCardMove(aiCard, playerCard, animateStartX, animateStartY, animateEndX, animateEndY);

            firstCard = aiCard;
            secondCard = playerCard;
            checkScore(firstCard, aiMaxCard, player1MinCard);
            sideTurn = sideTurn == 'player1' ? 'player2' : 'player1';

            setTimeout(() => {
                checkTurn();
            }, 1000);
        }
    }
}

function createTurnSelectors() {
    gameContainer.appendChild(p1TurnSelector);
    gameContainer.appendChild(p2TurnSelector);
}

function initializeGame() {
    gameContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const side = i < 3 ? 'player1' : 'player2';
        const card = createCard(side);
        gameContainer.appendChild(card);
    }
    checkTurn();
}
    
showScore(0, 0);
initializeGame();
createTurnSelectors();
