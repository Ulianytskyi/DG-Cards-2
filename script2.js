const coverBlock = document.getElementById('cover');
const gameContainer = document.getElementById('game-container');
const scoreField = document.getElementById('score-field');

let player1Score = 0;
let player2Score = 0;

function showScore(p1, p2) {
    
    const p1value = p1 == 0 ? '' : p1;
    const p2value = p2 == 0 ? '' : p2;
    
    scoreField.innerHTML = `<table>
                                <tr>
                                    <td>Player 1:</td>
                                    <td></td>
                                    <td>${player1Score}</td>
                                    <td class='p1-result'>${p1value}</td>
                                </tr>
                                <tr>
                                    <td>Player 2:</td>
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

let currentCard = null;
let currentValue = null;

let firstCard = null;
let secondCard = null;

let firstTake = null;
let secondTake = null;

let sideTurn = null;

function onMouseDown(event) {

    if (sideTurn == null) {
        sideTurn = event.target.classList[1];
    }
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
            
        };
        
        const onMouseUp = () => {
            currentCard.style.zIndex = '';
            currentCard.style.transform = '';
            currentCard == null;
            
            sideTurn = sideTurn == 'player1' ? 'player2' : 'player1';
            
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
                
                const result = currentValue-newValue;
                checkScore(firstTake, result);
                
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
        }, time);
    } else {
        gameOverScreen();
    }
}

function scoreCalculating(resultValue) {
    let result = resultValue < 0 ? `${resultValue}` : `+${resultValue}`;
    result = resultValue == 0 ? 0 : result;
    return result;
}

function checkScore(firstTake, result) {

    const pointsValue = scoreCalculating(result);
    
    if (firstTake == 'player1') {
        player1Score += result;
        showScore(pointsValue, 0);

    } else {
        player2Score += result;
        showScore(0, pointsValue);
 
    }
    firstCard.classList.add('hide');
    secondCard.classList.add('hide');
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

function initializeGame() {
    gameContainer.innerHTML = '';
    for (let i = 0; i < 6; i++) {
        const side = i < 3 ? 'player1' : 'player2';
        const card = createCard(side);
        gameContainer.appendChild(card);
    }
    
}

initializeGame();
