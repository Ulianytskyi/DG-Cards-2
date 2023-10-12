const gameContainer = document.getElementById('game-container');


let goalArray = [];

function createCard() {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerText = getRandomNumber();
    card.addEventListener('mousedown', onMouseDown);
    
    return card;
}

function createEmptyZone(className) {
    const emptyCard = document.createElement('div');
    emptyCard.classList.add(className);
    return emptyCard;
}

function getRandomNumber() {
    return Math.floor(Math.random() * 10) + 1;
    // return Math.floor(Math.random() * 2) + 9;
}

let currentCard = null;
let currentValue = null;

let firstCard = null;
let secondCard = null;

let usedCards = [];


function onMouseDown(event) {
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
                
                currentCard == null;
            }
            currentCard.style.transform = 'translate(' + (e.clientX - event.clientX) + 'px, ' + (e.clientY - event.clientY) + 'px)';
            
        };
        
        const onMouseUp = () => {
            currentCard.style.zIndex = '';
            currentCard.style.transform = '';
            currentCard == null;
            usedCards.push(firstCard);
            document.addEventListener('mouseover', onMouseOver);
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            
        };
        
        document.addEventListener('mouseover', onMouseOver);
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    
}

function onMouseOver(event) {

    if (firstCard !== null) {

        if (event.target.classList.contains('place-for-cards')) {
            secondCard = event.target;
            
            if (firstCard !== null && firstCard !== secondCard && secondCard !== null) {
                
                secondCard.className = 'card-on-place';
                secondCard.innerText = currentValue;
                firstCard.classList.add('hide');
                
            }
            secondCard = null;
        }
    
        if (event.target.classList.contains('card-on-place')) {
            secondCard = event.target;
            let newValue = parseInt(secondCard.innerText);
            if (firstCard !== null && firstCard !== secondCard && secondCard !== null) {
                
                if (currentValue > newValue) {
                    secondCard.className = 'card-over-place';
                    secondCard.innerText = currentValue;
                    firstCard.classList.add('hide');
                    newCards(secondCard, 1000);
                } else if (currentValue < newValue) {
                    secondCard.className = 'card-on-place';
                    firstCard.classList.add('hide');
                    newCards(secondCard, 1000);
                } 
                
            }
            secondCard = null;
        }
    }

    firstCard = null;
    currentValue = null;
    
    document.removeEventListener('mouseover', onMouseOver);
}

function newCards(secondCard, time) {

    console.log(usedCards);

    setTimeout(function() {
        secondCard.innerText = '';
        secondCard.className = 'place-for-cards';
        usedCards.forEach((card) => {
            card.innerText = getRandomNumber();
            card.className = 'card';
        });

        usedCards.length = 0;

    }, time);
}


function initializeGame() {
    gameContainer.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        if (i == 3 || i == 5) {
            const emptyZone = createEmptyZone('empty-zone');
            gameContainer.appendChild(emptyZone);
        } else if (i == 4) {
            const placeForCards = createEmptyZone('place-for-cards');
            gameContainer.appendChild(placeForCards);
        } else {

            const card = createCard();
            gameContainer.appendChild(card);
        }
    }
    
}

initializeGame();
